import {
  fetchGithubFile,
} from '../fetchGithubContent';
import fetch from 'node-fetch';

const token = process.env.GITHUB_TOKEN;

test('Should succeed with valid GitHub URL', async () => {
  const actual = await fetchGithubFile(
    'https://github.com/lodash/lodash/blob/2900cfd/sumBy.js',
    token,
    fetch,
  );
  expect(actual.startsWith('import baseIteratee from \'./_baseIteratee.js\';')).toBe(true);
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
      'https://github.com/lodash/lodash/blob/2900cfd/someFile.js',
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
      'https://github.com/lodash/lodash/tree/2900cfd/.github',
      token,
      fetch
    );
  } catch (e) {
    expect(e.message).toMatch(/is not a file/i);
  }
});
