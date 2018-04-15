import fetch from 'node-fetch';

export const fetchGithubFile = async () => {
  // tslint:disable-next-line:max-line-length
  const url = 'https://api.github.com/repos/huy-nguyen/squarify/contents/.babelrc?branch=d7074c2c91cfceeb9a91bd995a7f92a1e6702886';
  const response = await fetch(url);
  const {content: base64Content} = await response.json();
  const contentAsString = Buffer.from(base64Content, 'base64').toString('utf8');
  return contentAsString;
};
