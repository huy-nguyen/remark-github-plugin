This is a test of the plugin

Should not include language or range in code block:

GITHUB-EMBED https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc GITHUB-EMBED

Should include language but not range in code block:

GITHUB-EMBED https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc javascript GITHUB-EMBED

Should include language and range in code block:

GITHUB-EMBED https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc javascript 1,5-8,14 GITHUB-EMBED

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed
