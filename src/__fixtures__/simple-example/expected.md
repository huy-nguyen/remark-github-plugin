This is a test of the plugin

Should not include language or range in code block:

```
const link = 'https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc';
const range = 'undefined';
```

Should include language but not range in code block:

```javascript
const link = 'https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc';
const range = 'undefined';
```

Should include language and range in code block:

```javascript
const link = 'https://github.com/huy-nguyen/squarify/blob/d7074c2/.babelrc';
const range = '1,3-5';
```

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed
