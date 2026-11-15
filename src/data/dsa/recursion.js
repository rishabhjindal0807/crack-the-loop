export default {
  id: 'recursion',
  title: 'Recursion',
  icon: '🌀',
  source: 'notes',
  lecture: 'Lec 7 (Recursion 1 & 2)',
  blurb: 'Base case + smaller subproblem, head vs tail recursion, fast power, permutations and combination sums.',
  concepts: `
    - **Complexity of recursion** (instructor notes): time = *number of calls × work per call*; space = *max call-stack depth × space per call*.
    - Every recursive function needs: **base case**, **recursive case** (smaller input), and trust that the call returns the right answer (“leap of faith”).
    - **Call stack:** each call is a stack frame ⇒ recursion depth = extra space. Deep recursion in JS hits “Maximum call stack size” around 10k frames.
    - **Head recursion** — work happens *after* the recursive call (e.g. print 1..n). **Tail recursion** — the recursive call is the last thing; can be turned into a loop.
    - **Fast exponentiation:** \`aᵇ = (a^(b/2))²\` (× a if b is odd) ⇒ O(log b). With mod: \`(m·n) % p = ((m % p)·(n % p)) % p\`.
    - **Choice trees:** permutations (n! leaves), subsets (2ⁿ), combination sum (pick / skip). Write the tree on paper first, then code it.
    - Avoiding duplicate combinations: **sort**, and at each level skip \`candidates[i] === candidates[i − 1]\` when \`i > start\`.
    - Complexity rule of thumb: **branches^depth × work per node**.
  `,
  questions: [
    {
      id: 'multiply-recursive',
      title: 'Multiply Two Numbers Using Recursion',
      difficulty: 'Easy',
      from: 'Lec 7 – Recursion 1',
      tags: ['recursion'],
      statement: 'Compute `x · y` without `*`, using recursion. Handle negatives.',
      approaches: [
        {
          name: 'Repeated addition',
          time: 'O(min(|x|, |y|))',
          space: 'O(min(|x|, |y|)) stack',
          idea: '`x · y = x + x · (y − 1)`. Recurse on the smaller magnitude to keep the stack short.',
          code: `
            function multiply(x, y) {
              if (Math.abs(x) < Math.abs(y)) return multiply(y, x);
              if (y === 0) return 0;
              if (y < 0) return -multiply(x, -y);
              return x + multiply(x, y - 1);
            }
          `,
        },
      ],
      fn: 'multiply',
      output: (r) => (Object.is(r, -0) ? 0 : r),
      tests: [
        { args: [5, 3], expected: 15 },
        { args: [-4, 6], expected: -24 },
        { args: [7, 0], expected: 0 },
        { args: [-3, -3], expected: 9 },
      ],
    },
    {
      id: 'pow-x-n',
      title: 'Modular Exponentiation / Pow(x, n)',
      difficulty: 'Medium',
      lc: 'powx-n',
      from: 'Lec 7 – Recursion 1',
      tags: ['recursion', 'divide-and-conquer'],
      statement: 'Compute `(aᵇ) % c` efficiently. (LeetCode 50 asks for floating-point `xⁿ` with negative n — same idea.)',
      approaches: [
        {
          name: 'Naive loop',
          time: 'O(b)',
          space: 'O(1)',
          code: `
            function modPow(a, b, c) {
              const base = ((a % c) + c) % c; // normalise negatives
              let res = 1 % c;
              for (let i = 0; i < b; i++) res = (res * base) % c;
              return res;
            }
          `,
        },
        {
          name: 'Fast power (recursive)',
          time: 'O(log b)',
          space: 'O(log b)',
          idea: 'Compute `half = a^(b/2)` once and square it. Using BigInt keeps `half * half` exact for large moduli.',
          code: `
            function modPow(a, b, c) {
              const A = BigInt(a), C = BigInt(c);
              const go = (e) => {
                if (e === 0n) return 1n % C;
                const half = go(e / 2n);
                let res = (half * half) % C;
                if (e % 2n === 1n) res = (res * (((A % C) + C) % C)) % C;
                return res;
              };
              return Number(go(BigInt(b)));
            }
          `,
        },
        {
          name: 'Binary exponentiation (iterative)',
          time: 'O(log b)',
          space: 'O(1)',
          idea: 'Walk the bits of b: square the base each step, multiply into the result when the bit is 1.',
          code: `
            function modPow(a, b, c) {
              let base = ((BigInt(a) % BigInt(c)) + BigInt(c)) % BigInt(c);
              let e = BigInt(b), res = 1n % BigInt(c);
              const C = BigInt(c);
              while (e > 0n) {
                if (e & 1n) res = (res * base) % C;
                base = (base * base) % C;
                e >>= 1n;
              }
              return Number(res);
            }
          `,
        },
      ],
      explanation: 'Say out loud why you use BigInt in JS: `(1e9+6)²` ≈ 10¹⁸ exceeds `Number.MAX_SAFE_INTEGER` (≈ 9·10¹⁵).',
      fn: 'modPow',
      tests: [
        { args: [2, 10, 1000], expected: 24 },
        { args: [3, 0, 7], expected: 1 },
        { args: [2, 30, 1000000007], expected: 73741817 },
        { args: [-2, 3, 5], expected: 2 },
      ],
    },
    {
      id: 'power-of-three',
      title: 'Power of Three (recursion)',
      difficulty: 'Easy',
      lc: 'power-of-three',
      from: 'Lec 7 – Recursion (instructor notes)',
      tags: ['recursion', 'math'],
      statement: 'Return true if `n` is a power of three (3⁰ = 1 counts).',
      approaches: [
        {
          name: 'Recursive divide by 3',
          time: 'O(log₃ n)',
          space: 'O(log₃ n) stack',
          idea: 'Base cases: 1 → true; non-positive or not divisible by 3 → false. Otherwise recurse on n / 3.',
          code: `
            function isPowerOfThree(n) {
              if (n === 1) return true;
              if (n <= 0 || n % 3 !== 0) return false;
              return isPowerOfThree(n / 3);
            }
          `,
        },
        {
          name: 'Build up powers (instructor approach)',
          time: 'O(log₃ n)',
          space: 'O(log₃ n) stack',
          idea: 'Start at 1 and keep multiplying by 3 until you hit n (true) or overshoot (false).',
          code: `
            function isPowerOfThree(n) {
              const helper = (a) => {
                if (a === n) return true;
                if (a > n) return false;
                return helper(a * 3);
              };
              return n >= 1 && helper(1);
            }
          `,
        },
        {
          name: 'No recursion (largest power trick)',
          time: 'O(1)',
          space: 'O(1)',
          idea: '3¹⁹ = 1162261467 is the largest power of 3 in a 32-bit int, and its only divisors are powers of 3.',
          code: `
            function isPowerOfThree(n) {
              return n > 0 && 1162261467 % n === 0;
            }
          `,
        },
      ],
      fn: 'isPowerOfThree',
      tests: [
        { args: [27], expected: true },
        { args: [1], expected: true },
        { args: [21], expected: false },
        { args: [0], expected: false },
        { args: [45], expected: false },
      ],
    },
    {
      id: 'palindrome-recursive',
      title: 'Check Palindrome Recursively',
      difficulty: 'Easy',
      from: 'Lec 7 – Recursion 1',
      tags: ['recursion', 'two-pointers'],
      statement: 'Return true if string `s` reads the same forwards and backwards.',
      approaches: [
        {
          name: 'Recursive two pointers',
          time: 'O(n)',
          space: 'O(n) stack',
          idea: 'Compare the ends; if equal, recurse on the inside. Base case: 0 or 1 characters left.',
          code: `
            function isPalindrome(s, l = 0, r = s.length - 1) {
              if (l >= r) return true;
              if (s[l] !== s[r]) return false;
              return isPalindrome(s, l + 1, r - 1);
            }
          `,
        },
      ],
      explanation: 'Pass indices instead of slicing (`s.slice(1, -1)`) — slicing makes it O(n²) time and memory.',
      fn: 'isPalindrome',
      tests: [
        { args: ['racecar'], expected: true },
        { args: ['abca'], expected: false },
        { args: [''], expected: true },
      ],
    },
    {
      id: 'string-permutations',
      title: 'All Permutations of a String',
      difficulty: 'Medium',
      from: 'Lec 7 – Recursion 1',
      tags: ['recursion', 'permutations'],
      statement: 'Return all permutations of string `s` (characters distinct).',
      approaches: [
        {
          name: 'Fix one character, permute the rest',
          time: 'O(n · n!)',
          space: 'O(n) stack',
          code: `
            function permute(s) {
              const out = [];
              const go = (prefix, rest) => {
                if (rest.length === 0) return out.push(prefix);
                for (let i = 0; i < rest.length; i++) go(prefix + rest[i], rest.slice(0, i) + rest.slice(i + 1));
              };
              go('', s);
              return out;
            }
          `,
        },
      ],
      fn: 'permute',
      compare: 'unordered',
      tests: [
        { args: ['abc'], expected: ['abc', 'acb', 'bac', 'bca', 'cab', 'cba'] },
        { args: ['a'], expected: ['a'] },
      ],
    },
    {
      id: 'permutations-array',
      title: 'Permutations of an Array',
      difficulty: 'Medium',
      lc: 'permutations',
      from: 'Lec 7 – Recursion 2',
      tags: ['recursion', 'backtracking'],
      statement: 'Return all permutations of an array of distinct integers.',
      approaches: [
        {
          name: 'Used[] + path',
          time: 'O(n · n!)',
          space: 'O(n)',
          code: `
            function permute(nums) {
              const out = [], path = [], used = new Array(nums.length).fill(false);
              const go = () => {
                if (path.length === nums.length) return out.push([...path]);
                for (let i = 0; i < nums.length; i++) {
                  if (used[i]) continue;
                  used[i] = true; path.push(nums[i]);
                  go();
                  path.pop(); used[i] = false;
                }
              };
              go();
              return out;
            }
          `,
        },
        {
          name: 'In-place swapping',
          time: 'O(n · n!)',
          space: 'O(n) stack',
          idea: 'Swap each candidate into position `start`, recurse on `start + 1`, swap back.',
          code: `
            function permute(nums) {
              const out = [];
              const go = (start) => {
                if (start === nums.length) return out.push([...nums]);
                for (let i = start; i < nums.length; i++) {
                  [nums[start], nums[i]] = [nums[i], nums[start]];
                  go(start + 1);
                  [nums[start], nums[i]] = [nums[i], nums[start]];
                }
              };
              go(0);
              return out;
            }
          `,
        },
      ],
      fn: 'permute',
      compare: 'unordered',
      tests: [
        { args: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
        { args: [[0, 1]], expected: [[0, 1], [1, 0]] },
      ],
    },
    {
      id: 'combination-sum',
      title: 'Combination Sum (reuse allowed)',
      difficulty: 'Medium',
      lc: 'combination-sum',
      from: 'Lec 7 – Recursion 2',
      tags: ['recursion', 'backtracking'],
      statement: 'Return all unique combinations of `candidates` (distinct) summing to `target`; a number may be used unlimited times.',
      approaches: [
        {
          name: 'Pick / move-on recursion',
          time: 'O(2^(target/min))',
          space: 'O(target/min)',
          idea: 'Loop from `start` so combinations are generated in non-decreasing index order (no `[2,3]` and `[3,2]` duplicates). Pass `i` (not `i+1`) to allow reuse.',
          code: `
            function combinationSum(candidates, target) {
              const out = [], path = [];
              const go = (start, remain) => {
                if (remain === 0) return out.push([...path]);
                for (let i = start; i < candidates.length; i++) {
                  if (candidates[i] > remain) continue;
                  path.push(candidates[i]);
                  go(i, remain - candidates[i]);
                  path.pop();
                }
              };
              go(0, target);
              return out;
            }
          `,
        },
      ],
      fn: 'combinationSum',
      compare: 'nested-unordered',
      tests: [
        { args: [[2, 3, 6, 7], 7], expected: [[2, 2, 3], [7]] },
        { args: [[2, 3, 5], 8], expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] },
        { args: [[2], 1], expected: [] },
      ],
    },
    {
      id: 'combination-sum-ii',
      title: 'Combination Sum II (each number once, no duplicate combos)',
      difficulty: 'Medium',
      lc: 'combination-sum-ii',
      from: 'Lec 7 – Recursion 2',
      tags: ['recursion', 'backtracking', 'dedupe'],
      statement: 'Candidates may contain duplicates; each may be used once. Return unique combinations summing to `target`.',
      approaches: [
        {
          name: 'Sort + skip duplicates at the same level',
          time: 'O(2ⁿ)',
          space: 'O(n)',
          idea: 'After sorting, `if (i > start && c[i] === c[i-1]) continue` prevents choosing the same value twice **at the same depth**, while still allowing it deeper.',
          code: `
            function combinationSum2(candidates, target) {
              candidates = [...candidates].sort((a, b) => a - b);
              const out = [], path = [];
              const go = (start, remain) => {
                if (remain === 0) return out.push([...path]);
                for (let i = start; i < candidates.length; i++) {
                  if (i > start && candidates[i] === candidates[i - 1]) continue;
                  if (candidates[i] > remain) break; // sorted ⇒ nothing later fits
                  path.push(candidates[i]);
                  go(i + 1, remain - candidates[i]);
                  path.pop();
                }
              };
              go(0, target);
              return out;
            }
          `,
        },
      ],
      fn: 'combinationSum2',
      compare: 'nested-unordered',
      tests: [
        { args: [[10, 1, 2, 7, 6, 1, 5], 8], expected: [[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]] },
        { args: [[2, 5, 2, 1, 2], 5], expected: [[1, 2, 2], [5]] },
      ],
    },
    {
      id: 'maze-paths',
      title: 'Number of Paths in a Maze with Blockages',
      difficulty: 'Medium',
      lc: 'unique-paths-ii',
      from: 'Lec 7 – Recursion 2',
      tags: ['recursion', 'memoization', 'dp'],
      statement: 'Count paths from top-left to bottom-right moving only right or down. Cells with `-1` (notes) / `1` (LeetCode) are blocked. Here: `1` = blocked.',
      approaches: [
        {
          name: 'Plain recursion',
          time: 'O(2^(m+n))',
          space: 'O(m + n)',
          code: `
            function uniquePathsWithObstacles(grid) {
              const m = grid.length, n = grid[0].length;
              const go = (i, j) => {
                if (i >= m || j >= n || grid[i][j] === 1) return 0;
                if (i === m - 1 && j === n - 1) return 1;
                return go(i + 1, j) + go(i, j + 1);
              };
              return go(0, 0);
            }
          `,
        },
        {
          name: 'Bottom-up DP (1 row)',
          time: 'O(m·n)',
          space: 'O(n)',
          idea: '`ways[j]` = ways to reach the current row’s cell j = from above (old `ways[j]`) + from the left (`ways[j−1]`).',
          code: `
            function uniquePathsWithObstacles(grid) {
              const n = grid[0].length;
              const ways = new Array(n).fill(0);
              ways[0] = 1;
              for (const row of grid) {
                for (let j = 0; j < n; j++) {
                  if (row[j] === 1) ways[j] = 0;
                  else if (j > 0) ways[j] += ways[j - 1];
                }
              }
              return ways[n - 1];
            }
          `,
        },
      ],
      explanation: 'A perfect segue into DP: point out overlapping subproblems in the recursion tree, add a memo, then flatten it into a table.',
      fn: 'uniquePathsWithObstacles',
      tests: [
        { args: [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], expected: 2 },
        { args: [[[0, 1], [0, 0]]], expected: 1 },
        { args: [[[1]]], expected: 0 },
        { args: [[[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]], expected: 10 },
      ],
    },
    {
      id: 'subsets-recursive',
      title: 'Subsets (include / exclude)',
      difficulty: 'Medium',
      lc: 'subsets',
      tags: ['recursion'],
      statement: 'Return all subsets of an array of distinct integers.',
      approaches: [
        {
          name: 'Include / exclude tree',
          time: 'O(n · 2ⁿ)',
          space: 'O(n)',
          code: `
            function subsets(nums) {
              const out = [], path = [];
              const go = (i) => {
                if (i === nums.length) return out.push([...path]);
                path.push(nums[i]); go(i + 1); path.pop(); // include
                go(i + 1);                                 // exclude
              };
              go(0);
              return out;
            }
          `,
        },
      ],
      fn: 'subsets',
      compare: 'nested-unordered',
      tests: [{ args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }],
    },
  ],
};
