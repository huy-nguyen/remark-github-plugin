import visit from 'unist-util-visit';

export interface IOptions {
  marker: string;
}

type CheckResult = {
  isCandidate: true;
  link: string;
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
        firstChildContent === embedMarker &&
        lastChild.type === 'text' &&
        lastChildContent.includes(embedMarker) &&
        linkChild.type === 'link') {

      return {
        isCandidate: true,
        link: linkChild.url,
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
      node.type = 'code';
      node.children = undefined;
      node.lang = 'js';
      node.value = `const link = '${checkResult.link}';`;
    }
  };

  visit(tree, 'paragraph', visitor);
};
