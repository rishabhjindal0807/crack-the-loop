// New problems from Lec 19 (Greedy), Lec 20 (DP 1 & 2), IL4 (Bit Manipulation & Searching), IL5 (Recursion).

export const greedyExtra = [
  {
    id: 'assign-cookies',
    title: 'Assign Cookies',
    difficulty: 'Easy',
    lc: 'assign-cookies',
    from: 'Lec 19 – Greedy (class question 1)',
    tags: ['greedy', 'two-pointers', 'sorting'],
    statement: 'Child i is content with a cookie of size ≥ `g[i]`. Each child gets at most one cookie. Maximise content children.',
    approaches: [
      {
        name: 'Sort both, smallest cookie that fits',
        time: 'O(n log n + m log m)',
        space: 'O(1) extra',
        idea: 'Give the least greedy child the smallest cookie that satisfies them — a bigger cookie would only be wasted.',
        code: `
          function findContentChildren(g, s) {
            g = [...g].sort((a, b) => a - b);
            s = [...s].sort((a, b) => a - b);
            let i = 0, j = 0;
            while (i < g.length && j < s.length) {
              if (g[i] <= s[j]) i++;
              j++;
            }
            return i;
          }
        `,
      },
    ],
    fn: 'findContentChildren',
    tests: [
      { args: [[1, 2, 3], [1, 1]], expected: 1 },
      { args: [[1, 2], [1, 2, 3]], expected: 2 },
    ],
  },
  {
    id: 'min-cost-candies',
    title: 'Minimum Cost of Buying Candies With Discount',
    difficulty: 'Easy',
    lc: 'minimum-cost-of-buying-candies-with-discount',
    from: 'Lec 19 – Greedy (class question 2)',
    tags: ['greedy', 'sorting'],
    statement: 'Buy two candies, get a third free (cost ≤ min of the two). Minimum total cost to get all candies?',
    approaches: [
      {
        name: 'Sort descending, skip every 3rd',
        time: 'O(n log n)',
        space: 'O(1) extra',
        idea: 'Pay for the two most expensive, take the next most expensive free — the largest possible free candy each time.',
        code: `
          function minimumCost(cost) {
            const c = [...cost].sort((a, b) => b - a);
            let total = 0;
            for (let i = 0; i < c.length; i++) if (i % 3 !== 2) total += c[i];
            return total;
          }
        `,
      },
    ],
    fn: 'minimumCost',
    tests: [
      { args: [[1, 2, 3]], expected: 5 },
      { args: [[6, 5, 7, 9, 2, 2]], expected: 23 },
      { args: [[5, 5]], expected: 10 },
    ],
  },
  {
    id: 'largest-odd-number',
    title: 'Largest Odd Number in String',
    difficulty: 'Easy',
    lc: 'largest-odd-number-in-string',
    from: 'Lec 19 – Greedy (class question 3)',
    tags: ['greedy', 'strings'],
    statement: 'Return the largest odd number that is a non-empty substring of `num`, or `""`.',
    approaches: [
      {
        name: 'Rightmost odd digit',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'A number is odd iff its last digit is odd. The longest prefix ending at the rightmost odd digit is the largest.',
        code: `
          function largestOddNumber(num) {
            for (let i = num.length - 1; i >= 0; i--) if (Number(num[i]) % 2 === 1) return num.slice(0, i + 1);
            return '';
          }
        `,
      },
    ],
    fn: 'largestOddNumber',
    tests: [
      { args: ['52'], expected: '5' },
      { args: ['4206'], expected: '' },
      { args: ['35427'], expected: '35427' },
    ],
  },
  {
    id: 'shortest-unsorted-subarray',
    title: 'Shortest Unsorted Continuous Subarray',
    difficulty: 'Medium',
    lc: 'shortest-unsorted-continuous-subarray',
    from: 'Lec 19 – Greedy (class question 4)',
    tags: ['greedy', 'two-pass'],
    statement: 'Find the shortest subarray which, if sorted, makes the whole array sorted. Return its length.\n\n**Example:** `[2,6,4,8,10,9,15]` → `5`',
    approaches: [
      {
        name: 'Compare with sorted copy',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `
          function findUnsortedSubarray(nums) {
            const s = [...nums].sort((a, b) => a - b);
            let l = 0, r = nums.length - 1;
            while (l <= r && nums[l] === s[l]) l++;
            while (r >= l && nums[r] === s[r]) r--;
            return r - l + 1;
          }
        `,
      },
      {
        name: 'Two passes with running max / min',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Left→right: any element smaller than the max seen so far is out of place → it extends `right`. Right→left: any element larger than the min seen so far extends `left`.',
        code: `
          function findUnsortedSubarray(nums) {
            let maxSeen = -Infinity, right = -1;
            for (let i = 0; i < nums.length; i++) {
              maxSeen = Math.max(maxSeen, nums[i]);
              if (nums[i] < maxSeen) right = i;
            }
            if (right === -1) return 0;
            let minSeen = Infinity, left = -1;
            for (let i = nums.length - 1; i >= 0; i--) {
              minSeen = Math.min(minSeen, nums[i]);
              if (nums[i] > minSeen) left = i;
            }
            return right - left + 1;
          }
        `,
      },
    ],
    fn: 'findUnsortedSubarray',
    tests: [
      { args: [[2, 6, 4, 8, 10, 9, 15]], expected: 5 },
      { args: [[1, 2, 3, 4]], expected: 0 },
      { args: [[1]], expected: 0 },
      { args: [[2, 1]], expected: 2 },
    ],
  },
  {
    id: 'activity-selection',
    title: 'Activity Selection',
    difficulty: 'Medium',
    lc: 'https://www.geeksforgeeks.org/problems/activity-selection-1587115620/1',
    from: 'Lec 19 – Greedy (class question 5)',
    tags: ['greedy', 'intervals'],
    statement: 'One person, many activities with `start[i]` and `finish[i]`. Maximum number of non-overlapping activities (an activity must start strictly after the previous one finishes).',
    approaches: [
      {
        name: 'Sort by finish time',
        time: 'O(n log n)',
        space: 'O(n)',
        idea: 'Always pick the activity that **finishes earliest** — it leaves the most time for the rest.',
        code: `
          function activitySelection(start, finish) {
            const acts = start.map((s, i) => [s, finish[i]]).sort((a, b) => a[1] - b[1]);
            let count = 1, lastEnd = acts[0][1];
            for (let i = 1; i < acts.length; i++) {
              if (acts[i][0] > lastEnd) {
                count++;
                lastEnd = acts[i][1];
              }
            }
            return count;
          }
        `,
      },
    ],
    explanation: 'Same idea as Non-overlapping Intervals and Min Arrows (in this topic). Watch the boundary: GfG uses strict `>`, LeetCode intervals often allow touching (`>=`).',
    fn: 'activitySelection',
    tests: [
      { args: [[1, 3, 0, 5, 8, 5], [2, 4, 6, 7, 9, 9]], expected: 4 },
      { args: [[10, 12, 20], [20, 25, 30]], expected: 1 },
      { args: [[1, 3, 2, 5], [2, 4, 3, 6]], expected: 3 },
    ],
  },
  {
    id: 'fractional-knapsack',
    title: 'Fractional Knapsack',
    difficulty: 'Medium',
    lc: 'https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1',
    from: 'Lec 19 – Greedy (class question 6)',
    tags: ['greedy', 'sorting'],
    statement: 'Items have value and weight; you may take fractions. Maximise value within `capacity`.\n\n**Example:** `val=[60,100,120], wt=[10,20,30], W=50` → `240`',
    approaches: [
      {
        name: 'Sort by value per unit weight',
        time: 'O(n log n)',
        space: 'O(n)',
        idea: 'Take items in decreasing `value / weight`. Take whole items while they fit; take a fraction of the next one and stop.',
        code: `
          function fractionalKnapsack(val, wt, capacity) {
            const items = val.map((v, i) => [v, wt[i], v / wt[i]]).sort((a, b) => b[2] - a[2]);
            let total = 0;
            for (const [v, w, ratio] of items) {
              if (w <= capacity) {
                total += v;
                capacity -= w;
              } else {
                total += capacity * ratio;
                break;
              }
            }
            return total;
          }
        `,
      },
    ],
    explanation: 'Greedy works here because items are divisible. For **0/1 knapsack** (no fractions) greedy fails — that needs DP (see Partition Equal Subset Sum).',
    fn: 'fractionalKnapsack',
    compare: 'float',
    tests: [
      { args: [[60, 100, 120], [10, 20, 30], 50], expected: 240 },
      { args: [[60, 100], [10, 20], 50], expected: 160 },
      { args: [[500], [30], 10], expected: 166.66667 },
    ],
  },
  {
    id: 'partition-labels',
    title: 'Partition Labels',
    difficulty: 'Medium',
    lc: 'partition-labels',
    from: 'Lec 19 – Greedy (class question 7)',
    tags: ['greedy', 'intervals', 'hashing'],
    statement: 'Split `s` into as many parts as possible so each letter appears in at most one part. Return part sizes.\n\n**Example:** `"ababcbacadefegdehijhklij"` → `[9,7,8]`',
    approaches: [
      {
        name: 'Last occurrence + extend window',
        time: 'O(n)',
        space: 'O(26)',
        idea: 'Record each letter’s last index. Walk the string extending `end = max(end, last[ch])`; when `i === end`, the current part closes.',
        code: `
          function partitionLabels(s) {
            const last = {};
            for (let i = 0; i < s.length; i++) last[s[i]] = i;
            const ans = [];
            let start = 0, end = 0;
            for (let i = 0; i < s.length; i++) {
              end = Math.max(end, last[s[i]]);
              if (i === end) {
                ans.push(end - start + 1);
                start = i + 1;
              }
            }
            return ans;
          }
        `,
      },
    ],
    fn: 'partitionLabels',
    tests: [
      { args: ['ababcbacadefegdehijhklij'], expected: [9, 7, 8] },
      { args: ['eccbbbbdec'], expected: [10] },
    ],
  },
];

