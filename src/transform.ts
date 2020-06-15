import AsyncCache from 'async-disk-cache';
import nodeFetch from 'node-fetch';
import visit from 'unist-util-visit';
import {
  extractLines,
  lineTerminator,
} from './extractLines';
import {
  fetchGithubFile,
} from './fetchGithubContent';
import {
  getHeaderLines,
} from './getHeaderLines';
import {
  ITestOptions,
} from './index';
import {
  wrapInComment,
} from './wrapInComment';

export type Options = {
  marker: string;
  token: string;
  includeLinkHeader: boolean;
} & (
  {insertEllipsisComments: true, ellipsisPhrase: string} |
  {insertEllipsisComments: false}
) & (
  {useCache: true, cacheKey: string} |
  {useCache: false}
);

interface INodeToChange {
  node: any; // Actually a remark paragraph node:
  link: string;
  range: string | undefined;
  language: string | undefined;
}

type CheckResult = {
  isCandidate: true;
  link: string;
  language: string | undefined;
  range: string | undefined;
} | {
  isCandidate: false;
};

const checkNode = (embedMarker: string, node: any): CheckResult => {
  const {children} = node;
  const numChildren = children.length;
  if (numChildren < 3) {
    return {
      isCandidate: false,
    };
  } else {
    const firstChild = children[0];

    const lastChild = children[numChildren - 1];

    const [linkChild ] = children.slice(1, numChildren - 1);

    if (firstChild.type === 'text' &&
        firstChild.value.trim().includes(embedMarker) &&
        lastChild.type === 'text' &&
        lastChild.value.trim().includes(embedMarker) &&
        linkChild.type === 'link') {

      // Ref https://stackoverflow.com/a/14912552/7075699
      const matched = lastChild.value.trim().match(/\S+/g);
      let range: string | undefined, language: string | undefined;
      if (matched.length === 3) {
        // If there are 2 settings, the first is the language and the second the
        // range:
        language = matched[0];
        range = matched[1];
      } else if (matched.length === 2) {
        // If there's only one option provided, it's the language:
        language = matched[0];
        range = undefined;
      } else {
        range = undefined;
        language = undefined;
      }

      return {
        isCandidate: true,
        link: linkChild.url,
        range,
        language,
      };
    } else {
      return {
        isCandidate: false,
      };
    }

  }

};

type CacheInTransform = {
  useCache: true, cache: any;
} | {
  useCache: false;
};
export const transform =
    (options: Options, testOptions?: ITestOptions) => (tree: any) => new Promise(async (resolve) => {

  let fetchFunction: typeof nodeFetch, cacheSettings: CacheInTransform;
  if (testOptions === undefined) {
    fetchFunction = nodeFetch;
    if (options.useCache === true) {
      cacheSettings = {useCache: true, cache: new AsyncCache(options.cacheKey)};
    } else {
      cacheSettings = {useCache: false};
    }
  } else {
    fetchFunction = testOptions._fetch;
    if (options.useCache === true) {
      cacheSettings = {useCache: true, cache: testOptions._cache};
    } else {
      cacheSettings = {useCache: false};
    }
  }

  const {marker, token} = options;
  const nodesToChange: INodeToChange[] = [];
  const visitor = (node: any) => {
    const checkResult = checkNode(marker, node);
    if (checkResult.isCandidate === true) {
      const {language, link, range} = checkResult;
      nodesToChange.push({node, link, range, language});
    }
  };

  visit(tree, 'paragraph', visitor);

  for (const {node, link, language, range} of nodesToChange) {
    node.type = 'code';
    node.children = undefined;
    node.lang = (language === undefined) ? null : language;

    // If cache is enabled, attempt to read from the cache before sending AJAX
    // request:
    let rawFileContent: string;
    if (cacheSettings.useCache === true) {
      const {cache} = cacheSettings;
      const cacheCheckResult = await cache.get(link);
      if (cacheCheckResult.isCached === true) {
        rawFileContent = cacheCheckResult.value;
      } else {
        rawFileContent = await fetchGithubFile(link, token, fetchFunction);
        await cache.set(link, rawFileContent);
      }
    } else {
      rawFileContent = await fetchGithubFile(link, token, fetchFunction);
    }

    const includeLinkHeader = options.includeLinkHeader == null ? true : options.includeLinkHeader;
    const headerLines = includeLinkHeader ? getHeaderLines(link, language) : [];

    let fileContent: string;
    if (range === undefined) {
      // Simply add the header to the beginning of the fetched file if there are
      // no line ranges to process:
      fileContent = [
        ...headerLines,
        ...rawFileContent.split(lineTerminator),
      ].join(lineTerminator);
    } else {
      let ellipsisComment: string | undefined;
      if (options.insertEllipsisComments === true) {
        ellipsisComment = wrapInComment(options.ellipsisPhrase, language);
      } else {
        ellipsisComment = undefined;
      }
      fileContent = extractLines(rawFileContent, range, headerLines, ellipsisComment);
    }

    node.value = fileContent;
  }
  resolve();
});
