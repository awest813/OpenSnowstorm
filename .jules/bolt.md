## 2024-03-07 - Typeof Classes is Function
**Learning:** In JavaScript, when checking the values of an object map that contains classes (like `server_packet` definitions), using `typeof value === 'object'` will incorrectly filter them out because `typeof class {}` evaluates to `'function'`, not `'object'`.
**Action:** When building cache maps over object values that may be classes, do not strictly enforce `typeof === 'object'`. Instead, check for the presence of the specific properties you need (e.g. `if (cls && cls.code !== undefined)`).
