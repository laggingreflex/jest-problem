# jest-problem

Reproduction repo for the following error:

Here is the error I'm getting:

```javascript
    [vue-jest] Error: Vue template compilation failed

      1 | import { shallowMount } from '@vue/test-utils'
    > 2 | import Problem from './../../src/components/Problem.vue'
        | ^
      3 |
      4 | describe('Problem.vue', () => {
      5 |     it('initializes and sets up correctly', () => {

      at error (node_modules/vue-jest/lib/throw-error.js:2:9)
      at Object.<anonymous> (tests/unit/problem.spec.js:2:1)
```
