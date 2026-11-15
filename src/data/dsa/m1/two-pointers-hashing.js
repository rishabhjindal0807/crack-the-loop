// New problems from Lec 11 (2 Pointers), Lec 12 (Hashing 1 & 2) and IL7 (2 Pointers & Hashing).

export const twoPointersExtra = [
  {
    id: 'two-sum-sorted-indices',
    title: 'Two Sum by Sorting + Two Pointers (return original indices)',
    difficulty: 'Easy',
    lc: 'two-sum',
    from: 'Lec 11 – 2 Pointers',
    tags: ['two-pointers', 'sorting'],
    statement: 'Return the original indices `[i, j]` (i < j) of two numbers summing to `target`, using sort + two pointers instead of a hash map.\n\n**Example:** `[2,7,11,15], 9` → `[0,1]`',
    approaches: [
      {
        name: 'Pair with index, sort, two pointers',
        time: 'O(n log n)',
        space: 'O(n)',
        idea: 'Sorting loses positions, so sort `[value, index]` pairs (as in the class notes). Move `left` up when the sum is too small, `right` down when too large.',
        code: `
          function twoSum(nums, target) {
            const pairs = nums.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
            let l = 0, r = pairs.length - 1;
            while (l < r) {
              const sum = pairs[l][0] + pairs[r][0];
              if (sum === target) return [pairs[l][1], pairs[r][1]].sort((a, b) => a - b);
              if (sum < target) l++;
              else r--;
            }
            return [];
          }
        `,
      },
    ],
    explanation: 'Trade-off vs the hash map version: O(n log n) and no extra hash map — and it generalises to 3Sum/4Sum. If the input is **already sorted** (LC 167) this is O(n) and O(1) space.',
    fn: 'twoSum',
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[15, 11, 7, 2], 9], expected: [2, 3] },
    ],
  },
  {
    id: 'pairs-two-unsorted-arrays',
    title: 'All Pairs from Two Unsorted Arrays with Sum x',
    difficulty: 'Easy',
    lc: 'https://www.geeksforgeeks.org/problems/find-all-pairs-whose-sum-is-x5808/1',
    from: 'Lec 11 – 2 Pointers (Bosscoder notes)',
    tags: ['two-pointers', 'hashing'],
    statement: 'Given arrays `A` and `B` (distinct elements) and `x`, return all pairs `[a, b]` with `a ∈ A`, `b ∈ B`, `a + b = x`, sorted by `a`.\n\n**Example:** `A=[1,2,4,5,7], B=[5,6,3,4,8], x=9` → `[[1,8],[4,5],[5,4]]`',
    approaches: [
      {
        name: 'Brute force',
        time: 'O(n·m)',
        space: 'O(1)',
        code: `
          function allPairs(A, B, x) {
            const out = [];
            for (const a of A) for (const b of B) if (a + b === x) out.push([a, b]);
            return out.sort((p, q) => p[0] - q[0]);
          }
        `,
      },
      {
        name: 'Sort both + two pointers',
        time: 'O(n log n + m log m)',
        space: 'O(1) extra',
        idea: '`i` walks A from the smallest, `j` walks B from the largest. Sum too big → j--, too small → i++.',
        code: `
          function allPairs(A, B, x) {
            const a = [...A].sort((p, q) => p - q), b = [...B].sort((p, q) => p - q);
            const out = [];
            let i = 0, j = b.length - 1;
            while (i < a.length && j >= 0) {
              const s = a[i] + b[j];
              if (s === x) { out.push([a[i], b[j]]); i++; j--; }
              else if (s < x) i++;
              else j--;
            }
            return out;
          }
        `,
      },
    ],
    fn: 'allPairs',
    tests: [
      { args: [[1, 2, 4, 5, 7], [5, 6, 3, 4, 8], 9], expected: [[1, 8], [4, 5], [5, 4]] },
      { args: [[-1, -2, 4, -6, 5, 7], [6, 3, 4, 0], 8], expected: [[4, 4], [5, 3]] },
      { args: [[1, 2], [10, 20], 5], expected: [] },
    ],
  },
  {
    id: 'k-diff-pairs',
    title: 'K-diff Pairs in an Array',
    difficulty: 'Medium',
    lc: 'k-diff-pairs-in-an-array',
    from: 'Lec 11 – 2 Pointers',
    tags: ['two-pointers', 'hashing'],
    statement: 'Return the number of **unique** pairs `(a, b)` with `|a − b| = k`.\n\n**Example:** `[3,1,4,1,5], k=2` → `2` ((1,3), (3,5))',
    approaches: [
      {
        name: 'Sort + two pointers',
        time: 'O(n log n)',
        space: 'O(1) extra',
        idea: 'With sorted `a`, keep `j > i`. If `a[j] − a[i] < k` move j; if `> k` move i; if equal count it and skip duplicates of `a[i]`.',
        code: `
          function findPairs(nums, k) {
            const a = [...nums].sort((x, y) => x - y);
            let i = 0, j = 1, count = 0;
            while (j < a.length) {
              if (i === j || a[j] - a[i] < k) j++;
              else if (a[j] - a[i] > k) i++;
              else {
                count++;
                const v = a[i];
                while (i < a.length && a[i] === v) i++;
                if (j <= i) j = i + 1;
              }
            }
            return count;
          }
        `,
      },
      {
        name: 'Frequency map',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'For k > 0 count distinct x with `x + k` present; for k = 0 count values appearing at least twice.',
        code: `
          function findPairs(nums, k) {
            const freq = new Map();
            for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
            let count = 0;
            for (const [x, f] of freq) {
              if (k === 0 ? f > 1 : freq.has(x + k)) count++;
            }
            return count;
          }
        `,
      },
    ],
    fn: 'findPairs',
    tests: [
      { args: [[3, 1, 4, 1, 5], 2], expected: 2 },
      { args: [[1, 2, 3, 4, 5], 1], expected: 4 },
      { args: [[1, 3, 1, 5, 4], 0], expected: 1 },
      { args: [[1, 1, 1, 1], 0], expected: 1 },
    ],
  },
  {
    id: 'count-rectangles-area',
    title: 'Count Rectangles with Area Less Than a Given Number',
    difficulty: 'Medium',
    lc: 'https://www.geeksforgeeks.org/count-of-rectangles-with-area-k-made-up-of-only-1s-from-given-binary-arrays/',
    from: 'Lec 11 – 2 Pointers (Bosscoder notes)',
    tags: ['two-pointers', 'sorting'],
    statement: 'Given an array of side lengths, count ordered pairs `(a[i], a[j])` (i and j may be equal, i.e. squares allowed) whose rectangle area `a[i] · a[j] < A`.\n\n**Example:** `[1, 2, 3, 4, 5], A = 5` → `8` — (1,1),(1,2),(1,3),(1,4),(2,1),(2,2),(3,1),(4,1)',
    approaches: [
      {
        name: 'Brute force',
        time: 'O(n²)',
        space: 'O(1)',
        code: `
          function countRectangles(a, A) {
            let c = 0;
            for (const x of a) for (const y of a) if (x * y < A) c++;
            return c;
          }
        `,
      },
      {
        name: 'Sort + two pointers',
        time: 'O(n log n)',
        space: 'O(1) extra',
        idea: 'After sorting, for each `i` from the left, shrink `j` from the right until `a[i]·a[j] < A`; then every index `0..j` pairs with `i`. As `a[i]` grows, valid `j` only shrinks — monotonic.',
        code: `
          function countRectangles(arr, A) {
            const a = [...arr].sort((x, y) => x - y);
            let j = a.length - 1, count = 0;
            for (let i = 0; i < a.length; i++) {
              while (j >= 0 && a[i] * a[j] >= A) j--;
              count += j + 1;
            }
            return count;
          }
        `,
      },
    ],
    fn: 'countRectangles',
    tests: [
      { args: [[1, 2, 3, 4, 5], 5], expected: 8 },
      { args: [[1, 2], 5], expected: 4 },
      { args: [[5, 6], 10], expected: 0 },
    ],
  },
  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    difficulty: 'Easy',
    lc: 'move-zeroes',
    from: 'IL7 – 2 Pointers & Hashing',
    tags: ['two-pointers', 'in-place'],
    statement: 'Move all 0s to the end in place, keeping the relative order of non-zero elements.\n\n**Example:** `[0,1,0,3,12]` → `[1,3,12,0,0]`',
    approaches: [
      {
        name: 'Write pointer + swap',
        time: 'O(n)',
        space: 'O(1)',
        idea: '`i` is the next slot for a non-zero. Scan with `j`; whenever `nums[j] !== 0`, swap it into `i` and advance `i` (the instructor’s version).',
        code: `
          function moveZeroes(nums) {
            let i = 0;
            for (let j = 0; j < nums.length; j++) {
              if (nums[j] !== 0) {
                [nums[i], nums[j]] = [nums[j], nums[i]];
                i++;
              }
            }
            return nums;
          }
        `,
      },
    ],
    fn: 'moveZeroes',
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
      { args: [[0]], expected: [0] },
      { args: [[1, 2, 3]], expected: [1, 2, 3] },
    ],
  },
  {
    id: 'remove-duplicates-ii',
    title: 'Remove Duplicates from Sorted Array II (at most twice)',
    difficulty: 'Medium',
    lc: 'remove-duplicates-from-sorted-array-ii',
    from: 'IL7 – homework',
    tags: ['two-pointers', 'in-place'],
    statement: 'In a sorted array, keep each value at most twice (in place). Return the new length `k`.',
    approaches: [
      {
        name: 'Compare with k − 2',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Write `x` only if it differs from the element two slots back in the *written* prefix. Generalises to “at most m times”.',
        code: `
          function removeDuplicates(nums) {
            let k = 0;
            for (const x of nums) if (k < 2 || x !== nums[k - 2]) nums[k++] = x;
            return k;
          }
        `,
      },
    ],
    fn: 'removeDuplicates',
    output: (k, _H, args) => args[0].slice(0, k),
    tests: [
      { args: [[1, 1, 1, 2, 2, 3]], expected: [1, 1, 2, 2, 3] },
      { args: [[0, 0, 1, 1, 1, 1, 2, 3, 3]], expected: [0, 0, 1, 1, 2, 3, 3] },
    ],
  },
  {
    id: 'three-sum-closest',
    title: '3Sum Closest',
    difficulty: 'Medium',
    lc: '3sum-closest',
    from: 'IL7 – homework',
    tags: ['two-pointers', 'sorting'],
    statement: 'Return the sum of three integers closest to `target`.',
    approaches: [
      {
        name: 'Sort + fix one + two pointers',
        time: 'O(n²)',
        space: 'O(1) extra',
        code: `
          function threeSumClosest(nums, target) {
            const a = [...nums].sort((x, y) => x - y);
            let best = a[0] + a[1] + a[2];
            for (let i = 0; i < a.length - 2; i++) {
              let l = i + 1, r = a.length - 1;
              while (l < r) {
                const s = a[i] + a[l] + a[r];
                if (Math.abs(s - target) < Math.abs(best - target)) best = s;
                if (s === target) return s;
                if (s < target) l++;
                else r--;
              }
            }
            return best;
          }
        `,
      },
    ],
    fn: 'threeSumClosest',
    tests: [
      { args: [[-1, 2, 1, -4], 1], expected: 2 },
      { args: [[0, 0, 0], 1], expected: 0 },
    ],
  },
];

