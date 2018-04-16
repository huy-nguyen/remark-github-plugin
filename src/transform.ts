import nodeFetch from 'node-fetch';
import visit from 'unist-util-visit';
import {
  extractLines,
} from './extractLines';
import {
  fetchGithubFile,
} from './fetchGithubContent';
import {
  ITestOptions,
} from './index';
import {
  wrapInComment,
} from './wrapInComment';

export type Options = {
  marker: string;
  token: string;
} & (
  {insertEllipsisComments: true, ellipsisPhrase: string} |
  {insertEllipsisComments: false}
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
    const firstChildContent = firstChild.value.trim();

    const lastChild = children[numChildren - 1];
    const lastChildContent = lastChild.value.trim();

    const [linkChild ] = children.slice(1, numChildren - 1);

    if (firstChild.type === 'text' &&
        firstChildContent.includes(embedMarker) &&
        lastChild.type === 'text' &&
        lastChildContent.includes(embedMarker) &&
        linkChild.type === 'link') {

      // Ref https://stackoverflow.com/a/14912552/7075699
      const matched = lastChildContent.match(/\S+/g);
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
export const transform =
    (options: Options, testOptions?: ITestOptions) => (tree: any) => new Promise(async (resolve) => {

  let fetchFunction: typeof nodeFetch;
  if (testOptions === undefined) {
    fetchFunction = nodeFetch;
  } else {
    fetchFunction = testOptions._fetch;
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
    const rawFileContent = await fetchGithubFile(link, token, fetchFunction);

    let fileContent: string;
    if (range === undefined) {
      fileContent = rawFileContent;
    } else {
      let ellipsisComment: string | undefined;
      if (options.insertEllipsisComments === true) {
        ellipsisComment = wrapInComment(options.ellipsisPhrase, language);
      } else {
        ellipsisComment = undefined;
      }
      fileContent = extractLines(rawFileContent, range, ellipsisComment);
    }

    node.value = fileContent;
  }
  resolve();
});
