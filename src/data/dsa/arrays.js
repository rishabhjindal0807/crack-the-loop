export default {
  id: 'arrays',
  title: 'Arrays, Prefix Sum & 2D Arrays',
  icon: '📊',
  source: 'notes',
  lecture: 'Lec 1–3 + IL1/IL2',
  blurb: 'Dynamic arrays, amortised O(1) push, prefix sums in 1D and 2D, contribution technique, matrix traversal.',
  concepts: `
    - **Time complexity** (Lec 2) — count how the number of operations grows with input size n, drop constants and lower-order terms (\`3n + 2\` → **O(n)**). Order: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!). Binary search is log n, linear search n, merge/quick sort n log n, nested loops over a 2D array n², backtracking 2ⁿ / n!.
    - **Space complexity** — *extra* memory beyond the input/output (auxiliary space). Recursion uses O(depth) stack space.
    - **Array** — contiguous memory, O(1) index access, O(n) insert/delete in the middle.
    - **Dynamic array** (JS \`Array\`, Java \`ArrayList\`) — when full, allocate ~2× and copy. One push can be O(n), but **amortised O(1)** because resizes get exponentially rarer.
    - **Prefix sum** — \`pre[i] = a[0] + … + a[i-1]\` ⇒ \`sum(l..r) = pre[r+1] - pre[l]\` in O(1) after O(n) build.
    - **2D prefix sum** — \`P[i][j] = a[i][j] + P[i-1][j] + P[i][j-1] - P[i-1][j-1]\`; a region is \`P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1]\` (inclusion–exclusion).
    - **Contribution technique** — instead of enumerating every subarray/submatrix, ask *“how many of them contain element x?”* and multiply.
    - **Remove the absolute value** — \`|a - b|\` = \`max(a - b, b - a)\`; split into cases and each becomes a max/min scan.
    - **Two-pass left/right max** — trapping rain water, product except self: precompute info from both sides.
  `,
  questions: [
    {
      id: 'max-abs-expression',
      title: 'Maximum of |arr[i] − arr[j]| + |i − j|',
      difficulty: 'Medium',
      from: 'Lecture 1 – Arrays & Dynamic Arrays',
      tags: ['math', 'array'],
      statement: `
        Given an array of N positive integers, find the maximum value of \`|arr[i] - arr[j]| + |i - j|\` over all \`0 ≤ i, j < N\`.

        **Example:** \`arr = [1, 2, 3, 1]\` → \`4\` (i = 0, j = 2: |1−3| + |0−2| = 4)
      `,
      approaches: [
        {
          name: 'Brute force',
          time: 'O(n²)',
          space: 'O(1)',
          idea: 'Try every pair (i, j).',
          code: `
            function maxValue(arr) {
              let best = 0;
              for (let i = 0; i < arr.length; i++)
                for (let j = 0; j < arr.length; j++)
                  best = Math.max(best, Math.abs(arr[i] - arr[j]) + Math.abs(i - j));
              return best;
            }
          `,
        },
        {
          name: 'Optimal — remove the mods',
          time: 'O(n)',
          space: 'O(1)',
          idea: `
            Opening both absolute values gives four cases that collapse into two:
            \`(arr[i] + i) − (arr[j] + j)\` and \`(arr[i] − i) − (arr[j] − j)\` (and their negations).
            So the answer is \`max(max(a+i) − min(a+i), max(a−i) − min(a−i))\`.
          `,
          code: `
            function maxValue(arr) {
              let max1 = -Infinity, min1 = Infinity, max2 = -Infinity, min2 = Infinity;
              for (let i = 0; i < arr.length; i++) {
                max1 = Math.max(max1, arr[i] + i);
                min1 = Math.min(min1, arr[i] + i);
                max2 = Math.max(max2, arr[i] - i);
                min2 = Math.min(min2, arr[i] - i);
              }
              return Math.max(max1 - min1, max2 - min2);
            }
          `,
        },
      ],
      explanation: `
        The trick generalises: whenever you see \`|x_i - x_j| + |y_i - y_j|\` (Manhattan distance), rewrite it as
        the max over sign combinations and track running max/min. Same idea solves *“max Manhattan distance between points”*.
      `,
      fn: 'maxValue',
      tests: [
        { args: [[1, 2, 3, 1]], expected: 4 },
        { args: [[1, 1, 1]], expected: 2 },
        { args: [[5]], expected: 0 },
        { args: [[1, 9, 3, 7, 2]], expected: 10 },
      ],
    },
    {
      id: 'trapping-rain-water',
      title: 'Trapping Rain Water',
      difficulty: 'Hard',
      lc: 'trapping-rain-water',
      from: 'Lecture 1 – Orientation (class problem)',
      tags: ['two-pointers', 'prefix-max'],
      statement: `
        Given \`n\` non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.

        **Example:** \`[0,1,0,2,1,0,1,3,2,1,2,1]\` → \`6\`
      `,
      approaches: [
        {
          name: 'Brute force',
          time: 'O(n²)',
          space: 'O(1)',
          idea: 'For each bar, scan left and right for the tallest bar. Water above it = `min(leftMax, rightMax) − height[i]`.',
          code: `
            function trap(height) {
              let total = 0;
              for (let i = 1; i < height.length - 1; i++) {
                let leftMax = 0, rightMax = 0;
                for (let l = i; l >= 0; l--) leftMax = Math.max(leftMax, height[l]);
                for (let r = i; r < height.length; r++) rightMax = Math.max(rightMax, height[r]);
                total += Math.min(leftMax, rightMax) - height[i];
              }
              return total;
            }
          `,
        },
        {
          name: 'Prefix / suffix max',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Precompute `leftMax[i]` and `rightMax[i]` in two passes, then one pass to sum.',
          code: `
            function trap(height) {
              const n = height.length;
              if (n === 0) return 0;
              const leftMax = new Array(n), rightMax = new Array(n);
              leftMax[0] = height[0];
              for (let i = 1; i < n; i++) leftMax[i] = Math.max(leftMax[i - 1], height[i]);
              rightMax[n - 1] = height[n - 1];
              for (let i = n - 2; i >= 0; i--) rightMax[i] = Math.max(rightMax[i + 1], height[i]);
              let total = 0;
              for (let i = 0; i < n; i++) total += Math.min(leftMax[i], rightMax[i]) - height[i];
              return total;
            }
          `,
        },
        {
          name: 'Two pointers (optimal)',
          time: 'O(n)',
          space: 'O(1)',
          idea: `
            Move the pointer on the **shorter** side. If \`leftMax < rightMax\`, the water at \`left\` is bounded by
            \`leftMax\` no matter what lies in between — so we can settle it and move on.
          `,
          code: `
            function trap(height) {
              let left = 0, right = height.length - 1;
              let leftMax = 0, rightMax = 0, total = 0;
              while (left < right) {
                leftMax = Math.max(leftMax, height[left]);
                rightMax = Math.max(rightMax, height[right]);
                if (leftMax < rightMax) {
                  total += leftMax - height[left];
                  left++;
                } else {
                  total += rightMax - height[right];
                  right--;
                }
              }
              return total;
            }
          `,
        },
      ],
      explanation: `
        Interviewers love this one because it has three clean levels. Say the brute force first, point out the
        repeated work (recomputing maxes), fix it with prefix arrays, then argue *why* two pointers is safe:
        the smaller of the two running maxes is the true bottleneck for that side.
      `,
      fn: 'trap',
      tests: [
        { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
        { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
        { args: [[1, 2, 3]], expected: 0 },
        { args: [[]], expected: 0 },
      ],
    },
    {
      id: 'sum-of-all-submatrices',
      title: 'Sum of All Submatrices',
      difficulty: 'Medium',
      from: 'Lec 2 – SubMatrices & Range Sum',
      tags: ['contribution-technique', 'matrix'],
      statement: `
        Given an N×N matrix, return the sum of the sums of **all** its submatrices.

        **Example:** \`[[1,1],[1,1]]\` → \`16\` (4 one-cell + 4 two-cell + 1 four-cell submatrix = 4 + 8 + 4)
      `,
      approaches: [
        {
          name: 'Brute force',
          time: 'O(n⁶)',
          space: 'O(1)',
          idea: 'Pick a top-left and bottom-right corner (O(n⁴)) and add every element inside (O(n²)).',
          code: `
            function submatrixSum(mat) {
              const n = mat.length;
              let total = 0;
              for (let i = 0; i < n; i++)
                for (let j = 0; j < n; j++)
                  for (let k = i; k < n; k++)
                    for (let l = j; l < n; l++)
                      for (let x = i; x <= k; x++)
                        for (let y = j; y <= l; y++) total += mat[x][y];
              return total;
            }
          `,
        },
        {
          name: 'Contribution technique',
          time: 'O(n²)',
          space: 'O(1)',
          idea: `
            Cell \`(i, j)\` is inside a submatrix iff the top-left corner is in \`[0..i]×[0..j]\` and the
            bottom-right is in \`[i..n-1]×[j..n-1]\`. So it appears \`(i+1)(j+1)(n-i)(n-j)\` times.
          `,
          code: `
            function submatrixSum(mat) {
              const n = mat.length;
              let total = 0;
              for (let i = 0; i < n; i++)
                for (let j = 0; j < n; j++)
                  total += mat[i][j] * (i + 1) * (j + 1) * (n - i) * (n - j);
              return total;
            }
          `,
        },
      ],
      explanation: `
        The 1D version is the classic warm-up: in an array of length n, \`a[i]\` appears in \`(i+1)·(n−i)\` subarrays.
        Whenever a problem says “sum over all subarrays/submatrices”, try counting contributions per element.
      `,
      fn: 'submatrixSum',
      tests: [
        { args: [[[1, 1], [1, 1]]], expected: 16 },
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: 500 },
        { args: [[[7]]], expected: 7 },
      ],
    },
    {
      id: 'range-sum-query-immutable',
      title: 'Range Sum Query – Immutable (1D prefix sum)',
      difficulty: 'Easy',
      lc: 'range-sum-query-immutable',
      from: 'Lec 2 – SubMatrices & Range Sum',
      tags: ['prefix-sum', 'design'],
      statement: `
        Design \`NumArray\` with \`sumRange(left, right)\` returning the sum of \`nums[left..right]\` inclusive. Many queries will be made.
      `,
      approaches: [
        {
          name: 'Prefix sum',
          time: 'O(n) build, O(1) query',
          space: 'O(n)',
          idea: 'Store `pre[i+1] = pre[i] + nums[i]` (one extra slot avoids the `left = 0` edge case).',
          code: `
            class NumArray {
              constructor(nums) {
                this.pre = new Array(nums.length + 1).fill(0);
                for (let i = 0; i < nums.length; i++) this.pre[i + 1] = this.pre[i] + nums[i];
              }
              sumRange(left, right) {
                return this.pre[right + 1] - this.pre[left];
              }
            }
          `,
        },
      ],
      explanation: `
        Brute force is O(n) per query → O(q·n). Prefix sums make each query O(1). Mention the
        **n+1 sized** array trick — it removes the \`if (left > 0)\` branch.
        If the array is *mutable*, switch to a Fenwick tree / segment tree (O(log n) update and query).
      `,
      kind: 'class',
      fn: 'NumArray',
      tests: [
        { ops: ['NumArray', 'sumRange', 'sumRange', 'sumRange'], args: [[[-2, 0, 3, -5, 2, -1]], [0, 2], [2, 5], [0, 5]], expected: [null, 1, -1, -3] },
        { ops: ['NumArray', 'sumRange', 'sumRange'], args: [[[1, 2, 3, 4, 5]], [1, 3], [0, 4]], expected: [null, 9, 15] },
      ],
    },
    {
      id: 'range-sum-query-2d',
      title: 'Range Sum Query 2D – Immutable',
      difficulty: 'Medium',
      lc: 'range-sum-query-2d-immutable',
      from: 'IL2 – 1D & 2D Arrays',
      tags: ['prefix-sum', 'matrix', 'design'],
      statement: `
        Design \`NumMatrix\` with \`sumRegion(row1, col1, row2, col2)\` returning the sum of the rectangle with those corners (inclusive).
      `,
      approaches: [
        {
          name: '2D prefix sum',
          time: 'O(m·n) build, O(1) query',
          space: 'O(m·n)',
          idea: 'Pad with an extra row and column of zeros so no bounds checks are needed.',
          code: `
            class NumMatrix {
              constructor(matrix) {
                const m = matrix.length, n = matrix[0].length;
                this.P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
                for (let i = 1; i <= m; i++)
                  for (let j = 1; j <= n; j++)
                    this.P[i][j] = matrix[i - 1][j - 1] + this.P[i - 1][j] + this.P[i][j - 1] - this.P[i - 1][j - 1];
              }
              sumRegion(r1, c1, r2, c2) {
                const P = this.P;
                return P[r2 + 1][c2 + 1] - P[r1][c2 + 1] - P[r2 + 1][c1] + P[r1][c1];
              }
            }
          `,
        },
      ],
      explanation: `
        Draw the four rectangles: whole → subtract the strip above → subtract the strip on the left → add back the
        top-left corner that got subtracted twice. Your instructor's version (IL2) used no padding and three
        \`if\` checks — both are fine; padding is less error-prone under pressure.
      `,
      kind: 'class',
      fn: 'NumMatrix',
      tests: [
        {
          ops: ['NumMatrix', 'sumRegion', 'sumRegion', 'sumRegion'],
          args: [[[[3, 0, 1, 4, 2], [5, 6, 3, 2, 1], [1, 2, 0, 1, 5], [4, 1, 0, 1, 7], [1, 0, 3, 0, 5]]], [2, 1, 4, 3], [1, 1, 2, 2], [1, 2, 2, 4]],
          expected: [null, 8, 11, 12],
        },
      ],
    },
    {
      id: 'search-2d-matrix',
      title: 'Search a 2D Matrix',
      difficulty: 'Medium',
      lc: 'search-a-2d-matrix',
      from: 'IL2 – 1D & 2D Arrays',
      tags: ['binary-search', 'matrix'],
      statement: `
        Each row is sorted and the first element of each row is greater than the last element of the previous row. Return whether \`target\` exists, in O(log(m·n)).
      `,
      approaches: [
        {
          name: 'Staircase search',
          time: 'O(m + n)',
          space: 'O(1)',
          idea: 'Start top-right: go left if too big, down if too small. (Also works for LC 240 where rows/cols are sorted independently.)',
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
        {
          name: 'Binary search on flattened index',
          time: 'O(log(m·n))',
          space: 'O(1)',
          idea: 'Treat the matrix as one sorted array of length `m·n`: index `k` ↦ `matrix[⌊k/n⌋][k % n]`.',
          code: `
            function searchMatrix(matrix, target) {
              const m = matrix.length, n = matrix[0].length;
              let lo = 0, hi = m * n - 1;
              while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                const v = matrix[Math.floor(mid / n)][mid % n];
                if (v === target) return true;
                if (v < target) lo = mid + 1;
                else hi = mid - 1;
              }
              return false;
            }
          `,
        },
      ],
      fn: 'searchMatrix',
      tests: [
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3], expected: true },
        { args: [[[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13], expected: false },
        { args: [[[1]], 1], expected: true },
      ],
    },
    {
      id: 'maximum-subarray',
      title: "Maximum Subarray (Kadane's)",
      difficulty: 'Medium',
      lc: 'maximum-subarray',
      tags: ['kadane', 'dp'],
      statement: `Find the contiguous subarray with the largest sum and return the sum.

        **Example:** \`[-2,1,-3,4,-1,2,1,-5,4]\` → \`6\` (\`[4,-1,2,1]\`)`,
      approaches: [
        {
          name: 'Prefix sums',
          time: 'O(n)',
          space: 'O(1)',
          idea: 'Best subarray ending at i = `prefix[i] − min prefix before i`.',
          code: `
            function maxSubArray(nums) {
              let prefix = 0, minPrefix = 0, best = -Infinity;
              for (const x of nums) {
                prefix += x;
                best = Math.max(best, prefix - minPrefix);
                minPrefix = Math.min(minPrefix, prefix);
              }
              return best;
            }
          `,
        },
        {
          name: "Kadane's",
          time: 'O(n)',
          space: 'O(1)',
          idea: 'At each index either extend the previous subarray or start fresh: `cur = max(x, cur + x)`.',
          code: `
            function maxSubArray(nums) {
              let cur = nums[0], best = nums[0];
              for (let i = 1; i < nums.length; i++) {
                cur = Math.max(nums[i], cur + nums[i]);
                best = Math.max(best, cur);
              }
              return best;
            }
          `,
        },
      ],
      explanation: `Kadane's is a 1-state DP: \`dp[i]\` = best sum ending at i. Watch out for the all-negative case — initialise with \`nums[0]\`, not 0.`,
      fn: 'maxSubArray',
      tests: [
        { args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
        { args: [[1]], expected: 1 },
        { args: [[-3, -1, -2]], expected: -1 },
        { args: [[5, 4, -1, 7, 8]], expected: 23 },
      ],
    },
    {
      id: 'product-except-self',
      title: 'Product of Array Except Self',
      difficulty: 'Medium',
      lc: 'product-of-array-except-self',
      tags: ['prefix-product'],
      statement: 'Return an array where `answer[i]` is the product of every element except `nums[i]`, in O(n) and **without division**.',
      approaches: [
        {
          name: 'Prefix × suffix',
          time: 'O(n)',
          space: 'O(1) extra (output excluded)',
          idea: 'First pass writes the product of everything to the left; second pass multiplies in a running product from the right.',
          code: `
            function productExceptSelf(nums) {
              const n = nums.length, ans = new Array(n).fill(1);
              for (let i = 1; i < n; i++) ans[i] = ans[i - 1] * nums[i - 1];
              let right = 1;
              for (let i = n - 1; i >= 0; i--) {
                ans[i] *= right;
                right *= nums[i];
              }
              return ans;
            }
          `,
        },
      ],
      explanation: 'Same “info from both sides” pattern as trapping rain water. Division fails with zeros, which is why interviewers forbid it.',
      fn: 'productExceptSelf',
      output: (r) => r.map((x) => (Object.is(x, -0) ? 0 : x)),
      tests: [
        { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
        { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      ],
    },
    {
      id: 'spiral-matrix',
      title: 'Spiral Matrix',
      difficulty: 'Medium',
      lc: 'spiral-matrix',
      tags: ['matrix', 'simulation'],
      statement: 'Return all elements of an m×n matrix in spiral order.',
      approaches: [
        {
          name: 'Shrinking boundaries',
          time: 'O(m·n)',
          space: 'O(1) extra',
          idea: 'Keep `top, bottom, left, right`. Walk right, down, left, up — shrinking a boundary after each side.',
          code: `
            function spiralOrder(matrix) {
              const out = [];
              let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;
              while (top <= bottom && left <= right) {
                for (let j = left; j <= right; j++) out.push(matrix[top][j]);
                top++;
                for (let i = top; i <= bottom; i++) out.push(matrix[i][right]);
                right--;
                if (top <= bottom) {
                  for (let j = right; j >= left; j--) out.push(matrix[bottom][j]);
                  bottom--;
                }
                if (left <= right) {
                  for (let i = bottom; i >= top; i--) out.push(matrix[i][left]);
                  left++;
                }
              }
              return out;
            }
          `,
        },
      ],
      explanation: 'The two `if` guards handle single-row / single-column leftovers — the most common bug in this problem.',
      fn: 'spiralOrder',
      tests: [
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [1, 2, 3, 6, 9, 8, 7, 4, 5] },
        { args: [[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]], expected: [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7] },
        { args: [[[1], [2], [3]]], expected: [1, 2, 3] },
      ],
    },
    {
      id: 'spiral-matrix-ii',
      title: 'Spiral Matrix II (generate n×n in spiral order)',
      difficulty: 'Medium',
      lc: 'spiral-matrix-ii',
      from: 'Lec 3 – 1D & 2D Arrays (instructor notes)',
      tags: ['matrix', 'simulation', 'direction-vectors'],
      statement: 'Generate an n×n matrix filled with `1..n²` in spiral order.\n\n**Example:** `n = 3` → `[[1,2,3],[8,9,4],[7,6,5]]`',
      approaches: [
        {
          name: 'Direction vectors (instructor approach)',
          time: 'O(n²)',
          space: 'O(1) extra',
          idea: `
            Keep \`dx = [0, 1, 0, -1]\`, \`dy = [1, 0, -1, 0]\` (right → down → left → up). Walk one step at a time;
            when the next cell is out of bounds or already filled, turn: \`d = (d + 1) % 4\`. Stop after writing n².
          `,
          code: `
            function generateMatrix(n) {
              const m = Array.from({ length: n }, () => new Array(n).fill(0));
              const dx = [0, 1, 0, -1], dy = [1, 0, -1, 0];
              let r = 0, c = 0, d = 0;
              for (let v = 1; v <= n * n; v++) {
                m[r][c] = v;
                const nr = r + dx[d], nc = c + dy[d];
                if (nr < 0 || nc < 0 || nr >= n || nc >= n || m[nr][nc] !== 0) d = (d + 1) % 4;
                r += dx[d];
                c += dy[d];
              }
              return m;
            }
          `,
        },
        {
          name: 'Shrinking boundaries',
          time: 'O(n²)',
          space: 'O(1) extra',
          code: `
            function generateMatrix(n) {
              const m = Array.from({ length: n }, () => new Array(n).fill(0));
              let top = 0, bottom = n - 1, left = 0, right = n - 1, v = 1;
              while (v <= n * n) {
                for (let j = left; j <= right; j++) m[top][j] = v++;
                top++;
                for (let i = top; i <= bottom; i++) m[i][right] = v++;
                right--;
                for (let j = right; j >= left; j--) m[bottom][j] = v++;
                bottom--;
                for (let i = bottom; i >= top; i--) m[i][left] = v++;
                left++;
              }
              return m;
            }
          `,
        },
      ],
      explanation: 'The direction-vector trick (`dx/dy` + turn on invalid cell) is reusable for any grid walk — robot simulation, spiral traversal, snake games.',
      fn: 'generateMatrix',
      tests: [
        { args: [3], expected: [[1, 2, 3], [8, 9, 4], [7, 6, 5]] },
        { args: [1], expected: [[1]] },
        { args: [4], expected: [[1, 2, 3, 4], [12, 13, 14, 5], [11, 16, 15, 6], [10, 9, 8, 7]] },
      ],
    },
    {
      id: 'rotate-image',
      title: 'Rotate Image (90° clockwise, in place)',
      difficulty: 'Medium',
      lc: 'rotate-image',
      tags: ['matrix'],
      statement: 'Rotate an n×n matrix by 90° clockwise **in place**.',
      approaches: [
        {
          name: 'Transpose + reverse rows',
          time: 'O(n²)',
          space: 'O(1)',
          idea: 'Clockwise rotation = transpose (swap `a[i][j]` with `a[j][i]`) then reverse each row.',
          code: `
            function rotate(matrix) {
              const n = matrix.length;
              for (let i = 0; i < n; i++)
                for (let j = i + 1; j < n; j++) {
                  const t = matrix[i][j];
                  matrix[i][j] = matrix[j][i];
                  matrix[j][i] = t;
                }
              for (const row of matrix) row.reverse();
              return matrix;
            }
          `,
        },
      ],
      explanation: 'Anticlockwise = transpose + reverse each **column** (or reverse rows first, then transpose).',
      fn: 'rotate',
      tests: [
        { args: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
        { args: [[[1, 2], [3, 4]]], expected: [[3, 1], [4, 2]] },
      ],
    },
  ],
};
