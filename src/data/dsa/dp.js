export default {
  id: 'dp',
  title: 'Dynamic Programming',
  icon: '🧩',
  source: 'curriculum',
  blurb: 'Recursion + memo → tabulation → space optimisation. 1D, 2D, knapsack, LIS, LCS, edit distance.',
  concepts: `
    **Recipe (say this out loud in interviews)**
    1. **State:** what does \`dp[i]\` (or \`dp[i][j]\`) mean, in words?
    2. **Transition:** how does a state depend on smaller ones?
    3. **Base cases** and **answer location**.
    4. **Order:** fill so dependencies are ready. Then optimise space if each row only needs the previous one.

    - Start from the brute-force recursion → spot **overlapping subproblems** → memoise (top-down) → tabulate (bottom-up).
    - **0/1 knapsack:** iterate capacity **backwards** in the 1D version so each item is used once; **unbounded:** forwards.
    - **Patterns:** linear (climbing stairs, house robber), grid paths, subsequences (LIS, LCS), string edits, partitions (word break), intervals (burst balloons), knapsack (coin change, subset sum).
  `,
  questions: [
    {
      id: 'climbing-stairs',
      title: 'Climbing Stairs',
      difficulty: 'Easy',
      lc: 'climbing-stairs',
      tags: ['1d-dp'],
      statement: 'Climb 1 or 2 steps at a time. How many distinct ways to reach step n?',
      approaches: [
        {
          name: 'Memoised recursion',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function climbStairs(n, memo = new Map()) {
              if (n <= 2) return n;
              if (memo.has(n)) return memo.get(n);
              const v = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
              memo.set(n, v);
              return v;
            }
          `,
        },
        {
          name: 'Two variables',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`ways(n) = ways(n−1) + ways(n−2)` — Fibonacci.',
          code: `
            function climbStairs(n) {
              let a = 1, b = 1;
              for (let i = 2; i <= n; i++) [a, b] = [b, a + b];
              return b;
            }
          `,
        },
      ],
      fn: 'climbStairs',
      tests: [
        { args: [2], expected: 2 },
        { args: [3], expected: 3 },
        { args: [10], expected: 89 },
      ],
    },
    {
      id: 'house-robber',
      title: 'House Robber',
      difficulty: 'Medium',
      lc: 'house-robber',
      tags: ['1d-dp'],
      statement: 'Max money robbing non-adjacent houses.',
      approaches: [
        {
          name: 'Rob or skip',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`dp[i] = max(dp[i−1], dp[i−2] + nums[i])`.',
          code: `
            function rob(nums) {
              let prev = 0, cur = 0;
              for (const x of nums) [prev, cur] = [cur, Math.max(cur, prev + x)];
              return cur;
            }
          `,
        },
      ],
      explanation: 'House Robber II (circular): answer = max(rob(nums[0..n−2]), rob(nums[1..n−1])).',
      fn: 'rob',
      tests: [
        { args: [[1, 2, 3, 1]], expected: 4 },
        { args: [[2, 7, 9, 3, 1]], expected: 12 },
      ],
    },
    {
      id: 'coin-change',
      title: 'Coin Change (min coins)',
      difficulty: 'Medium',
      lc: 'coin-change',
      tags: ['unbounded-knapsack'],
      statement: 'Fewest coins to make `amount`, or -1.',
      approaches: [
        {
          name: 'Bottom-up DP',
          time: 'O(amount · coins)',
          space: 'O(amount)',
          idea: '`dp[a] = 1 + min(dp[a − c])` over coins c ≤ a.',
          code: `
            function coinChange(coins, amount) {
              const dp = new Array(amount + 1).fill(Infinity);
              dp[0] = 0;
              for (let a = 1; a <= amount; a++)
                for (const c of coins) if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
              return dp[amount] === Infinity ? -1 : dp[amount];
            }
          `,
        },
      ],
      explanation: 'Greedy (largest coin first) fails for coins like `[1, 3, 4]`, amount 6 (greedy: 4+1+1, optimal: 3+3).',
      fn: 'coinChange',
      tests: [
        { args: [[1, 2, 5], 11], expected: 3 },
        { args: [[2], 3], expected: -1 },
        { args: [[1, 3, 4], 6], expected: 2 },
        { args: [[1], 0], expected: 0 },
      ],
    },
    {
      id: 'lis',
      title: 'Longest Increasing Subsequence',
      difficulty: 'Medium',
      lc: 'longest-increasing-subsequence',
      tags: ['subsequence', 'binary-search'],
      statement: 'Length of the longest strictly increasing subsequence.',
      approaches: [
        {
          name: 'O(n²) DP',
          time: 'O(n²)',
          space: 'O(n)',
          code: `
            function lengthOfLIS(nums) {
              const dp = new Array(nums.length).fill(1);
              for (let i = 0; i < nums.length; i++)
                for (let j = 0; j < i; j++) if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
              return Math.max(0, ...dp);
            }
          `,
        },
        {
          name: 'Patience sorting',
          time: 'O(n log n)',
          space: 'O(n)',
          idea: '`tails[k]` = smallest tail of any increasing subsequence of length k+1. Binary search where each number fits (lower bound) and overwrite.',
          code: `
            function lengthOfLIS(nums) {
              const tails = [];
              for (const x of nums) {
                let lo = 0, hi = tails.length;
                while (lo < hi) {
                  const mid = (lo + hi) >> 1;
                  if (tails[mid] < x) lo = mid + 1;
                  else hi = mid;
                }
                tails[lo] = x;
              }
              return tails.length;
            }
          `,
        },
      ],
      fn: 'lengthOfLIS',
      tests: [
        { args: [[10, 9, 2, 5, 3, 7, 101, 18]], expected: 4 },
        { args: [[0, 1, 0, 3, 2, 3]], expected: 4 },
        { args: [[7, 7, 7, 7]], expected: 1 },
      ],
    },
    {
      id: 'lcs',
      title: 'Longest Common Subsequence',
      difficulty: 'Medium',
      lc: 'longest-common-subsequence',
      tags: ['2d-dp', 'strings'],
      statement: 'Length of the longest subsequence common to `a` and `b`.',
      approaches: [
        {
          name: '2D table',
          time: 'O(m·n)',
          space: 'O(m·n)',
          idea: 'If `a[i−1] === b[j−1]`: `dp[i][j] = dp[i−1][j−1] + 1`, else `max(dp[i−1][j], dp[i][j−1])`.',
          code: `
            function longestCommonSubsequence(a, b) {
              const m = a.length, n = b.length;
              const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
              for (let i = 1; i <= m; i++)
                for (let j = 1; j <= n; j++)
                  dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
              return dp[m][n];
            }
          `,
        },
      ],
      fn: 'longestCommonSubsequence',
      tests: [
        { args: ['abcde', 'ace'], expected: 3 },
        { args: ['abc', 'def'], expected: 0 },
      ],
    },
    {
      id: 'edit-distance',
      title: 'Edit Distance',
      difficulty: 'Medium',
      lc: 'edit-distance',
      tags: ['2d-dp', 'strings'],
      statement: 'Minimum insert/delete/replace operations to turn `a` into `b`.',
      approaches: [
        {
          name: 'Rolling 1D row',
          time: 'O(m·n)',
          space: 'O(n)',
          idea: 'Match ⇒ diagonal. Otherwise `1 + min(replace = diag, delete = up, insert = left)`.',
          code: `
            function minDistance(a, b) {
              const n = b.length;
              let prev = Array.from({ length: n + 1 }, (_, j) => j);
              for (let i = 1; i <= a.length; i++) {
                const cur = [i];
                for (let j = 1; j <= n; j++)
                  cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] : 1 + Math.min(prev[j - 1], prev[j], cur[j - 1]);
                prev = cur;
              }
              return prev[n];
            }
          `,
        },
      ],
      fn: 'minDistance',
      tests: [
        { args: ['horse', 'ros'], expected: 3 },
        { args: ['intention', 'execution'], expected: 5 },
        { args: ['', 'abc'], expected: 3 },
      ],
    },
    {
      id: 'word-break',
      title: 'Word Break',
      difficulty: 'Medium',
      lc: 'word-break',
      tags: ['1d-dp', 'strings'],
      statement: 'Can `s` be segmented into words from `wordDict`?',
      approaches: [
        {
          name: 'dp[i] = prefix of length i is breakable',
          time: 'O(n² )',
          space: 'O(n)',
          code: `
            function wordBreak(s, wordDict) {
              const words = new Set(wordDict);
              const maxLen = Math.max(0, ...wordDict.map((w) => w.length));
              const dp = new Array(s.length + 1).fill(false);
              dp[0] = true;
              for (let i = 1; i <= s.length; i++)
                for (let j = Math.max(0, i - maxLen); j < i && !dp[i]; j++)
                  if (dp[j] && words.has(s.slice(j, i))) dp[i] = true;
              return dp[s.length];
            }
          `,
        },
      ],
      fn: 'wordBreak',
      tests: [
        { args: ['leetcode', ['leet', 'code']], expected: true },
        { args: ['applepenapple', ['apple', 'pen']], expected: true },
        { args: ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], expected: false },
      ],
    },
    {
      id: 'partition-equal-subset',
      title: 'Partition Equal Subset Sum (0/1 knapsack)',
      difficulty: 'Medium',
      lc: 'partition-equal-subset-sum',
      tags: ['0-1-knapsack'],
      statement: 'Can the array be split into two subsets with equal sum?',
      approaches: [
        {
          name: '1D subset-sum, capacity backwards',
          time: 'O(n · sum)',
          space: 'O(sum)',
          idea: 'Need a subset summing to total/2. Iterate capacity **downwards** so each number is used at most once.',
          code: `
            function canPartition(nums) {
              const total = nums.reduce((a, b) => a + b, 0);
              if (total % 2) return false;
              const target = total / 2;
              const dp = new Array(target + 1).fill(false);
              dp[0] = true;
              for (const x of nums)
                for (let c = target; c >= x; c--) dp[c] = dp[c] || dp[c - x];
              return dp[target];
            }
          `,
        },
      ],
      fn: 'canPartition',
      tests: [
        { args: [[1, 5, 11, 5]], expected: true },
        { args: [[1, 2, 3, 5]], expected: false },
      ],
    },
    {
      id: 'stock-cooldown',
      title: 'Best Time to Buy and Sell Stock (I & with cooldown)',
      difficulty: 'Medium',
      lc: 'best-time-to-buy-and-sell-stock-with-cooldown',
      tags: ['state-machine-dp'],
      statement: 'Unlimited transactions, but after selling you must wait one day. Max profit?',
      approaches: [
        {
          name: 'State machine: hold / sold / rest',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`hold = max(hold, rest − p)`, `sold = hold + p`, `rest = max(rest, prevSold)`.',
          code: `
            function maxProfit(prices) {
              let hold = -Infinity, sold = 0, rest = 0;
              for (const p of prices) {
                const prevSold = sold;
                sold = hold + p;
                hold = Math.max(hold, rest - p);
                rest = Math.max(rest, prevSold);
              }
              return Math.max(sold, rest);
            }
          `,
        },
      ],
      explanation: 'The whole stock family (one transaction, unlimited, k transactions, fee, cooldown) is the same state machine with different transitions — great to show you see the pattern.',
      fn: 'maxProfit',
      tests: [
        { args: [[1, 2, 3, 0, 2]], expected: 3 },
        { args: [[1]], expected: 0 },
      ],
    },
  ],
};
