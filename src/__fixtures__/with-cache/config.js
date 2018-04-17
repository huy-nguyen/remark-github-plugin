module.exports = {
  pluginOptions: {
    marker: 'GITHUB-EMBED',
    insertEllipsisComments: true,
    ellipsisPhrase: '...',
    token: process.env.GITHUB_TOKEN,
    useCache: true,
    cacheKey: 'test-cache',
  },
  assertFetchCalls: 1,
};
