import {
  fetchGithubFile,
} from '../fetchGithubContent';
import fetch from 'node-fetch';

const token = process.env.GITHUB_TOKEN;

test('Should succeed with valid GitHub URL', async () => {
  const actual = await fetchGithubFile(
    'https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc',
    token,
    fetch,
  );
  expect(actual.startsWith('{\n  "presets": [')).toBe(true);
});

test('Should throw if called with invalid GitHub URL', async () => {
  expect.assertions(1);
  try {
    await fetchGithubFile('example.com', token, fetch);
  } catch (e) {
    expect(e.message).toMatch(/is not an accepted GitHub URL/i);
  }
});

test('Should throw when given URL points to non-existent GitHub content', async () => {
  expect.assertions(1);
  try {
    await fetchGithubFile(
      'https://github.com/huy-nguyen/squarify/blob/d7074c2/someFile',
      token,
      fetch
    );
  } catch (e) {
    expect(e.message).toMatch(/Not Found/i);
  }
});

test('Should throw when given URL points to a GitHub directory', async () => {
  expect.assertions(1);
  try {
    await fetchGithubFile(
      'https://github.com/huy-nguyen/squarify/blob/d7074c2/src',
      token,
      fetch
    );
  } catch (e) {
    expect(e.message).toMatch(/is not a file/i);
  }
});
