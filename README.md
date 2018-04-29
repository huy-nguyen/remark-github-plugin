# remark-github-plugin

[![Greenkeeper badge](https://badges.greenkeeper.io/huy-nguyen/remark-github-plugin.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/remark-github-plugin.svg?style=flat-square)](https://www.npmjs.com/package/remark-github-plugin)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)
[![CircleCI](https://circleci.com/gh/huy-nguyen/remark-github-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/huy-nguyen/remark-github-plugin/tree/master)
[![codecov](https://codecov.io/gh/huy-nguyen/remark-github-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/huy-nguyen/remark-github-plugin)

This `remark` plugin replace links to GitHub files with the actual content of those files, wrapped in Markdown code blocks that can optionally be further processed by a syntax highlighter (e.g. [Prism](http://prismjs.com/)).

## Prerequisites

- [NodeJS](https://nodejs.org/en/download/current/). The plugin has been tested on Node 9.
- `npm` or [`yarn`](https://yarnpkg.com/en/docs/getting-started).

## Installation

Install with `npm` or `yarn`:
```bash
npm install remark-github-plugin
# or:
yarn add remark-github-plugin
```

## Usage

First, [create a GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with the `public_repo` scope (if you only need to access public repos) or `repo` scope (if you need to also access private repos).


```javascript
const {plugin} = require('remark-github-plugin');
const remark = require('remark');

const pluginOptions = {
  marker: 'GITHUB-EMBED',
  insertEllipsisComments: true,
  ellipsisPhrase: '...',
  useCache: true,
  cacheKey: 'remark-github-plugin-v1',
  token: '<Your Github Token>',
}

const processor = remark().data(

  // This is optional but recommended. If `fences` is `true`, code blocks with
  // no explicitly set language will be rendered as code blocks. Othewise, they
  // will be rendered as text.
  'settings', {fences: true}
).use(
  plugin, pluginOptions
)

// Read file content:
const fs = require('fs');
const input = fs.readFileSync('path/to/some/markdown/file.md');

// Process input with plugin:
process.process(input, (err, output) => {
  if (err) {
    throw new Error(err);
  }

  console.log(output.contents);
})
```

## Sample input and output

To embed a GitHub file, copy theURL of that file from the browser's location bar and paste it into a new Markdown paragraph that begins and ends with the `marker` phrase. Preferably, that URL should be a [permanent link](https://help.github.com/articles/getting-permanent-links-to-files/) so that the content you're pointing to doesn't change without your knowledge in the future.

For example, with the above config, to embed the file [https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc](https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc), do this:

![Sample input with no language and no line range](img/no-language-no-range-input.png)

This is the Markdown output of the plugin:

![Sample output with no language and no line range](img/no-language-no-range-output.png)

You can specify what syntax highlighting should be used by adding a [PrismJs-compatible language code](http://prismjs.com/#languages-list):

![Sample input with language but no line range](img/have-language-no-range-input.png)

This is the Markdown output of the plugin:

![Sample output with language but no line range](img/have-language-no-range-output.png)

You can even pick out individual lines or line ranges from the file.

![Sample input with language and line range](img/have-language-have-range-input.png)

This is the Markdown output of the plugin:

![Sample output with language and line range](img/have-language-have-range-output.png)

For a list of supported notations, [click here](https://github.com/euank/node-parse-numeric-range#supported-expressions).

## Configuration
- `marker` (`string`, required): a string to mark the start and end of an embed block e.g. `GITHUB-EMBED`. This string should not have any special Markdown formatting in there. For exapmle, `GITHUB_EMBED` won't work because before this plugin ever sees that phrase, `remark` would have processed it into a `GITHUB` regular text node and an `EMBED` italicized text node, causing this plugin to not recognize the marker.
- `insertEllipsisComments` (`boolean`, required): whether or not to insert line comments between noncontiguous portions of code. For example, if you chose to insert only lines 1 and 4 of a file into a code block, setting this to `true` will insert a line comment like `// ...` between lines 1 and 4.
  - `ellipsisPhrase` (`string`, required if `insertEllipsisComments` is `true`): The phrase to follow the line comment marker. For example `...` will insert `// ...` between noncontiguous portions of code.
- `useCache` (`boolean`, required): if `true`, the responses of AJAX calls to GitHub will be cached.
  - `cacheKey` (`string`, required if `useCache` is true): this is used for cache busting or to differentiate between potentially other caches stored by [`async-disk-cache`](https://www.npmjs.com/package/async-disk-cache) (which is the caching library used by this package).
- `token` (`string`, required): A [GitHub personal access token](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) with the [`public_repo` scope](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/#available-scopes) (if you only need to fetch content from public repos) or [`repo` scope](https://developer.github.com/apps/building-oauth-apps/scopes-for-oauth-apps/#available-scopes) (if you need to also access private repos).

## Contributors

Thanks goes to these people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/7352279?v=4" width="100px;"/><br /><sub><b>Huy Nguyen</b></sub>](https://www.huynguyen.io/)<br />[📝](#blog-huy-nguyen "Blogposts") [🐛](https://github.com/huy-nguyen/remark-github-plugin/issues?q=author%3Ahuy-nguyen "Bug reports") [💻](https://github.com/huy-nguyen/remark-github-plugin/commits?author=huy-nguyen "Code") [📖](https://github.com/huy-nguyen/remark-github-plugin/commits?author=huy-nguyen "Documentation") [💡](#example-huy-nguyen "Examples") [🤔](#ideas-huy-nguyen "Ideas, Planning, & Feedback") [🚇](#infra-huy-nguyen "Infrastructure (Hosting, Build-Tools, etc)") [👀](#review-huy-nguyen "Reviewed Pull Requests") [⚠️](https://github.com/huy-nguyen/remark-github-plugin/commits?author=huy-nguyen "Tests") [🔧](#tool-huy-nguyen "Tools") [✅](#tutorial-huy-nguyen "Tutorials") |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.
Contributions of any kind welcome!
