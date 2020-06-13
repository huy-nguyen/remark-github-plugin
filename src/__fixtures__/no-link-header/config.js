module.exports = {
  pluginOptions: {
    marker: 'GITHUB-EMBED',
    insertEllipsisComments: true,
    ellipsisPhrase: '...',
    token: process.env.GITHUB_TOKEN,
    useCache: false,
    includeLinkHeader: false,
  },
  assertFetchCalls: 2,
};