export const hashingExtra = [
  {
    id: 'zero-sum-subarray-exists',
    title: 'Does a Subarray with Sum 0 Exist?',
    difficulty: 'Easy',
    lc: 'https://www.geeksforgeeks.org/problems/subarray-with-0-sum-1587115621/1',
    from: 'Lec 12 – Hashing 1 & 2',
    tags: ['prefix-sum', 'hash-set'],
    statement: 'Return true if some non-empty contiguous subarray sums to 0.\n\n**Example:** `[4,2,-3,1,6]` → `true` (`[2,-3,1]`)',
    approaches: [
      {
        name: 'All subarrays',
        time: 'O(n²)',
        space: 'O(1)',
        code: `
          function hasZeroSumSubarray(nums) {
            for (let i = 0; i < nums.length; i++) {
              let s = 0;
              for (let j = i; j < nums.length; j++) if ((s += nums[j]) === 0) return true;
            }
            return false;
          }
        `,
      },
      {
        name: 'Repeated prefix sum',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'If the same prefix sum appears twice (or a prefix is 0), the elements between them sum to 0 — exactly the circled repeats in the class notes (`4, 6, 3, 4, 10`).',
        code: `
          function hasZeroSumSubarray(nums) {
            const seen = new Set([0]);
            let prefix = 0;
            for (const x of nums) {
              prefix += x;
              if (seen.has(prefix)) return true;
              seen.add(prefix);
            }
            return false;
          }
        `,
      },
    ],
    fn: 'hasZeroSumSubarray',
    tests: [
      { args: [[4, 2, -3, 1, 6]], expected: true },
      { args: [[4, 2, 0, 1, 6]], expected: true },
      { args: [[-3, 2, 3, 1, 6]], expected: false },
    ],
  },
  {
    id: 'largest-zero-sum-subarray',
    title: 'Length of the Largest Subarray with Sum 0',
    difficulty: 'Medium',
    lc: 'https://www.geeksforgeeks.org/problems/largest-subarray-with-0-sum/1',
    from: 'Lec 12 – Hashing 1 & 2',
    tags: ['prefix-sum', 'hash-map'],
    statement: 'Return the length of the longest contiguous subarray with sum 0.\n\n**Example:** `[15,-2,2,-8,1,7,10,23]` → `5` (`[-2,2,-8,1,7]`)',
    approaches: [
      {
        name: 'All subarrays',
        time: 'O(n²)',
        space: 'O(1)',
        code: `
          function maxLen(nums) {
            let best = 0;
            for (let i = 0; i < nums.length; i++) {
              let s = 0;
              for (let j = i; j < nums.length; j++) if ((s += nums[j]) === 0) best = Math.max(best, j - i + 1);
            }
            return best;
          }
        `,
      },
      {
        name: 'First index of each prefix sum',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'Store the **first** index where each prefix sum occurs (seed `0 → -1`). When it repeats at j, the subarray `(first+1 .. j)` sums to 0. Keeping the first occurrence maximises length.',
        code: `
          function maxLen(nums) {
            const first = new Map([[0, -1]]);
            let prefix = 0, best = 0;
            nums.forEach((x, j) => {
              prefix += x;
              if (first.has(prefix)) best = Math.max(best, j - first.get(prefix));
              else first.set(prefix, j);
            });
            return best;
          }
        `,
      },
    ],
    explanation: 'Same trick solves “longest subarray with sum k” (look up `prefix − k`) and “equal 0s and 1s” (map 0 → −1).',
    fn: 'maxLen',
    tests: [
      { args: [[15, -2, 2, -8, 1, 7, 10, 23]], expected: 5 },
      { args: [[1, 2, 3]], expected: 0 },
      { args: [[1, 0, 3]], expected: 1 },
      { args: [[-1, 1, -1, 1]], expected: 4 },
    ],
  },
  {
    id: 'design-hashmap',
    title: 'Design HashMap (separate chaining)',
    difficulty: 'Easy',
    lc: 'design-hashmap',
    from: 'Lec 12 – Hashing (+ IL7 homework 706)',
    tags: ['design', 'hashing', 'chaining'],
    statement: 'Implement `put(key, value)`, `get(key)` (−1 if absent) and `remove(key)` **without** built-in hash tables. Keys are non-negative integers.',
    approaches: [
      {
        name: 'Buckets + chaining + resize on load factor',
        time: 'O(1) average per op',
        space: 'O(n)',
        idea: `
          \`hash(key) = key % capacity\` picks a bucket; collisions live in that bucket's list (**open hashing / separate chaining** from the notes).
          When the **load factor** \`n / capacity\` exceeds 0.75, double the capacity and rehash so chains stay short.
        `,
        code: `
          class MyHashMap {
            constructor() {
              this.cap = 8;
              this.size = 0;
              this.buckets = Array.from({ length: this.cap }, () => []);
            }
            _bucket(key) { return this.buckets[key % this.cap]; }
            put(key, value) {
              const b = this._bucket(key);
              const e = b.find((p) => p[0] === key);
              if (e) { e[1] = value; return; }
              b.push([key, value]);
              if (++this.size / this.cap > 0.75) this._resize();
            }
            get(key) {
              const e = this._bucket(key).find((p) => p[0] === key);
              return e ? e[1] : -1;
            }
            remove(key) {
              const b = this._bucket(key);
              const i = b.findIndex((p) => p[0] === key);
              if (i >= 0) { b.splice(i, 1); this.size--; }
            }
            _resize() {
              const old = this.buckets.flat();
              this.cap *= 2;
              this.buckets = Array.from({ length: this.cap }, () => []);
              for (const [k, v] of old) this._bucket(k).push([k, v]);
            }
          }
        `,
      },
    ],
    explanation: `
      **Closed hashing / open addressing** (also in the notes) stores everything in the array itself and probes on collision:
      linear (\`i+1, i+2…\` — causes clustering), quadratic (\`i+1², i+2²…\`) or double hashing. Deletes need a tombstone (“soft delete”).
      An ideal hash function is deterministic (idempotent), fast, spreads keys uniformly and maps into \`[0, size−1]\`.
    `,
    kind: 'class',
    fn: 'MyHashMap',
    tests: [
      {
        ops: ['MyHashMap', 'put', 'put', 'get', 'get', 'put', 'get', 'remove', 'get'],
        args: [[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]],
        expected: [null, null, null, 1, -1, null, 1, null, -1],
      },
      {
        ops: ['MyHashMap', 'put', 'put', 'put', 'put', 'put', 'put', 'put', 'put', 'get', 'get'],
        args: [[], [0, 10], [8, 18], [16, 26], [3, 13], [11, 21], [5, 15], [7, 17], [100, 1], [16], [100]],
        expected: [null, null, null, null, null, null, null, null, null, 26, 1],
      },
    ],
  },
];
