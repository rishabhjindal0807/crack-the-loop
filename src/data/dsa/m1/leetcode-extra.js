// Problems from Rishabh's LeetCode practice history that weren't on the site yet.

export const arraysLc = [
  {
    id: 'plus-one',
    title: 'Plus One',
    difficulty: 'Easy',
    lc: 'plus-one',
    tags: ['array', 'carry'],
    statement: 'A large integer is given as an array of digits (most significant first). Add one and return the digits.\n\n**Example:** `[1,2,9]` → `[1,3,0]`, `[9,9]` → `[1,0,0]`',
    approaches: [
      {
        name: 'Carry from the right',
        time: 'O(n)',
        space: 'O(1) extra (O(n) only when all 9s)',
        idea: 'Walk from the last digit: a digit below 9 just increments and we are done; a 9 becomes 0 and the carry moves left. If every digit was 9, prepend 1.',
        code: `
          function plusOne(digits) {
            for (let i = digits.length - 1; i >= 0; i--) {
              if (digits[i] < 9) {
                digits[i]++;
                return digits;
              }
              digits[i] = 0;
            }
            return [1, ...digits];
          }
        `,
      },
    ],
    explanation: 'Don’t convert to a Number — 100-digit inputs overflow `Number.MAX_SAFE_INTEGER`. (BigInt would work but misses the point.)',
    fn: 'plusOne',
    tests: [
      { args: [[1, 2, 3]], expected: [1, 2, 4] },
      { args: [[1, 2, 9]], expected: [1, 3, 0] },
      { args: [[9, 9]], expected: [1, 0, 0] },
    ],
  },
  {
    id: 'majority-element',
    title: 'Majority Element',
    difficulty: 'Easy',
    lc: 'majority-element',
    tags: ['boyer-moore', 'hashing'],
    statement: 'Return the element that appears more than ⌊n/2⌋ times (it always exists).',
    approaches: [
      {
        name: 'Hash map count',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function majorityElement(nums) {
            const count = new Map();
            for (const x of nums) {
              const c = (count.get(x) || 0) + 1;
              if (c > nums.length / 2) return x;
              count.set(x, c);
            }
          }
        `,
      },
      {
        name: 'Boyer–Moore voting',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Keep a candidate and a counter: same value → +1, different → −1, counter at 0 → adopt the current value. Each non-majority element can cancel at most one majority element, so the majority survives.',
        code: `
          function majorityElement(nums) {
            let candidate = null, count = 0;
            for (const x of nums) {
              if (count === 0) candidate = x;
              count += x === candidate ? 1 : -1;
            }
            return candidate;
          }
        `,
      },
    ],
    explanation: 'Follow-up (LC 229): elements appearing more than ⌊n/3⌋ times — same idea with two candidates, then a verification pass.',
    fn: 'majorityElement',
    tests: [
      { args: [[3, 2, 3]], expected: 3 },
      { args: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
      { args: [[1]], expected: 1 },
    ],
  },
  {
    id: 'best-time-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock (one transaction)',
    difficulty: 'Easy',
    lc: 'best-time-to-buy-and-sell-stock',
    tags: ['array', 'running-min'],
    statement: 'Buy on one day and sell on a later day. Return the maximum profit (0 if none).\n\n**Example:** `[7,1,5,3,6,4]` → `5`',
    approaches: [
      {
        name: 'All pairs',
        time: 'O(n²)',
        space: 'O(1)',
        code: `
          function maxProfit(prices) {
            let best = 0;
            for (let i = 0; i < prices.length; i++)
              for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
            return best;
          }
        `,
      },
      {
        name: 'Running minimum',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'For each day, the best sale today = price − cheapest price seen before. Track that minimum as you go.',
        code: `
          function maxProfit(prices) {
            let minPrice = Infinity, best = 0;
            for (const p of prices) {
              minPrice = Math.min(minPrice, p);
              best = Math.max(best, p - minPrice);
            }
            return best;
          }
        `,
      },
    ],
    explanation: 'This is Kadane’s algorithm on daily price differences. The rest of the family (unlimited trades, cooldown, fee, k trades) is in DP → Best Time to Buy and Sell Stock with cooldown.',
    fn: 'maxProfit',
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[2, 4, 1]], expected: 2 },
    ],
  },
];

export const mathsLc = [
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    lc: 'palindrome-number',
    tags: ['math'],
    statement: 'Return true if integer `x` reads the same backwards — without converting it to a string.',
    approaches: [
      {
        name: 'String reverse',
        time: 'O(d)',
        space: 'O(d)',
        code: `
          function isPalindrome(x) {
            const s = String(x);
            return s === [...s].reverse().join('');
          }
        `,
      },
      {
        name: 'Reverse half the digits',
        time: 'O(d)',
        space: 'O(1)',
        idea: 'Negatives and numbers ending in 0 (except 0) can’t be palindromes. Pop digits off `x` into `rev` until `rev ≥ x`; then compare `x === rev` (even length) or `x === ⌊rev/10⌋` (odd length, middle digit ignored). Reversing only half avoids overflow.',
        code: `
          function isPalindrome(x) {
            if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
            let rev = 0;
            while (x > rev) {
              rev = rev * 10 + (x % 10);
              x = Math.floor(x / 10);
            }
            return x === rev || x === Math.floor(rev / 10);
          }
        `,
      },
    ],
    fn: 'isPalindrome',
    tests: [
      { args: [121], expected: true },
      { args: [-121], expected: false },
      { args: [10], expected: false },
      { args: [0], expected: true },
      { args: [1221], expected: true },
    ],
  },
];

export const stringsLc = [
  {
    id: 'roman-to-integer',
    title: 'Roman to Integer',
    difficulty: 'Easy',
    lc: 'roman-to-integer',
    tags: ['strings', 'hash-map'],
    statement: 'Convert a Roman numeral (I, V, X, L, C, D, M) to an integer.\n\n**Example:** `"MCMXCIV"` → `1994`',
    approaches: [
      {
        name: 'Subtract when a smaller symbol precedes a larger one',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Add each symbol’s value, except when it is smaller than the next symbol (IV, IX, XL, XC, CD, CM) — then subtract it.',
        code: `
          function romanToInt(s) {
            const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
            let total = 0;
            for (let i = 0; i < s.length; i++) {
              const v = val[s[i]];
              total += i + 1 < s.length && v < val[s[i + 1]] ? -v : v;
            }
            return total;
          }
        `,
      },
    ],
    explanation: 'Follow-up: Integer to Roman (LC 12) — greedy over the 13 values `1000, 900, 500, 400, … , 4, 1`.',
    fn: 'romanToInt',
    tests: [
      { args: ['III'], expected: 3 },
      { args: ['LVIII'], expected: 58 },
      { args: ['MCMXCIV'], expected: 1994 },
    ],
  },
  {
    id: 'length-of-last-word',
    title: 'Length of Last Word',
    difficulty: 'Easy',
    lc: 'length-of-last-word',
    tags: ['strings'],
    statement: 'Return the length of the last word in `s` (words are separated by spaces; there may be trailing spaces).',
    approaches: [
      {
        name: 'Scan from the end',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Skip trailing spaces, then count characters until the next space or the start.',
        code: `
          function lengthOfLastWord(s) {
            let i = s.length - 1, len = 0;
            while (i >= 0 && s[i] === ' ') i--;
            while (i >= 0 && s[i] !== ' ') { len++; i--; }
            return len;
          }
        `,
      },
    ],
    explanation: 'One-liner `s.trim().split(/\\s+/).pop().length` works too, but the scan is O(1) extra space and is what interviewers want to see.',
    fn: 'lengthOfLastWord',
    tests: [
      { args: ['Hello World'], expected: 5 },
      { args: ['   fly me   to   the moon  '], expected: 4 },
      { args: ['a'], expected: 1 },
    ],
  },
];

export const twoPointersLc = [
  {
    id: 'remove-element',
    title: 'Remove Element',
    difficulty: 'Easy',
    lc: 'remove-element',
    tags: ['two-pointers', 'in-place'],
    statement: 'Remove all occurrences of `val` in place and return the count `k` of remaining elements (first k slots hold them).',
    approaches: [
      {
        name: 'Write pointer',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Copy every element that isn’t `val` to position `k`, then `k++`. Same pattern as Move Zeroes and Remove Duplicates.',
        code: `
          function removeElement(nums, val) {
            let k = 0;
            for (const x of nums) if (x !== val) nums[k++] = x;
            return k;
          }
        `,
      },
    ],
    explanation: 'If order doesn’t matter and `val` is rare, swap the bad element with the last one and shrink n — fewer writes.',
    fn: 'removeElement',
    output: (k, _H, args) => args[0].slice(0, k),
    tests: [
      { args: [[3, 2, 2, 3], 3], expected: [2, 2] },
      { args: [[0, 1, 2, 2, 3, 0, 4, 2], 2], expected: [0, 1, 3, 0, 4] },
      { args: [[1], 1], expected: [] },
    ],
  },
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array (in place)',
    difficulty: 'Easy',
    lc: 'merge-sorted-array',
    tags: ['two-pointers', 'merge'],
    statement: '`nums1` has length `m + n` (last n slots are 0). Merge sorted `nums2` (length n) into `nums1` in place.',
    approaches: [
      {
        name: 'Fill from the back',
        time: 'O(m + n)',
        space: 'O(1)',
        idea: 'Compare the largest remaining elements and write the bigger one at the end of nums1. Writing backwards never overwrites an unread nums1 element.',
        code: `
          function merge(nums1, m, nums2, n) {
            let i = m - 1, j = n - 1, k = m + n - 1;
            while (j >= 0) {
              if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
              else nums1[k--] = nums2[j--];
            }
            return nums1;
          }
        `,
      },
    ],
    explanation: 'Loop only while `nums2` has elements left — any remaining nums1 elements are already in place.',
    fn: 'merge',
    output: (_r, _H, args) => args[0],
    tests: [
      { args: [[1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3], expected: [1, 2, 2, 3, 5, 6] },
      { args: [[1], 1, [], 0], expected: [1] },
      { args: [[0], 0, [1], 1], expected: [1] },
    ],
  },
];

export const searchingLc = [
  {
    id: 'search-insert-position',
    title: 'Search Insert Position',
    difficulty: 'Easy',
    lc: 'search-insert-position',
    tags: ['binary-search', 'lower-bound'],
    statement: 'Return the index of `target` in a sorted array, or the index where it would be inserted.',
    approaches: [
      {
        name: 'Lower bound',
        time: 'O(log n)',
        space: 'O(1)',
        idea: 'Find the first index with `nums[i] >= target`. Search space is `[0, n]` — `n` is valid when target is larger than everything.',
        code: `
          function searchInsert(nums, target) {
            let lo = 0, hi = nums.length;
            while (lo < hi) {
              const mid = lo + ((hi - lo) >> 1);
              if (nums[mid] < target) lo = mid + 1;
              else hi = mid;
            }
            return lo;
          }
        `,
      },
    ],
    fn: 'searchInsert',
    tests: [
      { args: [[1, 3, 5, 6], 5], expected: 2 },
      { args: [[1, 3, 5, 6], 2], expected: 1 },
      { args: [[1, 3, 5, 6], 7], expected: 4 },
      { args: [[1, 3, 5, 6], 0], expected: 0 },
    ],
  },
  {
    id: 'search-2d-matrix-ii',
    title: 'Search a 2D Matrix II (rows and columns sorted)',
    difficulty: 'Medium',
    lc: 'search-a-2d-matrix-ii',
    tags: ['matrix', 'staircase'],
    statement: 'Each row is sorted left→right and each column top→bottom (rows don’t continue into each other, unlike LC 74). Return whether `target` exists.',
    approaches: [
      {
        name: 'Binary search each row',
        time: 'O(m log n)',
        space: 'O(1)',
        code: `
          function searchMatrix(matrix, target) {
            for (const row of matrix) {
              let lo = 0, hi = row.length - 1;
              while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                if (row[mid] === target) return true;
                if (row[mid] < target) lo = mid + 1;
                else hi = mid - 1;
              }
            }
            return false;
          }
        `,
      },
      {
        name: 'Staircase from top-right',
        time: 'O(m + n)',
        space: 'O(1)',
        idea: 'At the top-right corner, everything left is smaller and everything below is larger. Too big → move left (drop the column); too small → move down (drop the row).',
        code: `
          function searchMatrix(matrix, target) {
            let r = 0, c = matrix[0].length - 1;
            while (r < matrix.length && c >= 0) {
              if (matrix[r][c] === target) return true;
              if (matrix[r][c] > target) c--;
              else r++;
            }
            return false;
          }
        `,
      },
    ],
    explanation: 'Why not one binary search over everything? The matrix isn’t globally sorted here (`[[1,4],[2,5]]`), so the flattened-index trick from LC 74 doesn’t apply.',
    fn: 'searchMatrix',
    tests: [
      { args: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 5], expected: true },
      { args: [[[1, 4, 7, 11, 15], [2, 5, 8, 12, 19], [3, 6, 9, 16, 22], [10, 13, 14, 17, 24], [18, 21, 23, 26, 30]], 20], expected: false },
      { args: [[[-5]], -5], expected: true },
    ],
  },
  {
    id: 'find-duplicate-number',
    title: 'Find the Duplicate Number',
    difficulty: 'Medium',
    lc: 'find-the-duplicate-number',
    tags: ['binary-search-on-answer', 'floyd', 'cycle-detection'],
    statement: '`nums` has `n + 1` integers in `[1, n]` with exactly one repeated value (possibly repeated many times). Find it **without modifying the array** and with **O(1) extra space**.\n\n**Example:** `[1,3,4,2,2]` → `2`',
    approaches: [
      {
        name: 'Hash set (breaks the O(1) space rule)',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function findDuplicate(nums) {
            const seen = new Set();
            for (const x of nums) {
              if (seen.has(x)) return x;
              seen.add(x);
            }
          }
        `,
      },
      {
        name: 'Binary search on the value',
        time: 'O(n log n)',
        space: 'O(1)',
        idea: 'For a candidate `mid`, count how many numbers are `≤ mid`. With no duplicate in `[1..mid]` the count is at most `mid`; if it’s more, the duplicate is in `[1..mid]` (pigeonhole). That predicate is monotonic.',
        code: `
          function findDuplicate(nums) {
            let lo = 1, hi = nums.length - 1;
            while (lo < hi) {
              const mid = lo + ((hi - lo) >> 1);
              let count = 0;
              for (const x of nums) if (x <= mid) count++;
              if (count > mid) hi = mid;
              else lo = mid + 1;
            }
            return lo;
          }
        `,
      },
      {
        name: "Floyd's cycle detection (optimal)",
        time: 'O(n)',
        space: 'O(1)',
        idea: `
          Treat the array as a linked list: index \`i\` points to \`nums[i]\`. Values are in \`[1, n]\`, so you never leave the array, and
          the duplicate value has **two** incoming pointers — it is the entrance to a cycle. Find the meeting point with slow/fast pointers,
          then restart one pointer from 0; where they meet again is the cycle start = the duplicate (same as Linked List Cycle II).
        `,
        code: `
          function findDuplicate(nums) {
            let slow = nums[0], fast = nums[0];
            do {
              slow = nums[slow];
              fast = nums[nums[fast]];
            } while (slow !== fast);
            slow = nums[0];
            while (slow !== fast) {
              slow = nums[slow];
              fast = nums[fast];
            }
            return slow;
          }
        `,
      },
    ],
    explanation: `
      **Why your LeetCode submission likely hit TLE:** an O(n²) pair check (or re-scanning the array for every element) is too slow at n = 10⁵.
      Sorting is O(n log n) but modifies the array. Say the constraints out loud — they rule out every “easy” approach and point straight at
      binary search on the value or Floyd’s algorithm.
    `,
    fn: 'findDuplicate',
    tests: [
      { args: [[1, 3, 4, 2, 2]], expected: 2 },
      { args: [[3, 1, 3, 4, 2]], expected: 3 },
      { args: [[3, 3, 3, 3, 3]], expected: 3 },
      { args: [[2, 5, 9, 6, 9, 3, 8, 9, 7, 1]], expected: 9 },
    ],
  },
];

