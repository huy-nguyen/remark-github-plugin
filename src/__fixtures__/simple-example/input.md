This is a test of the plugin

Should not include language or range in code block:

GITHUB-EMBED https://github.com/lodash/lodash/blob/2900cfd/sumBy.js GITHUB-EMBED

Should include language but not range in code block:

GITHUB-EMBED https://github.com/lodash/lodash/blob/2900cfd/sumBy.js javascript GITHUB-EMBED

Should include language and range in code block:

GITHUB-EMBED https://github.com/lodash/lodash/blob/2900cfd/sumBy.js javascript 1,2,27-31 GITHUB-EMBED

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed
