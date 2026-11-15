export default {
  id: 'two-pointers',
  title: 'Two Pointers & Sliding Window',
  icon: '👉',
  source: 'curriculum',
  blurb: 'Opposite-end pointers on sorted data, fixed and variable windows, monotonic deque.',
  concepts: `
    - **Opposite ends** (sorted array): move the pointer that can improve the answer — pair sum, 3Sum, container with most water.
    - **Fast / slow** (same direction): remove duplicates in place, partitioning, cycle detection.
    - **Fixed window of size k:** add the incoming element, remove the outgoing one.
    - **Variable window:** expand \`r\` always; shrink \`l\` while the window is invalid. Works when the validity condition is **monotonic** (e.g. all non-negative numbers).
    - **Monotonic deque** keeps candidates in decreasing order ⇒ sliding window maximum in O(n).
  `,
  questions: [
    {
      id: 'three-sum',
      title: '3Sum',
      difficulty: 'Medium',
      lc: '3sum',
      tags: ['two-pointers', 'sorting'],
      statement: 'Return all unique triplets that sum to 0.',
      approaches: [
        {
          name: 'Sort + two pointers',
          time: 'O(n²)',
          space: 'O(1) extra',
          idea: 'Fix `i`, then two-pointer the rest for `−nums[i]`. Skip duplicate values for i, l and r.',
          code: `
            function threeSum(nums) {
              const a = [...nums].sort((x, y) => x - y), out = [];
              for (let i = 0; i < a.length - 2; i++) {
                if (a[i] > 0) break;
                if (i > 0 && a[i] === a[i - 1]) continue;
                let l = i + 1, r = a.length - 1;
                while (l < r) {
                  const sum = a[i] + a[l] + a[r];
                  if (sum < 0) l++;
                  else if (sum > 0) r--;
                  else {
                    out.push([a[i], a[l], a[r]]);
                    while (l < r && a[l] === a[l + 1]) l++;
                    while (l < r && a[r] === a[r - 1]) r--;
                    l++; r--;
                  }
                }
              }
              return out;
            }
          `,
        },
      ],
      fn: 'threeSum',
      compare: 'nested-unordered',
      tests: [
        { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
        { args: [[0, 1, 1]], expected: [] },
        { args: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
      ],
    },
    {
      id: 'container-most-water',
      title: 'Container With Most Water',
      difficulty: 'Medium',
      lc: 'container-with-most-water',
      tags: ['two-pointers', 'greedy'],
      statement: 'Pick two lines that, with the x-axis, hold the most water.',
      approaches: [
        {
          name: 'Move the shorter line',
          time: 'O(n)',
          space: 'O(1)',
          idea: 'Area is limited by the shorter line; moving the taller one can only shrink width without raising the limit.',
          code: `
            function maxArea(height) {
              let l = 0, r = height.length - 1, best = 0;
              while (l < r) {
                best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
                if (height[l] < height[r]) l++;
                else r--;
              }
              return best;
            }
          `,
        },
      ],
      fn: 'maxArea',
      tests: [
        { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
        { args: [[1, 1]], expected: 1 },
      ],
    },
    {
      id: 'remove-duplicates-sorted',
      title: 'Remove Duplicates from Sorted Array',
      difficulty: 'Easy',
      lc: 'remove-duplicates-from-sorted-array',
      tags: ['fast-slow'],
      statement: 'Remove duplicates in place; return the count `k` of unique elements (first k slots hold them).',
      approaches: [
        {
          name: 'Slow writer, fast reader',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function removeDuplicates(nums) {
              if (!nums.length) return 0;
              let k = 1;
              for (let i = 1; i < nums.length; i++) if (nums[i] !== nums[k - 1]) nums[k++] = nums[i];
              return k;
            }
          `,
        },
      ],
      fn: 'removeDuplicates',
      output: (k, _H, args) => args[0].slice(0, k),
      tests: [
        { args: [[1, 1, 2]], expected: [1, 2] },
        { args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: [0, 1, 2, 3, 4] },
      ],
    },
    {
      id: 'min-size-subarray-sum',
      title: 'Minimum Size Subarray Sum',
      difficulty: 'Medium',
      lc: 'minimum-size-subarray-sum',
      tags: ['sliding-window'],
      statement: 'Smallest length of a contiguous subarray of positive integers with sum ≥ target (0 if none).',
      approaches: [
        {
          name: 'Variable window',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function minSubArrayLen(target, nums) {
              let l = 0, sum = 0, best = Infinity;
              for (let r = 0; r < nums.length; r++) {
                sum += nums[r];
                while (sum >= target) {
                  best = Math.min(best, r - l + 1);
                  sum -= nums[l++];
                }
              }
              return best === Infinity ? 0 : best;
            }
          `,
        },
      ],
      fn: 'minSubArrayLen',
      tests: [
        { args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
        { args: [4, [1, 4, 4]], expected: 1 },
        { args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
      ],
    },
    {
      id: 'minimum-window-substring',
      title: 'Minimum Window Substring',
      difficulty: 'Hard',
      lc: 'minimum-window-substring',
      tags: ['sliding-window', 'hash-map'],
      statement: 'Return the smallest substring of `s` containing every character of `t` (with multiplicity), or `""`.',
      approaches: [
        {
          name: 'Window with “missing” counter',
          time: 'O(|s| + |t|)',
          space: 'O(charset)',
          idea: '`need[c]` = how many more of c the window needs; `missing` = total still needed. Expand until missing = 0, then shrink while still valid.',
          code: `
            function minWindow(s, t) {
              const need = new Map();
              for (const c of t) need.set(c, (need.get(c) || 0) + 1);
              let missing = t.length, l = 0, bestL = 0, bestLen = Infinity;
              for (let r = 0; r < s.length; r++) {
                if (need.has(s[r])) {
                  if (need.get(s[r]) > 0) missing--;
                  need.set(s[r], need.get(s[r]) - 1);
                }
                while (missing === 0) {
                  if (r - l + 1 < bestLen) { bestLen = r - l + 1; bestL = l; }
                  if (need.has(s[l])) {
                    need.set(s[l], need.get(s[l]) + 1);
                    if (need.get(s[l]) > 0) missing++;
                  }
                  l++;
                }
              }
              return bestLen === Infinity ? '' : s.slice(bestL, bestL + bestLen);
            }
          `,
        },
      ],
      fn: 'minWindow',
      tests: [
        { args: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
        { args: ['a', 'a'], expected: 'a' },
        { args: ['a', 'aa'], expected: '' },
      ],
    },
    {
      id: 'sliding-window-maximum',
      title: 'Sliding Window Maximum',
      difficulty: 'Hard',
      lc: 'sliding-window-maximum',
      tags: ['monotonic-deque'],
      statement: 'Return the max of every window of size `k`.',
      approaches: [
        {
          name: 'Monotonic deque of indices',
          time: 'O(n)',
          space: 'O(k)',
          idea: 'Deque holds indices with decreasing values. Pop smaller values from the back before pushing; drop the front when it leaves the window.',
          code: `
            function maxSlidingWindow(nums, k) {
              const dq = [], out = [];
              let head = 0; // index into dq — avoids O(n) shift()
              for (let i = 0; i < nums.length; i++) {
                while (dq.length > head && nums[dq[dq.length - 1]] <= nums[i]) dq.pop();
                dq.push(i);
                if (dq[head] <= i - k) head++;
                if (i >= k - 1) out.push(nums[dq[head]]);
              }
              return out;
            }
          `,
        },
      ],
      fn: 'maxSlidingWindow',
      tests: [
        { args: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
        { args: [[1], 1], expected: [1] },
        { args: [[9, 8, 7, 6], 2], expected: [9, 8, 7] },
      ],
    },
  ],
};