export const hashingLc = [
  {
    id: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    lc: 'contains-duplicate',
    tags: ['hash-set'],
    statement: 'Return true if any value appears at least twice.',
    approaches: [
      {
        name: 'Sort and compare neighbours',
        time: 'O(n log n)',
        space: 'O(1) extra (sorts a copy here)',
        code: `
          function containsDuplicate(nums) {
            const a = [...nums].sort((x, y) => x - y);
            for (let i = 1; i < a.length; i++) if (a[i] === a[i - 1]) return true;
            return false;
          }
        `,
      },
      {
        name: 'Hash set',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function containsDuplicate(nums) {
            const seen = new Set();
            for (const x of nums) {
              if (seen.has(x)) return true;
              seen.add(x);
            }
            return false;
          }
        `,
      },
    ],
    explanation: 'Classic time-vs-space trade-off question — name both and let the interviewer pick the constraint.',
    fn: 'containsDuplicate',
    tests: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    ],
  },
];

export const dpLc = [
  {
    id: 'perfect-squares',
    title: 'Perfect Squares',
    difficulty: 'Medium',
    lc: 'perfect-squares',
    tags: ['dp', 'unbounded-knapsack', 'bfs'],
    statement: 'Return the least number of perfect squares (1, 4, 9, …) that sum to `n`.\n\n**Example:** `12` → `3` (4 + 4 + 4), `13` → `2` (4 + 9)',
    approaches: [
      {
        name: 'DP (like Coin Change with square coins)',
        time: 'O(n√n)',
        space: 'O(n)',
        idea: '`dp[i] = 1 + min(dp[i − j²])` over all `j² ≤ i`.',
        code: `
          function numSquares(n) {
            const dp = new Array(n + 1).fill(Infinity);
            dp[0] = 0;
            for (let i = 1; i <= n; i++)
              for (let j = 1; j * j <= i; j++) dp[i] = Math.min(dp[i], dp[i - j * j] + 1);
            return dp[n];
          }
        `,
      },
      {
        name: "Math (Lagrange's four-square theorem)",
        time: 'O(√n)',
        space: 'O(1)',
        idea: 'Every n is a sum of at most 4 squares. It needs exactly 4 iff `n = 4ᵃ(8b + 7)`. Otherwise check 1 (n is a square) and 2 (n = a² + b²); else 3.',
        code: `
          function numSquares(n) {
            const isSq = (x) => Number.isInteger(Math.sqrt(x));
            if (isSq(n)) return 1;
            let m = n;
            while (m % 4 === 0) m /= 4;
            if (m % 8 === 7) return 4;
            for (let a = 1; a * a <= n; a++) if (isSq(n - a * a)) return 2;
            return 3;
          }
        `,
      },
    ],
    explanation: 'In an interview, give the DP (it’s the Coin Change pattern you already know), then mention the four-square theorem as a bonus. BFS over remainders also works and finds the minimum level.',
    fn: 'numSquares',
    tests: [
      { args: [12], expected: 3 },
      { args: [13], expected: 2 },
      { args: [1], expected: 1 },
      { args: [7], expected: 4 },
      { args: [43], expected: 3 },
    ],
  },
];
