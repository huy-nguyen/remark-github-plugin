This is a test of the plugin

Should include language and range in code block:

```javascript
/**
 * https://github.com/lodash/lodash/blob/2900cfd/sumBy.js
 */
import baseIteratee from './_baseIteratee.js';
import baseSum from './_baseSum.js';
function sumBy(array, iteratee) {
  return (array && array.length)
    ? baseSum(array, baseIteratee(iteratee, 2))
    : 0;
}
```
