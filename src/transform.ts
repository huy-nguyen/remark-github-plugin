import visit from 'unist-util-visit';

export interface IOptions {
  marker: string;
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
export const transform = ({marker}: IOptions) => (tree: any) => {
  const visitor = (node: any) => {
    const checkResult = checkNode(marker, node);
    if (checkResult.isCandidate === true) {
      const {language, link, range} = checkResult;
      node.type = 'code';
      node.children = undefined;
      node.lang = (language === undefined) ? null : language;
      node.value = `const link = '${link}';\nconst range = '${range}';`;
    }
  };

  visit(tree, 'paragraph', visitor);
};
