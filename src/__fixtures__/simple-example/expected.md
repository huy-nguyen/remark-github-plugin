This is a test of the plugin

Should not include language or range in code block:

```
{
  "presets": [
    [
      "env", {
        "targets": {
          "node": "current",
        },
        "spec": true
      }
    ]
  ],
  "plugins": [
  ]
}

```

Should include language but not range in code block:

```javascript
{
  "presets": [
    [
      "env", {
        "targets": {
          "node": "current",
        },
        "spec": true
      }
    ]
  ],
  "plugins": [
  ]
}

```

Should include language and range in code block:

```javascript
{
// ...
        "targets": {
          "node": "current",
        },
        "spec": true
        // ...
}
```

Should not transform this:

GITHUB-EMBED GITHUB-EMBED

Should not transform this either:

GITHUB-EMBED

Some text following embed
