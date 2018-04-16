import fetch from 'node-fetch';
import {
  fetchGithubFile,
} from '../fetchGithubContent';

jest.mock('node-fetch');
const token = process.env.GITHUB_TOKEN;

test('Should handle failed AJAX request to valid GitHub URL', async () => {
  expect.assertions(1);
  fetch.mockRejectedValue(new Error('Network error'));
  try {
    await fetchGithubFile(
      'https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc', token, fetch
    );
  } catch (e) {
    expect(e.message).toMatch(/Network error/);
  }
});
