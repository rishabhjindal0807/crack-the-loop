// Page 2 of Rishabh's LeetCode practice history: problems not on the site yet.

export const arraysLc2 = [
  {
    id: 'running-sum',
    title: 'Running Sum of 1d Array',
    difficulty: 'Easy',
    lc: 'running-sum-of-1d-array',
    tags: ['prefix-sum'],
    statement: 'Return `runningSum[i] = nums[0] + … + nums[i]`.',
    approaches: [
      {
        name: 'In-place prefix sum',
        time: 'O(n)',
        space: 'O(1) extra',
        code: `
          function runningSum(nums) {
            for (let i = 1; i < nums.length; i++) nums[i] += nums[i - 1];
            return nums;
          }
        `,
      },
    ],
    explanation: 'This is the prefix-sum array from Lec 2 — the building block for Range Sum Query and Subarray Sum Equals K.',
    fn: 'runningSum',
    tests: [
      { args: [[1, 2, 3, 4]], expected: [1, 3, 6, 10] },
      { args: [[3, 1, 2, 10, 1]], expected: [3, 4, 6, 16, 17] },
    ],
  },
  {
    id: 'find-pivot-index',
    title: 'Find Pivot Index',
    difficulty: 'Easy',
    lc: 'find-pivot-index',
    tags: ['prefix-sum'],
    statement: 'Return the leftmost index where the sum of elements to its left equals the sum to its right, or −1.\n\n**Example:** `[1,7,3,6,5,6]` → `3`',
    approaches: [
      {
        name: 'Total sum + running left sum',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Right sum at i = `total − left − nums[i]`. Check `left === right`, then add nums[i] to left.',
        code: `
          function pivotIndex(nums) {
            const total = nums.reduce((a, b) => a + b, 0);
            let left = 0;
            for (let i = 0; i < nums.length; i++) {
              if (left === total - left - nums[i]) return i;
              left += nums[i];
            }
            return -1;
          }
        `,
      },
    ],
    fn: 'pivotIndex',
    tests: [
      { args: [[1, 7, 3, 6, 5, 6]], expected: 3 },
      { args: [[1, 2, 3]], expected: -1 },
      { args: [[2, 1, -1]], expected: 0 },
    ],
  },
];

export const mathsLc2 = [
  {
    id: 'divisibility-digit-sum-product',
    title: 'Check Divisibility by Digit Sum and Product',
    difficulty: 'Easy',
    lc: 'check-divisibility-by-digit-sum-and-product',
    tags: ['math', 'digits'],
    statement: 'Return true if `n` is divisible by (sum of its digits + product of its digits).\n\n**Example:** `99` → `true` (18 + 81 = 99), `23` → `false` (5 + 6 = 11)',
    approaches: [
      {
        name: 'Extract digits with % 10',
        time: 'O(d)',
        space: 'O(1)',
        code: `
          function checkDivisibility(n) {
            let sum = 0, product = 1;
            for (let x = n; x > 0; x = Math.floor(x / 10)) {
              const d = x % 10;
              sum += d;
              product *= d;
            }
            return n % (sum + product) === 0;
          }
        `,
      },
    ],
    explanation: 'The `x % 10` / `⌊x / 10⌋` loop is the same digit-extraction pattern as Palindrome Number and Reverse Integer.',
    fn: 'checkDivisibility',
    tests: [
      { args: [99], expected: true },
      { args: [23], expected: false },
      { args: [10], expected: true, label: 'product 0 → divisor 1' },
      { args: [12], expected: false },
    ],
  },
];

