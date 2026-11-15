export default {
  id: 'sorting',
  title: 'Sorting',
  icon: '📶',
  source: 'notes',
  lecture: 'Lec 9 (Sorting 1 & 2)',
  blurb: 'Selection, bubble, insertion, counting, merge and quick sort — plus inversion count, kth largest and nuts & bolts.',
  concepts: `
    | Algorithm | Best | Avg | Worst | Space | Stable | Notes |
    |---|---|---|---|---|---|---|
    | Selection | n² | n² | n² | 1 | ✗ | Fewest swaps (n − 1) |
    | Bubble | n | n² | n² | 1 | ✓ | Early exit if no swaps in a pass |
    | Insertion | n | n² | n² | 1 | ✓ | Great for nearly sorted / small arrays |
    | Counting | n + k | n + k | n + k | k | ✓ | Small integer range k |
    | Merge | n log n | n log n | n log n | n | ✓ | Linked lists, external sort, inversion count |
    | Quick | n log n | n log n | n² | log n | ✗ | In-place, cache friendly; randomise pivot |
    | Heap | n log n | n log n | n log n | 1 | ✗ | Guaranteed n log n in place |

    - Properties to compare (instructor notes): **stability** (equal elements keep relative order), **in-place**, **online** (can sort as data arrives — insertion sort), **adaptive** (faster on nearly-sorted input — insertion/bubble).
    - **Bucket / radix / counting** sorts trade memory for speed on a *limited range* of keys.
    - **Comparison sorts can't beat Ω(n log n)** (decision-tree argument). Counting/radix sort beat it by not comparing.
    - **JS \`Array.prototype.sort\`** sorts as **strings** by default — always pass \`(a, b) => a - b\` for numbers. V8 uses TimSort (stable since 2019).
    - **Quick sort vs merge sort:** quick sort is in place and has better cache behaviour; merge sort is stable and has a guaranteed bound.
    - **Partition** (Lomuto: last element pivot; Hoare: two pointers) is reusable on its own: quickselect, Dutch national flag, nuts & bolts.
  `,
  questions: [
    {
      id: 'elementary-sorts',
      title: 'Selection, Bubble & Insertion Sort',
      difficulty: 'Easy',
      lc: 'sort-an-array',
      from: 'Lec 9 – Sorting 1',
      tags: ['sorting'],
      statement: 'Implement the three O(n²) sorts. (LeetCode 912 will TLE on these — it needs merge/heap sort.)',
      approaches: [
        {
          name: 'Selection sort',
          time: 'O(n²)',
          space: 'O(1)',
          idea: 'Find the minimum of the unsorted suffix and swap it into position i.',
          code: `
            function sortArray(a) {
              for (let i = 0; i < a.length - 1; i++) {
                let min = i;
                for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
                [a[i], a[min]] = [a[min], a[i]];
              }
              return a;
            }
          `,
        },
        {
          name: 'Bubble sort',
          time: 'O(n²), O(n) if sorted',
          space: 'O(1)',
          idea: 'Swap adjacent out-of-order pairs; the largest bubbles to the end each pass. Stop when a pass makes no swaps.',
          code: `
            function sortArray(a) {
              for (let i = 0; i < a.length - 1; i++) {
                let swapped = false;
                for (let j = 0; j < a.length - 1 - i; j++) {
                  if (a[j] > a[j + 1]) {
                    [a[j], a[j + 1]] = [a[j + 1], a[j]];
                    swapped = true;
                  }
                }
                if (!swapped) break;
              }
              return a;
            }
          `,
        },
        {
          name: 'Insertion sort',
          time: 'O(n²), O(n) if sorted',
          space: 'O(1)',
          idea: 'Grow a sorted prefix; shift bigger elements right and drop the key into its slot.',
          code: `
            function sortArray(a) {
              for (let i = 1; i < a.length; i++) {
                const key = a[i];
                let j = i - 1;
                while (j >= 0 && a[j] > key) {
                  a[j + 1] = a[j];
                  j--;
                }
                a[j + 1] = key;
              }
              return a;
            }
          `,
        },
      ],
      fn: 'sortArray',
      tests: [
        { args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
        { args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
        { args: [[]], expected: [] },
      ],
    },
    {
      id: 'counting-sort',
      title: 'Counting Sort',
      difficulty: 'Easy',
      from: 'Lec 9 – Sorting 1',
      tags: ['sorting', 'counting'],
      statement: 'Sort non-negative integers with a small maximum value in O(n + k).',
      approaches: [
        {
          name: 'Stable counting sort',
          time: 'O(n + k)',
          space: 'O(n + k)',
          idea: 'Count each value → prefix-sum the counts (= final positions) → walk the input **backwards** to place items stably.',
          code: `
            function countingSort(arr) {
              if (arr.length === 0) return [];
              const k = Math.max(...arr);
              const count = new Array(k + 1).fill(0);
              for (const x of arr) count[x]++;
              for (let v = 1; v <= k; v++) count[v] += count[v - 1];
              const out = new Array(arr.length);
              for (let i = arr.length - 1; i >= 0; i--) out[--count[arr[i]]] = arr[i];
              return out;
            }
          `,
        },
      ],
      explanation: 'The cumulative-count step is what makes it stable — and stability is what lets radix sort use counting sort per digit.',
      fn: 'countingSort',
      tests: [
        { args: [[4, 2, 2, 8, 3, 3, 1]], expected: [1, 2, 2, 3, 3, 4, 8] },
        { args: [[0]], expected: [0] },
      ],
    },
    {
      id: 'bucket-sort',
      title: 'Bucket Sort',
      difficulty: 'Medium',
      from: 'Lec 9 – Sorting 1',
      tags: ['sorting', 'distribution-sort'],
      statement: 'Sort floating-point numbers uniformly distributed in `[0, 1)`.\n\n**Example:** `[0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]` → sorted',
      approaches: [
        {
          name: 'n buckets + insertion sort each',
          time: 'O(n + k) average, O(n²) worst',
          space: 'O(n + k)',
          idea: 'Put x into bucket `⌊n·x⌋`, sort each (small) bucket with insertion sort, then concatenate. Uniform input ⇒ ~1 element per bucket.',
          code: `
            function bucketSort(arr) {
              const n = arr.length;
              if (n === 0) return [];
              const buckets = Array.from({ length: n }, () => []);
              for (const x of arr) buckets[Math.min(n - 1, Math.floor(n * x))].push(x);
              for (const b of buckets) {
                for (let i = 1; i < b.length; i++) {
                  const key = b[i];
                  let j = i - 1;
                  while (j >= 0 && b[j] > key) { b[j + 1] = b[j]; j--; }
                  b[j + 1] = key;
                }
              }
              return buckets.flat();
            }
          `,
        },
      ],
      explanation: 'Worst case is when everything lands in one bucket (skewed data) — then it degrades to insertion sort. For integers spread over a range, use `(x − min) / (max − min + 1) * n` as the bucket index.',
      fn: 'bucketSort',
      tests: [
        { args: [[0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.51]], expected: [0.23, 0.25, 0.32, 0.42, 0.47, 0.51, 0.52] },
        { args: [[0.9, 0.1, 0.5]], expected: [0.1, 0.5, 0.9] },
        { args: [[]], expected: [] },
      ],
    },
    {
      id: 'radix-heap-sort',
      title: 'Radix Sort & Heap Sort',
      difficulty: 'Medium',
      from: 'Lec 9 – Instructor notes (algorithm list)',
      tags: ['sorting', 'radix', 'heap'],
      statement: 'Sort non-negative integers with radix sort, and any numbers with heap sort.',
      approaches: [
        {
          name: 'LSD radix sort',
          time: 'O(d · (n + 10))',
          space: 'O(n)',
          idea: 'Stable counting sort on each decimal digit, least significant first. Stability is what keeps earlier digit orderings intact.',
          code: `
            function sortArray(arr) {
              let a = [...arr];
              const max = Math.max(0, ...a);
              for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
                const count = new Array(10).fill(0), out = new Array(a.length);
                for (const x of a) count[Math.floor(x / exp) % 10]++;
                for (let d = 1; d < 10; d++) count[d] += count[d - 1];
                for (let i = a.length - 1; i >= 0; i--) out[--count[Math.floor(a[i] / exp) % 10]] = a[i];
                a = out;
              }
              return a;
            }
          `,
        },
        {
          name: 'Heap sort (in place)',
          time: 'O(n log n)',
          space: 'O(1)',
          idea: 'Build a max-heap bottom-up in O(n), then repeatedly swap the root (max) to the end and sift down the shrunken heap.',
          code: `
            function sortArray(a) {
              const n = a.length;
              const sift = (i, size) => {
                while (true) {
                  const l = 2 * i + 1, r = l + 1;
                  let m = i;
                  if (l < size && a[l] > a[m]) m = l;
                  if (r < size && a[r] > a[m]) m = r;
                  if (m === i) return;
                  [a[i], a[m]] = [a[m], a[i]];
                  i = m;
                }
              };
              for (let i = (n >> 1) - 1; i >= 0; i--) sift(i, n);
              for (let end = n - 1; end > 0; end--) {
                [a[0], a[end]] = [a[end], a[0]];
                sift(0, end);
              }
              return a;
            }
          `,
        },
      ],
      fn: 'sortArray',
      tests: [
        { args: [[170, 45, 75, 90, 802, 24, 2, 66]], expected: [2, 24, 45, 66, 75, 90, 170, 802] },
        { args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
      ],
    },
    {
      id: 'merge-sort',
      title: 'Merge Sort',
      difficulty: 'Medium',
      lc: 'sort-an-array',
      from: 'Lec 9 – Sorting 2',
      tags: ['sorting', 'divide-and-conquer'],
      statement: 'Sort an array in O(n log n) using merge sort.',
      approaches: [
        {
          name: 'Top-down merge sort',
          time: 'O(n log n)',
          space: 'O(n)',
          idea: 'Split in halves, sort each recursively, merge two sorted halves with two pointers. `T(n) = 2T(n/2) + n`.',
          code: `
            function sortArray(nums) {
              const tmp = new Array(nums.length);
              const sort = (lo, hi) => {
                if (lo >= hi) return;
                const mid = (lo + hi) >> 1;
                sort(lo, mid);
                sort(mid + 1, hi);
                let i = lo, j = mid + 1, k = lo;
                while (i <= mid && j <= hi) tmp[k++] = nums[i] <= nums[j] ? nums[i++] : nums[j++];
                while (i <= mid) tmp[k++] = nums[i++];
                while (j <= hi) tmp[k++] = nums[j++];
                for (let t = lo; t <= hi; t++) nums[t] = tmp[t];
              };
              sort(0, nums.length - 1);
              return nums;
            }
          `,
        },
      ],
      explanation: 'Using `<=` when merging keeps equal elements in original order — that is why merge sort is stable.',
      fn: 'sortArray',
      tests: [
        { args: [[5, 2, 3, 1]], expected: [1, 2, 3, 5] },
        { args: [[5, 1, 1, 2, 0, 0]], expected: [0, 0, 1, 1, 2, 5] },
        { args: [[-3, 10, -1, 7, 7, 0]], expected: [-3, -1, 0, 7, 7, 10] },
      ],
    },
    {
      id: 'inversion-count',
      title: 'Inversion Count',
      difficulty: 'Hard',
      lc: 'https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1',
      from: 'Lec 9 – Sorting 2',
      tags: ['merge-sort', 'divide-and-conquer'],
      statement: 'Count pairs `(i, j)` with `i < j` and `a[i] > a[j]`.\n\n**Example:** `[2,4,1,3,5]` → `3` ((2,1), (4,1), (4,3))',
      approaches: [
        {
          name: 'Check every pair',
          time: 'O(n²)',
          space: 'O(1)',
          code: `
            function inversionCount(a) {
              let count = 0;
              for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] > a[j]) count++;
              return count;
            }
          `,
        },
        {
          name: 'Count during merge',
          time: 'O(n log n)',
          space: 'O(n)',
          idea: 'While merging, when the right element `a[j]` is taken before left element `a[i]`, it is smaller than **all** remaining left elements: add `mid − i + 1`.',
          code: `
            function inversionCount(input) {
              const a = [...input], tmp = new Array(a.length);
              const sort = (lo, hi) => {
                if (lo >= hi) return 0;
                const mid = (lo + hi) >> 1;
                let count = sort(lo, mid) + sort(mid + 1, hi);
                let i = lo, j = mid + 1, k = lo;
                while (i <= mid && j <= hi) {
                  if (a[i] <= a[j]) tmp[k++] = a[i++];
                  else {
                    count += mid - i + 1;
                    tmp[k++] = a[j++];
                  }
                }
                while (i <= mid) tmp[k++] = a[i++];
                while (j <= hi) tmp[k++] = a[j++];
                for (let t = lo; t <= hi; t++) a[t] = tmp[t];
                return count;
              };
              return sort(0, a.length - 1);
            }
          `,
        },
      ],
      explanation: 'Inversion count measures “how unsorted” an array is — it equals the number of swaps bubble sort performs.',
      fn: 'inversionCount',
      tests: [
        { args: [[2, 4, 1, 3, 5]], expected: 3 },
        { args: [[2, 3, 4, 5, 6]], expected: 0 },
        { args: [[10, 10, 10]], expected: 0 },
        { args: [[5, 4, 3, 2, 1]], expected: 10 },
      ],
    },
    {
      id: 'quick-sort',
      title: 'Quick Sort (Lomuto partition)',
      difficulty: 'Medium',
      from: 'Lec 9 – Sorting 2',
      tags: ['sorting', 'partition'],
      statement: 'Implement quick sort using the last element as pivot.',
      approaches: [
        {
          name: 'Lomuto partition',
          time: 'O(n log n) avg, O(n²) worst',
          space: 'O(log n) stack',
          idea: '`i` marks the end of the “≤ pivot” region. Scan j; when `a[j] < pivot`, grow the region by swapping. Finally put the pivot at `i + 1`.',
          code: `
            function quickSort(a) {
              const partition = (lo, hi) => {
                const pivot = a[hi];
                let i = lo - 1;
                for (let j = lo; j < hi; j++) {
                  if (a[j] < pivot) {
                    i++;
                    [a[i], a[j]] = [a[j], a[i]];
                  }
                }
                [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
                return i + 1;
              };
              const sort = (lo, hi) => {
                if (lo >= hi) return;
                const p = partition(lo, hi);
                sort(lo, p - 1);
                sort(p + 1, hi);
              };
              sort(0, a.length - 1);
              return a;
            }
          `,
        },
      ],
      explanation: 'Worst case O(n²) happens on already-sorted input with a fixed last-element pivot. Fix: pick a **random** pivot and swap it to the end first.',
      fn: 'quickSort',
      tests: [
        { args: [[10, 80, 30, 90, 40, 50, 70]], expected: [10, 30, 40, 50, 70, 80, 90] },
        { args: [[3, 3, 1, 2, 1]], expected: [1, 1, 2, 3, 3] },
      ],
    },
    {
      id: 'kth-largest',
      title: 'Kth Largest Element in an Array',
      difficulty: 'Medium',
      lc: 'kth-largest-element-in-an-array',
      from: 'Lec 9 – Sorting 1',
      tags: ['quickselect', 'heap'],
      statement: 'Return the k-th largest element (in sorted order, not distinct).',
      approaches: [
        {
          name: 'Sort',
          time: 'O(n log n)',
          space: 'O(1)',
          code: `
            function findKthLargest(nums, k) {
              return [...nums].sort((a, b) => b - a)[k - 1];
            }
          `,
        },
        {
          name: 'Quickselect (3-way, random pivot)',
          time: 'O(n) average',
          space: 'O(1)',
          idea: 'Partition around a random pivot into > / = / <. Recurse only into the side containing rank k.',
          code: `
            function findKthLargest(nums, k) {
              let arr = nums;
              while (true) {
                const pivot = arr[Math.floor(Math.random() * arr.length)];
                const bigger = [], equal = [], smaller = [];
                for (const x of arr) (x > pivot ? bigger : x === pivot ? equal : smaller).push(x);
                if (k <= bigger.length) arr = bigger;
                else if (k <= bigger.length + equal.length) return pivot;
                else {
                  k -= bigger.length + equal.length;
                  arr = smaller;
                }
              }
            }
          `,
        },
      ],
      explanation: 'Also mention the **min-heap of size k** approach (O(n log k)) — better when data streams in. See the Heaps topic.',
      fn: 'findKthLargest',
      tests: [
        { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
        { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
        { args: [[1], 1], expected: 1 },
      ],
    },
    {
      id: 'max-min-within-k',
      title: 'Maximum Elements with max − min ≤ k',
      difficulty: 'Medium',
      from: 'Lec 9 – Sorting 1',
      tags: ['sorting', 'sliding-window'],
      statement: 'Choose the largest subset of the array such that `max − min ≤ k`. Return its size.',
      approaches: [
        {
          name: 'Sort + sliding window',
          time: 'O(n log n)',
          space: 'O(1)',
          idea: 'After sorting, any valid subset can be a contiguous window. Grow `r`, shrink `l` while `a[r] − a[l] > k`.',
          code: `
            function maxSubsetWithinK(nums, k) {
              const a = [...nums].sort((x, y) => x - y);
              let best = 0, l = 0;
              for (let r = 0; r < a.length; r++) {
                while (a[r] - a[l] > k) l++;
                best = Math.max(best, r - l + 1);
              }
              return best;
            }
          `,
        },
      ],
      explanation: 'The notes also show a **counting-sort** variant: if values lie in a small known range, count frequencies and slide a value-window `[v, v + k]` over the counts — O(n + range) with no comparison sort.',
      fn: 'maxSubsetWithinK',
      tests: [
        { args: [[1, 5, 6, 2, 8], 5], expected: 4 },
        { args: [[1, 2, 3, 4, 5], 0], expected: 1 },
        { args: [[4, 4, 4], 0], expected: 3 },
      ],
    },
    {
      id: 'nuts-and-bolts',
      title: 'Nuts and Bolts / Lock and Key',
      difficulty: 'Medium',
      lc: 'https://www.geeksforgeeks.org/problems/nuts-and-bolts-problem0431/1',
      from: 'Lec 9 – Sorting 2',
      tags: ['partition', 'quick-sort'],
      statement: 'Locks and keys match 1-to-1. You may only compare a lock with a key (not lock-lock or key-key). Match them efficiently. Return both arrays arranged so `locks[i]` matches `keys[i]`.',
      approaches: [
        {
          name: 'Cross-partitioning (quick sort style)',
          time: 'O(n log n) average',
          space: 'O(log n)',
          idea: 'Pick a lock as pivot → partition keys around it (find its matching key) → use that key to partition locks. Both arrays now split identically; recurse on each side.',
          code: `
            function matchLocksAndKeys(locks, keys) {
              const partition = (arr, lo, hi, pivot) => {
                let i = lo;
                for (let j = lo; j < hi; j++) {
                  if (arr[j] < pivot) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    i++;
                  } else if (arr[j] === pivot) {
                    [arr[j], arr[hi]] = [arr[hi], arr[j]];
                    j--; // re-check the element swapped in
                  }
                }
                [arr[i], arr[hi]] = [arr[hi], arr[i]];
                return i;
              };
              const go = (lo, hi) => {
                if (lo >= hi) return;
                const p = partition(keys, lo, hi, locks[hi]); // lock compares against keys
                partition(locks, lo, hi, keys[p]);            // matched key compares against locks
                go(lo, p - 1);
                go(p + 1, hi);
              };
              go(0, locks.length - 1);
              return [locks, keys];
            }
          `,
        },
      ],
      explanation: 'Here we model lock/key sizes as numbers; in an interview the comparison would be `fits(lock, key) → -1 | 0 | 1`. The key insight is that the *same* pivot can partition both sets.',
      fn: 'matchLocksAndKeys',
      check: (got) => JSON.stringify(got[0]) === JSON.stringify(got[1]),
      tests: [{ args: [[6, 3, 9, 1, 5], [9, 1, 5, 6, 3]] }, { args: [[2, 1], [1, 2]] }],
    },
    {
      id: 'sort-colors',
      title: 'Sort Colors (Dutch National Flag)',
      difficulty: 'Medium',
      lc: 'sort-colors',
      tags: ['partition', 'two-pointers'],
      statement: 'Sort an array of 0s, 1s and 2s in one pass, in place.',
      approaches: [
        {
          name: 'Three pointers',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`[0, low)` = 0s, `[low, mid)` = 1s, `(high, n)` = 2s. Don’t advance `mid` after swapping with `high` — the swapped-in value is unchecked.',
          code: `
            function sortColors(nums) {
              let low = 0, mid = 0, high = nums.length - 1;
              while (mid <= high) {
                if (nums[mid] === 0) [nums[low++], nums[mid++]] = [nums[mid], nums[low]];
                else if (nums[mid] === 1) mid++;
                else [nums[mid], nums[high--]] = [nums[high], nums[mid]];
              }
              return nums;
            }
          `,
        },
      ],
      fn: 'sortColors',
      tests: [
        { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2] },
        { args: [[2, 0, 1]], expected: [0, 1, 2] },
      ],
    },
    {
      id: 'merge-intervals',
      title: 'Merge Intervals',
      difficulty: 'Medium',
      lc: 'merge-intervals',
      tags: ['sorting', 'intervals'],
      statement: 'Merge all overlapping intervals.',
      approaches: [
        {
          name: 'Sort by start, sweep',
          time: 'O(n log n)',
          space: 'O(n)',
          code: `
            function merge(intervals) {
              const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
              const out = [];
              for (const [s, e] of sorted) {
                if (out.length && s <= out[out.length - 1][1]) out[out.length - 1][1] = Math.max(out[out.length - 1][1], e);
                else out.push([s, e]);
              }
              return out;
            }
          `,
        },
      ],
      fn: 'merge',
      tests: [
        { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
        { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
        { args: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
      ],
    },
  ],
};
