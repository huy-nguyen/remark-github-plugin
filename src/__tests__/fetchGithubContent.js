import {
  fetchGithubFile,
} from '../fetchGithubContent';

test('Should succeed with sample request', async () => {
  const actual = await fetchGithubFile();
  expect(actual.startsWith('{\n  "presets": [')).toBe(true);
});