// LeetCode "30 Days of JavaScript" — closures, prototypes, promises and timers.
export const jsChallenges = {
  id: 'js-challenges',
  title: 'JavaScript Challenges (30 Days of JS)',
  icon: '🟨',
  source: 'curriculum',
  lecture: 'LeetCode 30 Days of JS',
  blurb: 'Closures, prototype extensions, promises and timers — the JS-specific problems frontend rounds love.',
  concepts: `
    - These problems test **language mechanics**, not algorithms: closures keep private state, \`Array.prototype\` methods use \`this\`, promises wrap timers, and \`setTimeout\` ids let you cancel work.
    - Extending built-in prototypes is fine for a puzzle but avoid it in production code — it can clash with future language features.
    - More of the same in the UI section → Machine coding & polyfills (debounce, throttle, Promise.all, EventEmitter, memoize, curry).
  `,
  questions: [
    {
      id: 'counter',
      title: 'Counter (closure)',
      difficulty: 'Easy',
      lc: 'counter',
      tags: ['closure'],
      statement: '`createCounter(n)` returns a function that returns `n` the first time, then `n + 1`, `n + 2`, …',
      approaches: [
        {
          name: 'Closure over n',
          time: 'O(1) per call',
          space: 'O(1)',
          idea: 'The inner function keeps a reference to `n` from the outer call — post-increment returns the old value, then bumps it.',
          code: `
            function createCounter(n) {
              return function () {
                return n++;
              };
            }
          `,
        },
      ],
      fn: 'createCounter',
      check: (_got, _args, _t, impl) => {
        const c = impl(10);
        const d = impl(-2);
        return c() === 10 && c() === 11 && d() === -2 && c() === 12 && d() === -1;
      },
      tests: [{ args: [10], label: 'two independent counters' }],
    },
    {
      id: 'array-prototype-last',
      title: 'Array Prototype Last',
      difficulty: 'Easy',
      lc: 'array-prototype-last',
      tags: ['prototype', 'this'],
      statement: 'Add `array.last()` returning the last element, or −1 for an empty array.',
      approaches: [
        {
          name: 'Method on Array.prototype',
          time: 'O(1)',
          space: 'O(1)',
          idea: 'Inside a prototype method, `this` is the array it was called on. Use a regular function (an arrow function would not get that `this`).',
          code: `
            Array.prototype.last = function () {
              return this.length ? this[this.length - 1] : -1;
            };
            function lastOf(arr) {
              return arr.last();
            }
          `,
        },
      ],
      fn: 'lastOf',
      tests: [
        { args: [[null, {}, 3]], expected: 3 },
        { args: [[]], expected: -1 },
      ],
    },
    {
      id: 'sleep',
      title: 'Sleep',
      difficulty: 'Easy',
      lc: 'sleep',
      tags: ['promise', 'timers'],
      statement: 'Write `sleep(millis)` that returns a promise resolving after `millis` milliseconds.',
      approaches: [
        {
          name: 'Promise around setTimeout',
          time: 'O(1)',
          space: 'O(1)',
          code: `
            function sleep(millis) {
              return new Promise((resolve) => setTimeout(resolve, millis));
            }
          `,
        },
      ],
      explanation: 'Usage: `await sleep(100)`. The same wrapper is the backoff delay in the retry-with-backoff polyfill (UI section).',
      fn: 'sleep',
      check: (got) => got instanceof Promise,
      tests: [{ args: [10], label: 'returns a Promise' }],
    },
    {
      id: 'cache-with-time-limit',
      title: 'Cache With Time Limit',
      difficulty: 'Medium',
      lc: 'cache-with-time-limit',
      tags: ['design', 'map', 'timers'],
      statement: '`set(key, value, duration)` returns true if an **unexpired** key already existed (and overwrites it). `get(key)` returns the value or −1 if missing/expired. `count()` returns the number of unexpired keys.',
      approaches: [
        {
          name: 'Map of value + timeout id',
          time: 'O(1) per op',
          space: 'O(n)',
          idea: 'Store `{ value, timer }`. On overwrite, `clearTimeout` the old timer so it can’t delete the new entry early. Each timer deletes its key when it expires.',
          code: `
            class TimeLimitedCache {
              constructor() { this.store = new Map(); }
              set(key, value, duration) {
                const existed = this.store.has(key);
                if (existed) clearTimeout(this.store.get(key).timer);
                const timer = setTimeout(() => this.store.delete(key), duration);
                this.store.set(key, { value, timer });
                return existed;
              }
              get(key) {
                return this.store.has(key) ? this.store.get(key).value : -1;
              }
              count() {
                return this.store.size;
              }
            }
          `,
        },
      ],
      explanation: 'Alternative without timers: store an `expiresAt` timestamp and check it lazily in `get`/`count` — this is how Redis-style TTL caches avoid one timer per key.',
      kind: 'class',
      fn: 'TimeLimitedCache',
      tests: [
        {
          ops: ['TimeLimitedCache', 'set', 'get', 'set', 'get', 'count', 'get'],
          args: [[], [1, 42, 100], [1], [1, 50, 100], [1], [], [2]],
          expected: [null, false, 42, true, 50, 1, -1],
        },
      ],
    },
    {
      id: 'snail-traversal',
      title: 'Snail Traversal',
      difficulty: 'Medium',
      lc: 'snail-traversal',
      tags: ['prototype', 'matrix'],
      statement: 'Add `array.snail(rows, cols)` that fills a rows×cols matrix column by column, going **down** the first column, **up** the second, down the third… Return `[]` if `rows · cols !== length`.',
      approaches: [
        {
          name: 'Index arithmetic per column',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Element i belongs to column `⌊i / rows⌋`. In even columns the row is `i % rows`; in odd columns it is `rows − 1 − i % rows`.',
          code: `
            Array.prototype.snail = function (rows, cols) {
              if (rows * cols !== this.length) return [];
              const out = Array.from({ length: rows }, () => new Array(cols));
              for (let i = 0; i < this.length; i++) {
                const c = Math.floor(i / rows), k = i % rows;
                out[c % 2 === 0 ? k : rows - 1 - k][c] = this[i];
              }
              return out;
            };
            function snailOf(arr, rows, cols) {
              return arr.snail(rows, cols);
            }
          `,
        },
      ],
      fn: 'snailOf',
      tests: [
        {
          args: [[19, 10, 3, 7, 9, 8, 5, 2, 1, 17, 16, 14, 12, 18, 6, 13, 11, 20, 4, 15], 5, 4],
          expected: [[19, 17, 16, 15], [10, 1, 14, 4], [3, 2, 12, 20], [7, 5, 18, 11], [9, 8, 6, 13]],
        },
        { args: [[1, 2, 3, 4], 1, 4], expected: [[1, 2, 3, 4]] },
        { args: [[1, 3], 2, 2], expected: [] },
      ],
    },
  ],
};
