module.exports = {
  pluginOptions: {
    marker: 'GITHUB-EMBED',
    insertEllipsisComments: false,
    token: process.env.GITHUB_TOKEN,
    useCache: false,
  },
  assertFetchCalls: 1,
};
