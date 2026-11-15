import { dedent } from '../../lib/dedent.js';

// JS has no built-in heap — every solution here includes a compact MinHeap you can reuse in interviews.
const MIN_HEAP = `
  class MinHeap {
    constructor(cmp = (a, b) => a - b) { this.a = []; this.cmp = cmp; }
    get size() { return this.a.length; }
    peek() { return this.a[0]; }
    push(x) {
      const a = this.a;
      a.push(x);
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (this.cmp(a[i], a[p]) >= 0) break;
        [a[i], a[p]] = [a[p], a[i]];
        i = p;
      }
    }
    pop() {
      const a = this.a, top = a[0], last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        while (true) {
          const l = 2 * i + 1, r = l + 1;
          let m = i;
          if (l < a.length && this.cmp(a[l], a[m]) < 0) m = l;
          if (r < a.length && this.cmp(a[r], a[m]) < 0) m = r;
          if (m === i) break;
          [a[i], a[m]] = [a[m], a[i]];
          i = m;
        }
      }
      return top;
    }
  }
`;

const withHeap = (code) => dedent(MIN_HEAP) + '\n\n' + dedent(code);

export default {
  id: 'heaps',
  title: 'Heaps & Priority Queues',
  icon: '⛰️',
  source: 'curriculum',
  blurb: 'Binary heap implementation, top-k, k-way merge, two-heaps median.',
  concepts: `
    - A **binary heap** is a complete tree stored in an array: children of i are \`2i+1\`, \`2i+2\`; parent is \`(i−1) >> 1\`.
    - push / pop = **O(log n)**, peek = O(1), **heapify an array = O(n)**.
    - JS has **no built-in priority queue** — be ready to write the ~30-line \`MinHeap\` below from memory (or ask if you may assume one).
    - **Top-k largest** → min-heap of size k (pop when size > k) ⇒ O(n log k).
    - **K-way merge** → heap of the current head of each list.
    - **Running median** → max-heap for the lower half + min-heap for the upper half, sizes differ by ≤ 1.
    - **Scheduling / Dijkstra** → heap keyed by time / distance.
  `,
  questions: [
    {
      id: 'kth-largest-heap',
      title: 'Kth Largest Element (min-heap of size k)',
      difficulty: 'Medium',
      lc: 'kth-largest-element-in-an-array',
      tags: ['heap', 'top-k'],
      statement: 'Return the k-th largest element using a heap.',
      approaches: [
        {
          name: 'Min-heap of size k',
          time: 'O(n log k)',
          space: 'O(k)',
          idea: 'Keep the k largest seen so far; the root is the smallest of them = the answer.',
          code: withHeap(`
            function findKthLargest(nums, k) {
              const h = new MinHeap();
              for (const x of nums) {
                h.push(x);
                if (h.size > k) h.pop();
              }
              return h.peek();
            }
          `),
        },
      ],
      fn: 'findKthLargest',
      tests: [
        { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
        { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      ],
    },
    {
      id: 'merge-k-sorted-lists',
      title: 'Merge k Sorted Lists',
      difficulty: 'Hard',
      lc: 'merge-k-sorted-lists',
      tags: ['heap', 'k-way-merge', 'linked-list'],
      statement: 'Merge k sorted linked lists into one sorted list.',
      approaches: [
        {
          name: 'Heap of list heads',
          time: 'O(N log k)',
          space: 'O(k)',
          code: withHeap(`
            function mergeKLists(lists) {
              const h = new MinHeap((a, b) => a.val - b.val);
              for (const l of lists) if (l) h.push(l);
              const dummy = new ListNode();
              let tail = dummy;
              while (h.size) {
                const node = h.pop();
                tail = tail.next = node;
                if (node.next) h.push(node.next);
              }
              return dummy.next;
            }
          `),
        },
        {
          name: 'Divide & conquer pairwise merge',
          time: 'O(N log k)',
          space: 'O(log k)',
          idea: 'Merge lists in pairs (like merge sort) — no heap needed.',
          code: `
            function mergeKLists(lists) {
              const merge2 = (a, b) => {
                const d = new ListNode();
                let t = d;
                while (a && b) {
                  if (a.val <= b.val) { t.next = a; a = a.next; } else { t.next = b; b = b.next; }
                  t = t.next;
                }
                t.next = a || b;
                return d.next;
              };
              if (!lists.length) return null;
              for (let step = 1; step < lists.length; step *= 2)
                for (let i = 0; i + step < lists.length; i += 2 * step) lists[i] = merge2(lists[i], lists[i + step]);
              return lists[0];
            }
          `,
        },
      ],
      fn: 'mergeKLists',
      input: ([ls], H) => [ls.map((l) => H.list(l))],
      output: (r, H) => H.arr(r),
      tests: [
        { args: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
        { args: [[]], expected: [] },
        { args: [[[]]], expected: [] },
      ],
    },
    {
      id: 'find-median-stream',
      title: 'Find Median from Data Stream',
      difficulty: 'Hard',
      lc: 'find-median-from-data-stream',
      tags: ['two-heaps', 'design'],
      statement: 'Support `addNum(num)` and `findMedian()` efficiently.',
      approaches: [
        {
          name: 'Two heaps',
          time: 'O(log n) add, O(1) median',
          space: 'O(n)',
          idea: '`low` is a max-heap (store negatives / custom cmp) of the smaller half, `high` a min-heap of the larger half. Push to low, move low’s max to high, rebalance so `low.size ≥ high.size`.',
          code: withHeap(`
            class MedianFinder {
              constructor() {
                this.low = new MinHeap((a, b) => b - a); // max-heap
                this.high = new MinHeap();
              }
              addNum(num) {
                this.low.push(num);
                this.high.push(this.low.pop());
                if (this.high.size > this.low.size) this.low.push(this.high.pop());
              }
              findMedian() {
                return this.low.size > this.high.size ? this.low.peek() : (this.low.peek() + this.high.peek()) / 2;
              }
            }
          `),
        },
      ],
      kind: 'class',
      fn: 'MedianFinder',
      tests: [
        { ops: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'], args: [[], [1], [2], [], [3], []], expected: [null, null, null, 1.5, null, 2] },
      ],
    },
    {
      id: 'k-closest-points',
      title: 'K Closest Points to Origin',
      difficulty: 'Medium',
      lc: 'k-closest-points-to-origin',
      tags: ['heap', 'top-k'],
      statement: 'Return the k points closest to (0, 0).',
      approaches: [
        {
          name: 'Max-heap of size k by distance',
          time: 'O(n log k)',
          space: 'O(k)',
          code: withHeap(`
            function kClosest(points, k) {
              const d = ([x, y]) => x * x + y * y;
              const h = new MinHeap((a, b) => d(b) - d(a)); // max-heap on distance
              for (const p of points) {
                h.push(p);
                if (h.size > k) h.pop();
              }
              return h.a;
            }
          `),
        },
      ],
      fn: 'kClosest',
      compare: 'unordered',
      tests: [
        { args: [[[1, 3], [-2, 2]], 1], expected: [[-2, 2]] },
        { args: [[[3, 3], [5, -1], [-2, 4]], 2], expected: [[3, 3], [-2, 4]] },
      ],
    },
    {
      id: 'task-scheduler',
      title: 'Task Scheduler',
      difficulty: 'Medium',
      lc: 'task-scheduler',
      tags: ['greedy', 'counting'],
      statement: 'Each task takes 1 unit; identical tasks need `n` idle units between them. Minimum total time?',
      approaches: [
        {
          name: 'Counting formula',
          time: 'O(N)',
          space: 'O(26)',
          idea: 'The most frequent task (count f) forms `f − 1` frames of size `n + 1` plus the number of tasks tied at f. Answer is `max(tasks.length, that)`.',
          code: `
            function leastInterval(tasks, n) {
              const cnt = new Array(26).fill(0);
              for (const t of tasks) cnt[t.charCodeAt(0) - 65]++;
              const f = Math.max(...cnt);
              const tied = cnt.filter((c) => c === f).length;
              return Math.max(tasks.length, (f - 1) * (n + 1) + tied);
            }
          `,
        },
      ],
      explanation: 'A simulation with a max-heap + cooldown queue also works and generalises better if the follow-up asks for the actual order.',
      fn: 'leastInterval',
      tests: [
        { args: [['A', 'A', 'A', 'B', 'B', 'B'], 2], expected: 8 },
        { args: [['A', 'C', 'A', 'B', 'D', 'B'], 1], expected: 6 },
        { args: [['A', 'A', 'A', 'B', 'B', 'B'], 3], expected: 10 },
      ],
    },
  ],
};
