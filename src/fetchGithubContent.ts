import parse from 'github-url-parse';
import nodeFetch, {
  Response,
} from 'node-fetch';

export const fetchGithubFile =
  async (githubUrl: string, token: string, fetchFunction: typeof nodeFetch): Promise<string> => {

  const parseResult = parse(githubUrl);
  if (parseResult !== null) {
    // If the provided URL is a valid GitHub URL:
    const {branch, path, repo, user} = parseResult;
    const fetchUrl = `https://api.github.com/repos/${user}/${repo}/contents/${path}?ref=${branch}`;

    let response: Response;
    try {
      response = await fetchFunction(fetchUrl, {
        headers: {
          Authorization: `token ${token}`,
        },
      });

      // If AJAX call succeeds:

      const json = await response.json();
      if (response.ok === true) {
        // If requested URL actually exists on GitHub:
        if (json.type === 'file') {
          // If fetched content is a file instead of directory:
          const contentAsString = Buffer.from(json.content, 'base64').toString('utf8');
          return contentAsString;
        } else {
          throw new Error(githubUrl + ' is not a file');
        }
      } else {
        // Try to create a nice error message if content doesn't exist for given URL:
        const {statusText} = response;

        let errorMessage;
        if (json.message) {
          errorMessage = `${statusText}: ${json.message}`;
        } else {
          errorMessage = statusText;
        }
        throw new Error(errorMessage);
      }

    } catch (e) {
      throw new Error(e);
    }
  } else {
    throw new Error(githubUrl + ' is not an accepted GitHub URL');
  }
};
