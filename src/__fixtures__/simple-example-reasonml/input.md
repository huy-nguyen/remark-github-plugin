This is a test of the plugin

Should not include language or range in code block:

GITHUB-EMBED https://github.com/Schniz/fnm/blob/8cb998759ef969685d711eb4299d91d2b78fe37e/library/Fs.re GITHUB-EMBED

Should include language but not range in code block:

GITHUB-EMBED https://github.com/Schniz/fnm/blob/8cb998759ef969685d711eb4299d91d2b78fe37e/library/Fs.re reason GITHUB-EMBED

Should include language and range in code block:

GITHUB-EMBED https://github.com/Schniz/fnm/blob/8cb998759ef969685d711eb4299d91d2b78fe37e/library/Fs.re reason 1,3-7,19 GITHUB-EMBED

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed
