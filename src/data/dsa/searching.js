export default {
  id: 'searching',
  title: 'Searching & Binary Search',
  icon: '🔍',
  source: 'notes',
  lecture: 'Lec 6 (Searching 1 & 2)',
  blurb: 'Classic binary search, first/last occurrence, rotated arrays, and binary search on the answer.',
  concepts: `
    - **Binary search** needs a **monotonic** predicate, not necessarily a sorted array. Recurrence \`T(n) = T(n/2) + c\` ⇒ **O(log n)**.
    - Compute \`mid = lo + ((hi - lo) >> 1)\` — avoids overflow in Java/C++ and stays an integer in JS.
    - **Templates**
      - Exact match: \`while (lo <= hi)\`, move to \`mid ± 1\`.
      - Lower bound (first index with \`a[i] ≥ x\`): \`while (lo < hi)\`, \`hi = mid\` or \`lo = mid + 1\`.
      - Last occurrence: \`mid = lo + ((hi - lo + 1) >> 1)\` (round **up**) with \`lo = mid\` — otherwise an infinite loop (your instructor's notes show this).
    - **Rotated sorted array:** at least one half \`[lo..mid]\` or \`[mid..hi]\` is always sorted — decide which and whether the target lies in it.
    - **Binary search on the answer** (Aggressive Cows, Koko, Split Array): the answer space is \`[lo, hi]\` and \`feasible(x)\` is monotonic. Search for the boundary; each check is O(n) ⇒ O(n log range).
    - Why not ternary search? Worst case \`4·log₃n ≈ 2.52·log₂n\` comparisons vs \`2·log₂n\` for binary — more work, not less.
  `,
  questions: [
    {
      id: 'binary-search',
      title: 'Binary Search',
      difficulty: 'Easy',
      lc: 'binary-search',
      from: 'Lec 6 – Searching 1',
      tags: ['binary-search'],
      statement: 'Given a sorted array and a target, return its index or -1.',
      approaches: [
        {
          name: 'Iterative',
          time: 'O(log n)',
          space: 'O(1)',
          code: `
            function search(nums, target) {
              let lo = 0, hi = nums.length - 1;
              while (lo <= hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (nums[mid] === target) return mid;
                if (nums[mid] < target) lo = mid + 1;
                else hi = mid - 1;
              }
              return -1;
            }
          `,
        },
        {
          name: 'Recursive',
          time: 'O(log n)',
          space: 'O(log n) stack',
          code: `
            function search(nums, target, lo = 0, hi = nums.length - 1) {
              if (lo > hi) return -1;
              const mid = lo + ((hi - lo) >> 1);
              if (nums[mid] === target) return mid;
              return nums[mid] < target ? search(nums, target, mid + 1, hi) : search(nums, target, lo, mid - 1);
            }
          `,
        },
      ],
      explanation: 'Note the bug in the whiteboard version from class: `while (low < high)` with `mid ± 1` misses the case where the target sits at the final `low === high` index. Use `<=` for the exact-match template.',
      fn: 'search',
      tests: [
        { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
        { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
        { args: [[5], 5], expected: 0 },
      ],
    },
    {
      id: 'first-last-position',
      title: 'Find First and Last Position of Element in Sorted Array',
      difficulty: 'Medium',
      lc: 'find-first-and-last-position-of-element-in-sorted-array',
      from: 'Lec 6 – Searching 1',
      tags: ['binary-search', 'lower-bound'],
      statement: 'Return `[first, last]` index of `target` in a sorted array, or `[-1, -1]`, in O(log n).\n\n**Example:** `[5,7,7,8,8,10], 8` → `[3,4]`',
      approaches: [
        {
          name: 'Linear scan from both ends',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function searchRange(nums, target) {
              return [nums.indexOf(target), nums.lastIndexOf(target)];
            }
          `,
        },
        {
          name: 'Two binary searches',
          time: 'O(log n)',
          space: 'O(1)',
          idea: 'When `nums[mid] === target`, record it and **keep searching** left (for first) or right (for last).',
          code: `
            function searchRange(nums, target) {
              const find = (goLeft) => {
                let lo = 0, hi = nums.length - 1, ans = -1;
                while (lo <= hi) {
                  const mid = lo + ((hi - lo) >> 1);
                  if (nums[mid] === target) {
                    ans = mid;
                    if (goLeft) hi = mid - 1;
                    else lo = mid + 1;
                  } else if (nums[mid] < target) lo = mid + 1;
                  else hi = mid - 1;
                }
                return ans;
              };
              return [find(true), find(false)];
            }
          `,
        },
      ],
      explanation: 'Count of target in a sorted array = `last − first + 1` — a common follow-up.',
      fn: 'searchRange',
      tests: [
        { args: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
        { args: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
        { args: [[], 0], expected: [-1, -1] },
        { args: [[1, 1, 1, 1, 1], 1], expected: [0, 4] },
      ],
    },
    {
      id: 'min-rotated-sorted',
      title: 'Find Minimum in Rotated Sorted Array',
      difficulty: 'Medium',
      lc: 'find-minimum-in-rotated-sorted-array',
      from: 'Lec 6 – Instructor notes',
      tags: ['binary-search', 'rotated'],
      statement: 'A sorted array of unique values was rotated. Find the minimum in O(log n). **Example:** `[4,5,6,7,0,1,2]` → `0`',
      approaches: [
        {
          name: 'Compare mid with hi',
          time: 'O(log n)',
          space: 'O(1)',
          idea: 'If `nums[mid] > nums[hi]`, the drop (minimum) is to the right of mid; otherwise mid could be the min, so `hi = mid`.',
          code: `
            function findMin(nums) {
              let lo = 0, hi = nums.length - 1;
              while (lo < hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (nums[mid] > nums[hi]) lo = mid + 1;
                else hi = mid;
              }
              return nums[lo];
            }
          `,
        },
      ],
      explanation: 'Comparing with `hi` (not `lo`) avoids the special case where the array is not rotated at all.',
      fn: 'findMin',
      tests: [
        { args: [[3, 4, 5, 1, 2]], expected: 1 },
        { args: [[4, 5, 6, 7, 0, 1, 2]], expected: 0 },
        { args: [[11, 13, 15, 17]], expected: 11 },
        { args: [[2, 1]], expected: 1 },
      ],
    },
    {
      id: 'search-rotated-sorted',
      title: 'Search in Rotated Sorted Array',
      difficulty: 'Medium',
      lc: 'search-in-rotated-sorted-array',
      tags: ['binary-search', 'rotated'],
      statement: 'Return the index of `target` in a rotated sorted array of unique values, or -1, in O(log n).',
      approaches: [
        {
          name: 'Find the sorted half',
          time: 'O(log n)',
          space: 'O(1)',
          idea: 'One of `[lo..mid]` / `[mid..hi]` is sorted. If target lies within the sorted half’s range, go there; otherwise go to the other half.',
          code: `
            function search(nums, target) {
              let lo = 0, hi = nums.length - 1;
              while (lo <= hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (nums[mid] === target) return mid;
                if (nums[lo] <= nums[mid]) {
                  if (nums[lo] <= target && target < nums[mid]) hi = mid - 1;
                  else lo = mid + 1;
                } else {
                  if (nums[mid] < target && target <= nums[hi]) lo = mid + 1;
                  else hi = mid - 1;
                }
              }
              return -1;
            }
          `,
        },
      ],
      fn: 'search',
      tests: [
        { args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
        { args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
        { args: [[1], 0], expected: -1 },
        { args: [[3, 1], 1], expected: 1 },
      ],
    },
    {
      id: 'aggressive-cows',
      title: 'Aggressive Cows',
      difficulty: 'Hard',
      lc: 'https://www.geeksforgeeks.org/problems/aggressive-cows/1',
      from: 'Lec 6 – Searching 2',
      tags: ['binary-search-on-answer'],
      statement: 'Place `k` cows in `stalls` so the **minimum** distance between any two cows is as **large** as possible. Return that distance.\n\n**Example:** `stalls = [1,2,4,8,9], k = 3` → `3`',
      approaches: [
        {
          name: 'Try every distance',
          time: 'O(n log n + n · range)',
          space: 'O(1)',
          idea: 'Sort, then for d = 1, 2, … greedily place cows; stop at the first d that fails.',
          code: `
            function aggressiveCows(stalls, k) {
              stalls = [...stalls].sort((a, b) => a - b);
              const canPlace = (d) => {
                let placed = 1, last = stalls[0];
                for (let i = 1; i < stalls.length; i++)
                  if (stalls[i] - last >= d) { placed++; last = stalls[i]; }
                return placed >= k;
              };
              let ans = 0;
              for (let d = 1; d <= stalls[stalls.length - 1] - stalls[0]; d++) {
                if (canPlace(d)) ans = d;
                else break;
              }
              return ans;
            }
          `,
        },
        {
          name: 'Binary search on the answer',
          time: 'O(n log n + n log range)',
          space: 'O(1)',
          idea: 'If distance d is feasible, every smaller d is too (monotonic). Binary search the largest feasible d in `[1, max − min]`.',
          code: `
            function aggressiveCows(stalls, k) {
              stalls = [...stalls].sort((a, b) => a - b);
              const canPlace = (d) => {
                let placed = 1, last = stalls[0];
                for (let i = 1; i < stalls.length; i++) {
                  if (stalls[i] - last >= d) {
                    placed++;
                    last = stalls[i];
                    if (placed >= k) return true;
                  }
                }
                return placed >= k;
              };
              let lo = 1, hi = stalls[stalls.length - 1] - stalls[0], ans = 0;
              while (lo <= hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (canPlace(mid)) { ans = mid; lo = mid + 1; }
                else hi = mid - 1;
              }
              return ans;
            }
          `,
        },
      ],
      explanation: `
        **Recognise the pattern:** “maximise the minimum” or “minimise the maximum” + a greedy feasibility check ⇒
        binary search on the answer. Siblings: Book Allocation / Split Array Largest Sum, Koko Eating Bananas,
        Capacity to Ship Packages, Magnetic Force Between Two Balls (LC 1552 — literally this problem).
      `,
      fn: 'aggressiveCows',
      tests: [
        { args: [[1, 2, 4, 8, 9], 3], expected: 3 },
        { args: [[10, 1, 2, 7, 5], 3], expected: 4 },
        { args: [[2, 12, 11, 3, 26, 7], 5], expected: 1 },
      ],
    },
    {
      id: 'koko-bananas',
      title: 'Koko Eating Bananas',
      difficulty: 'Medium',
      lc: 'koko-eating-bananas',
      tags: ['binary-search-on-answer'],
      statement: 'Koko eats at speed `k` bananas/hour (one pile per hour max). Find the minimum `k` to finish all `piles` within `h` hours.',
      approaches: [
        {
          name: 'Binary search on speed',
          time: 'O(n log max)',
          space: 'O(1)',
          idea: 'Hours needed at speed k = Σ ⌈pile / k⌉ — decreasing in k. Find the smallest k with hours ≤ h.',
          code: `
            function minEatingSpeed(piles, h) {
              let lo = 1, hi = Math.max(...piles);
              while (lo < hi) {
                const k = lo + ((hi - lo) >> 1);
                let hours = 0;
                for (const p of piles) hours += Math.ceil(p / k);
                if (hours <= h) hi = k;
                else lo = k + 1;
              }
              return lo;
            }
          `,
        },
      ],
      fn: 'minEatingSpeed',
      tests: [
        { args: [[3, 6, 7, 11], 8], expected: 4 },
        { args: [[30, 11, 23, 4, 20], 5], expected: 30 },
        { args: [[30, 11, 23, 4, 20], 6], expected: 23 },
      ],
    },
    {
      id: 'split-array-largest-sum',
      title: 'Split Array Largest Sum / Book Allocation',
      difficulty: 'Hard',
      lc: 'split-array-largest-sum',
      tags: ['binary-search-on-answer', 'greedy'],
      statement: 'Split `nums` into `k` non-empty contiguous subarrays minimising the largest subarray sum. Return that sum.',
      approaches: [
        {
          name: 'Binary search on max sum',
          time: 'O(n log Σ)',
          space: 'O(1)',
          idea: 'Answer lies in `[max(nums), sum(nums)]`. For a cap `c`, greedily cut when the running sum would exceed c; feasible if pieces ≤ k.',
          code: `
            function splitArray(nums, k) {
              let lo = Math.max(...nums), hi = nums.reduce((a, b) => a + b, 0);
              const pieces = (cap) => {
                let count = 1, run = 0;
                for (const x of nums) {
                  if (run + x > cap) { count++; run = 0; }
                  run += x;
                }
                return count;
              };
              while (lo < hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (pieces(mid) <= k) hi = mid;
                else lo = mid + 1;
              }
              return lo;
            }
          `,
        },
      ],
      fn: 'splitArray',
      tests: [
        { args: [[7, 2, 5, 10, 8], 2], expected: 18 },
        { args: [[1, 2, 3, 4, 5], 2], expected: 9 },
        { args: [[1, 4, 4], 3], expected: 4 },
      ],
    },
    {
      id: 'sqrt-x',
      title: 'Sqrt(x)',
      difficulty: 'Easy',
      lc: 'sqrtx',
      tags: ['binary-search'],
      statement: 'Return ⌊√x⌋ without using `Math.sqrt` or `**`.',
      approaches: [
        {
          name: 'Binary search (last mid with mid² ≤ x)',
          time: 'O(log x)',
          space: 'O(1)',
          code: `
            function mySqrt(x) {
              let lo = 0, hi = x;
              while (lo < hi) {
                const mid = lo + Math.floor((hi - lo + 1) / 2); // round up
                if (mid * mid <= x) lo = mid;
                else hi = mid - 1;
              }
              return lo;
            }
          `,
        },
      ],
      explanation: 'This is the “last occurrence” template — round mid **up** because we assign `lo = mid`.',
      fn: 'mySqrt',
      tests: [
        { args: [4], expected: 2 },
        { args: [8], expected: 2 },
        { args: [0], expected: 0 },
        { args: [2147395599], expected: 46339 },
      ],
    },
    {
      id: 'peak-element',
      title: 'Find Peak Element',
      difficulty: 'Medium',
      lc: 'find-peak-element',
      tags: ['binary-search'],
      statement: 'Return the index of any element strictly greater than its neighbours (`nums[-1] = nums[n] = −∞`).',
      approaches: [
        {
          name: 'Walk uphill',
          time: 'O(log n)',
          space: 'O(1)',
          idea: 'If `nums[mid] < nums[mid + 1]` a peak must exist to the right (we are climbing); otherwise one exists at mid or to the left.',
          code: `
            function findPeakElement(nums) {
              let lo = 0, hi = nums.length - 1;
              while (lo < hi) {
                const mid = lo + ((hi - lo) >> 1);
                if (nums[mid] < nums[mid + 1]) lo = mid + 1;
                else hi = mid;
              }
              return lo;
            }
          `,
        },
      ],
      explanation: 'Binary search without a sorted array — the monotonic predicate is “is there a peak in this half”.',
      fn: 'findPeakElement',
      check: (got, [nums]) => {
        const at = (i) => (i < 0 || i >= nums.length ? -Infinity : nums[i]);
        return nums[got] > at(got - 1) && nums[got] > at(got + 1);
      },
      tests: [{ args: [[1, 2, 3, 1]] }, { args: [[1, 2, 1, 3, 5, 6, 4]] }, { args: [[1]] }],
    },
  ],
};