export const dpExtra = [
  {
    id: 'fibonacci-dp',
    title: 'Fibonacci Number — recursion → memo → tabulation → O(1)',
    difficulty: 'Easy',
    lc: 'fibonacci-number',
    from: 'Lec 20 – DP 1 & 2 (class question 1)',
    tags: ['dp', 'memoization'],
    statement: 'Return `F(n)` where `F(0)=0, F(1)=1, F(n)=F(n−1)+F(n−2)`. The four approaches are the four stages of every DP problem.',
    approaches: [
      {
        name: '1. Recursion',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        code: `
          function fib(n) {
            if (n <= 1) return n;
            return fib(n - 1) + fib(n - 2);
          }
        `,
      },
      {
        name: '2. Memoization (top-down)',
        time: 'O(n)',
        space: 'O(n) + O(n) stack',
        idea: 'Same recursion, but store each answer the first time — overlapping subproblems are computed once.',
        code: `
          function fib(n, dp = new Array(n + 1).fill(-1)) {
            if (n <= 1) return n;
            if (dp[n] !== -1) return dp[n];
            return (dp[n] = fib(n - 1, dp) + fib(n - 2, dp));
          }
        `,
      },
      {
        name: '3. Tabulation (bottom-up)',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function fib(n) {
            if (n <= 1) return n;
            const dp = new Array(n + 1).fill(0);
            dp[1] = 1;
            for (let i = 2; i <= n; i++) dp[i] = dp[i - 1] + dp[i - 2];
            return dp[n];
          }
        `,
      },
      {
        name: '4. Space optimised',
        time: 'O(n)',
        space: 'O(1)',
        code: `
          function fib(n) {
            if (n <= 1) return n;
            let first = 0, second = 1;
            for (let i = 2; i <= n; i++) [first, second] = [second, first + second];
            return second;
          }
        `,
      },
    ],
    explanation: 'DP needs **optimal substructure** and **overlapping subproblems**. Recipe from class: recurrence relation + base cases → memoization → tabulation → space optimisation.',
    fn: 'fib',
    tests: [
      { args: [2], expected: 1 },
      { args: [4], expected: 3 },
      { args: [20], expected: 6765 },
      { args: [0], expected: 0 },
    ],
  },
  {
    id: 'unique-paths',
    title: 'Unique Paths (DP on grids)',
    difficulty: 'Medium',
    lc: 'unique-paths',
    from: 'Lec 20 – DP 1 & 2 (class question 4)',
    tags: ['dp', 'grid'],
    statement: 'Robot at top-left of an m×n grid moves only right or down. Count paths to bottom-right.',
    approaches: [
      {
        name: 'Recursion (from the target)',
        time: 'O(2^(m+n))',
        space: 'O(m + n)',
        code: `
          function uniquePaths(m, n) {
            const solve = (i, j) => {
              if (i === 0 && j === 0) return 1;
              if (i < 0 || j < 0) return 0;
              return solve(i - 1, j) + solve(i, j - 1); // up + left
            };
            return solve(m - 1, n - 1);
          }
        `,
      },
      {
        name: 'Tabulation',
        time: 'O(m·n)',
        space: 'O(m·n)',
        code: `
          function uniquePaths(m, n) {
            const dp = Array.from({ length: m }, () => new Array(n).fill(0));
            for (let i = 0; i < m; i++)
              for (let j = 0; j < n; j++)
                dp[i][j] = i === 0 && j === 0 ? 1 : (i > 0 ? dp[i - 1][j] : 0) + (j > 0 ? dp[i][j - 1] : 0);
            return dp[m - 1][n - 1];
          }
        `,
      },
      {
        name: 'Space optimised (prev row)',
        time: 'O(m·n)',
        space: 'O(n)',
        code: `
          function uniquePaths(m, n) {
            let prev = new Array(n).fill(0);
            for (let i = 0; i < m; i++) {
              const curr = new Array(n).fill(0);
              for (let j = 0; j < n; j++) curr[j] = i === 0 && j === 0 ? 1 : prev[j] + (j > 0 ? curr[j - 1] : 0);
              prev = curr;
            }
            return prev[n - 1];
          }
        `,
      },
    ],
    explanation: 'Combinatorics shortcut: choose which `m−1` of the `m+n−2` moves are “down” → `C(m+n−2, m−1)`. Unique Paths II (obstacles) is in Recursion → “Number of Paths in a Maze”.',
    fn: 'uniquePaths',
    tests: [
      { args: [3, 7], expected: 28 },
      { args: [3, 2], expected: 3 },
      { args: [1, 1], expected: 1 },
    ],
  },
  {
    id: 'house-robber-ii',
    title: 'House Robber II (circular street)',
    difficulty: 'Medium',
    lc: 'house-robber-ii',
    from: 'Lec 20 – homework (213)',
    tags: ['dp'],
    statement: 'Houses are in a circle (first and last are adjacent). Max money without robbing adjacent houses.',
    approaches: [
      {
        name: 'Two linear robberies',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'You can’t take both the first and the last house, so answer = max(rob houses 0..n−2, rob houses 1..n−1).',
        code: `
          function rob(nums) {
            if (nums.length === 1) return nums[0];
            const line = (lo, hi) => {
              let prev = 0, cur = 0;
              for (let i = lo; i <= hi; i++) [prev, cur] = [cur, Math.max(cur, prev + nums[i])];
              return cur;
            };
            return Math.max(line(0, nums.length - 2), line(1, nums.length - 1));
          }
        `,
      },
    ],
    fn: 'rob',
    tests: [
      { args: [[2, 3, 2]], expected: 3 },
      { args: [[1, 2, 3, 1]], expected: 4 },
      { args: [[5]], expected: 5 },
    ],
  },
];

export const searchingExtra = [
  {
    id: 'ship-packages-d-days',
    title: 'Capacity To Ship Packages Within D Days',
    difficulty: 'Medium',
    lc: 'capacity-to-ship-packages-within-d-days',
    from: 'IL4 – Bit Manipulation & Searching',
    tags: ['binary-search-on-answer'],
    statement: 'Packages must ship in order; each day the ship carries up to `capacity`. Minimum capacity to ship all within `days`.\n\n**Example:** `[1..10], days = 5` → `15`',
    approaches: [
      {
        name: 'Binary search on capacity',
        time: 'O(n log Σ)',
        space: 'O(1)',
        idea: 'Capacity lies in `[max(weights), sum(weights)]`; days needed is monotonic decreasing in capacity. Find the smallest capacity whose greedy day-count ≤ days.',
        code: `
          function shipWithinDays(weights, days) {
            let lo = Math.max(...weights), hi = weights.reduce((a, b) => a + b, 0);
            const daysNeeded = (cap) => {
              let d = 1, load = 0;
              for (const w of weights) {
                if (load + w > cap) { d++; load = 0; }
                load += w;
              }
              return d;
            };
            while (lo < hi) {
              const mid = lo + ((hi - lo) >> 1);
              if (daysNeeded(mid) <= days) hi = mid;
              else lo = mid + 1;
            }
            return lo;
          }
        `,
      },
    ],
    explanation: 'Identical structure to Split Array Largest Sum / Book Allocation — say so; recognising the family is the point.',
    fn: 'shipWithinDays',
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], expected: 15 },
      { args: [[3, 2, 2, 4, 1, 4], 3], expected: 6 },
      { args: [[1, 2, 3, 1, 1], 4], expected: 3 },
    ],
  },
];

export const bitsExtra = [
  {
    id: 'reverse-bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    lc: 'reverse-bits',
    from: 'IL4 – Bit Manipulation & Searching',
    tags: ['bits'],
    statement: 'Reverse the bits of a 32-bit unsigned integer.\n\n**Example:** `43261596` (`00000010100101000001111010011100`) → `964176192`',
    approaches: [
      {
        name: 'Shift out / shift in 32 times',
        time: 'O(32)',
        space: 'O(1)',
        idea: 'Take the lowest bit of n (`n & 1`), append it to result (`res << 1 | bit`), shift n right. Use `>>> 0` to keep the result unsigned in JS.',
        code: `
          function reverseBits(n) {
            let res = 0;
            for (let i = 0; i < 32; i++) {
              res = (res << 1) | (n & 1);
              n >>>= 1;
            }
            return res >>> 0;
          }
        `,
      },
    ],
    explanation: 'Signed vs unsigned (from the IL notes): Java/JS ints are 32-bit signed — the MSB is the sign bit, so values ≥ 2³¹ look negative unless you use unsigned shifts (`>>>`).',
    fn: 'reverseBits',
    tests: [
      { args: [43261596], expected: 964176192 },
      { args: [4294967293], expected: 3221225471 },
      { args: [1], expected: 2147483648 },
    ],
  },
];

export const recursionExtra = [
  {
    id: 'predict-the-winner',
    title: 'Predict the Winner',
    difficulty: 'Medium',
    lc: 'predict-the-winner',
    from: 'IL5 – Recursion',
    tags: ['recursion', 'game-theory', 'dp'],
    statement: 'Two players alternately take a number from either end of `nums`; both play optimally. Return true if Player 1 scores ≥ Player 2.\n\n**Example:** `[1,5,2]` → `false`, `[1,5,233,7]` → `true`',
    approaches: [
      {
        name: 'Recursion on score difference',
        time: 'O(2ⁿ)',
        space: 'O(n)',
        idea: '`diff(l, r)` = best (my score − opponent’s score) from `nums[l..r]`. I take one end, then the opponent plays optimally on the rest: `max(nums[l] − diff(l+1, r), nums[r] − diff(l, r−1))`.',
        code: `
          function predictTheWinner(nums) {
            const diff = (l, r) => {
              if (l === r) return nums[l];
              return Math.max(nums[l] - diff(l + 1, r), nums[r] - diff(l, r - 1));
            };
            return diff(0, nums.length - 1) >= 0;
          }
        `,
      },
      {
        name: 'Memoized (interval DP)',
        time: 'O(n²)',
        space: 'O(n²)',
        code: `
          function predictTheWinner(nums) {
            const n = nums.length, memo = Array.from({ length: n }, () => new Array(n));
            const diff = (l, r) => {
              if (l === r) return nums[l];
              if (memo[l][r] !== undefined) return memo[l][r];
              return (memo[l][r] = Math.max(nums[l] - diff(l + 1, r), nums[r] - diff(l, r - 1)));
            };
            return diff(0, n - 1) >= 0;
          }
        `,
      },
    ],
    explanation: 'The “minimax as a difference” trick removes the need to track whose turn it is. Same pattern: Stone Game.',
    fn: 'predictTheWinner',
    tests: [
      { args: [[1, 5, 2]], expected: false },
      { args: [[1, 5, 233, 7]], expected: true },
      { args: [[7]], expected: true },
    ],
  },
];
