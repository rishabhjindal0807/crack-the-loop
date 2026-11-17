// New problems from Lec 13 (Stacks & Queues), IL8 (Stacks & Queues) and Lec 14 (Linked List 1 & 2).

const list = (a, H) => [H.list(a[0]), ...a.slice(1)];
const toArr = (r, H) => H.arr(r);

export const stackExtra = [
  {
    id: 'stack-using-array',
    title: 'Implement a Stack using an Array',
    difficulty: 'Easy',
    from: 'Lec 13 – Stacks & Queues',
    tags: ['design', 'stack'],
    statement: 'Implement a fixed-capacity stack with `push`, `pop`, `peek`, `isEmpty`, `isFull`. Overflow/underflow return `false` / `-1`.',
    approaches: [
      {
        name: 'Array + top index',
        time: 'O(1) per op',
        space: 'O(capacity)',
        idea: '`top = -1` initially. push → `arr[++top] = x` (check overflow), pop → `arr[top--]` (check underflow).',
        code: `
          class ArrayStack {
            constructor(capacity) { this.arr = new Array(capacity); this.top = -1; }
            push(x) {
              if (this.isFull()) return false;     // overflow
              this.arr[++this.top] = x;
              return true;
            }
            pop() {
              if (this.isEmpty()) return -1;       // underflow
              return this.arr[this.top--];
            }
            peek() { return this.isEmpty() ? -1 : this.arr[this.top]; }
            isEmpty() { return this.top === -1; }
            isFull() { return this.top === this.arr.length - 1; }
          }
        `,
      },
    ],
    explanation: 'The call stack itself is the classic example (Foo → Bar → Baz in the notes): last function called is the first to return. Other uses: undo, browser back, DFS, expression parsing.',
    kind: 'class',
    fn: 'ArrayStack',
    tests: [
      {
        ops: ['ArrayStack', 'push', 'push', 'push', 'push', 'peek', 'pop', 'pop', 'pop', 'pop', 'isEmpty'],
        args: [[3], [1], [2], [3], [4], [], [], [], [], [], []],
        expected: [null, true, true, true, false, 3, 3, 2, 1, -1, true],
      },
    ],
  },
  {
    id: 'stack-using-queues',
    title: 'Implement Stack using Queues',
    difficulty: 'Easy',
    lc: 'implement-stack-using-queues',
    from: 'Lec 13 – Stacks & Queues',
    tags: ['design', 'queue'],
    statement: 'Implement a LIFO stack using only queue operations (enqueue at back, dequeue from front).',
    approaches: [
      {
        name: 'Single queue, rotate on push',
        time: 'push O(n), pop O(1)',
        space: 'O(n)',
        idea: 'After enqueuing x, dequeue/enqueue the previous `size − 1` elements so x ends up at the front.',
        code: `
          class MyStack {
            constructor() { this.q = []; }
            push(x) {
              this.q.push(x);
              for (let i = 0; i < this.q.length - 1; i++) this.q.push(this.q.shift());
            }
            pop() { return this.q.shift(); }
            top() { return this.q[0]; }
            empty() { return this.q.length === 0; }
          }
        `,
      },
    ],
    kind: 'class',
    fn: 'MyStack',
    tests: [
      { ops: ['MyStack', 'push', 'push', 'top', 'pop', 'empty'], args: [[], [1], [2], [], [], []], expected: [null, null, null, 2, 2, false] },
    ],
  },
  {
    id: 'design-circular-queue',
    title: 'Design Circular Queue',
    difficulty: 'Medium',
    lc: 'design-circular-queue',
    from: 'IL8 – Stacks & Queues (+ Lec 13 queue using array)',
    tags: ['design', 'queue', 'circular-buffer'],
    statement: 'Implement a fixed-size circular queue: `enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty`, `isFull`.',
    approaches: [
      {
        name: 'Array + front/rear/size with modulo',
        time: 'O(1) per op',
        space: 'O(k)',
        idea: 'A plain array queue wastes the slots before `front`. Wrap indices with `% capacity`; track `size` to tell empty from full. Rear index = `(rear − 1 + capacity) % capacity`.',
        code: `
          class MyCircularQueue {
            constructor(k) { this.q = new Array(k); this.cap = k; this.front = 0; this.rear = 0; this.size = 0; }
            enQueue(v) {
              if (this.isFull()) return false;
              this.q[this.rear] = v;
              this.rear = (this.rear + 1) % this.cap;
              this.size++;
              return true;
            }
            deQueue() {
              if (this.isEmpty()) return false;
              this.front = (this.front + 1) % this.cap;
              this.size--;
              return true;
            }
            Front() { return this.isEmpty() ? -1 : this.q[this.front]; }
            Rear() { return this.isEmpty() ? -1 : this.q[(this.rear - 1 + this.cap) % this.cap]; }
            isEmpty() { return this.size === 0; }
            isFull() { return this.size === this.cap; }
          }
        `,
      },
    ],
    kind: 'class',
    fn: 'MyCircularQueue',
    tests: [
      {
        ops: ['MyCircularQueue', 'enQueue', 'enQueue', 'enQueue', 'enQueue', 'Rear', 'isFull', 'deQueue', 'enQueue', 'Rear'],
        args: [[3], [1], [2], [3], [4], [], [], [], [4], []],
        expected: [null, true, true, true, false, 3, true, true, true, 4],
      },
    ],
  },
  {
    id: 'nearest-smaller-left',
    title: 'Nearest Smaller Element on the Left',
    difficulty: 'Medium',
    lc: 'https://www.geeksforgeeks.org/problems/smallest-number-on-left3403/1',
    from: 'Lec 13 – Stacks (Bosscoder notes)',
    tags: ['monotonic-stack'],
    statement: 'For each element, return the nearest element to its **left** that is smaller, or −1.\n\n**Example:** `[1,6,2]` → `[-1,1,1]`',
    approaches: [
      {
        name: 'Scan left for each element',
        time: 'O(n²)',
        space: 'O(1) extra',
        code: `
          function leftSmaller(a) {
            return a.map((x, i) => {
              for (let j = i - 1; j >= 0; j--) if (a[j] < x) return a[j];
              return -1;
            });
          }
        `,
      },
      {
        name: 'Increasing stack',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'Pop everything ≥ x (it can never be the answer for anything to the right of x). The new top is x’s answer; then push x.',
        code: `
          function leftSmaller(a) {
            const st = [], out = [];
            for (const x of a) {
              while (st.length && st[st.length - 1] >= x) st.pop();
              out.push(st.length ? st[st.length - 1] : -1);
              st.push(x);
            }
            return out;
          }
        `,
      },
    ],
    fn: 'leftSmaller',
    tests: [
      { args: [[1, 6, 2]], expected: [-1, 1, 1] },
      { args: [[1, 5, 0, 3, 4, 5]], expected: [-1, 1, -1, 0, 3, 4] },
    ],
  },
  {
    id: 'next-smaller-element',
    title: 'Next Smaller Element (to the right)',
    difficulty: 'Medium',
    from: 'Lec 13 – Stacks (Bosscoder notes)',
    tags: ['monotonic-stack'],
    statement: 'For each element, return the first smaller element to its **right**, or −1.\n\n**Example:** `[4,8,5,2,25]` → `[2,5,2,-1,-1]`',
    approaches: [
      {
        name: 'Scan right for each element',
        time: 'O(n²)',
        space: 'O(1) extra',
        code: `
          function nextSmaller(a) {
            return a.map((x, i) => {
              for (let j = i + 1; j < a.length; j++) if (a[j] < x) return a[j];
              return -1;
            });
          }
        `,
      },
      {
        name: 'Stack from the right',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function nextSmaller(a) {
            const st = [], out = new Array(a.length);
            for (let i = a.length - 1; i >= 0; i--) {
              while (st.length && st[st.length - 1] >= a[i]) st.pop();
              out[i] = st.length ? st[st.length - 1] : -1;
              st.push(a[i]);
            }
            return out;
          }
        `,
      },
    ],
    explanation: 'Four variants — next/previous × greater/smaller — are the same template; only the scan direction and the comparison flip.',
    fn: 'nextSmaller',
    tests: [
      { args: [[4, 8, 5, 2, 25]], expected: [2, 5, 2, -1, -1] },
      { args: [[13, 7, 6, 12]], expected: [7, 6, -1, -1] },
    ],
  },
  {
    id: 'next-greater-element-i',
    title: 'Next Greater Element I',
    difficulty: 'Easy',
    lc: 'next-greater-element-i',
    from: 'IL8 – Stacks & Queues',
    tags: ['monotonic-stack', 'hash-map'],
    statement: '`nums1` is a subset of `nums2`. For each x in nums1, return the first greater element to the right of x **in nums2**, or −1.',
    approaches: [
      {
        name: 'Monotonic stack over nums2 + map',
        time: 'O(n + m)',
        space: 'O(m)',
        idea: 'Walk nums2 keeping a decreasing stack. When x is larger than the top, x is the next greater of everything it pops — record in a map. Then answer nums1 by lookup (the instructor’s code).',
        code: `
          function nextGreaterElement(nums1, nums2) {
            const next = new Map(), st = [];
            for (const x of nums2) {
              while (st.length && x > st[st.length - 1]) next.set(st.pop(), x);
              st.push(x);
            }
            return nums1.map((x) => next.get(x) ?? -1);
          }
        `,
      },
    ],
    fn: 'nextGreaterElement',
    tests: [
      { args: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1] },
      { args: [[2, 4], [1, 2, 3, 4]], expected: [3, -1] },
    ],
  },
  {
    id: 'next-greater-element-ii',
    title: 'Next Greater Element II (circular array)',
    difficulty: 'Medium',
    lc: 'next-greater-element-ii',
    from: 'IL8 – homework',
    tags: ['monotonic-stack', 'circular'],
    statement: 'Circular array: for each element return the next greater element (wrapping around), or −1.',
    approaches: [
      {
        name: 'Two passes with indices',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'Iterate `i` over `0..2n−1` using `i % n` — the second pass lets elements near the end see elements at the start.',
        code: `
          function nextGreaterElements(nums) {
            const n = nums.length, ans = new Array(n).fill(-1), st = [];
            for (let i = 0; i < 2 * n; i++) {
              const x = nums[i % n];
              while (st.length && nums[st[st.length - 1]] < x) ans[st.pop()] = x;
              if (i < n) st.push(i);
            }
            return ans;
          }
        `,
      },
    ],
    fn: 'nextGreaterElements',
    tests: [
      { args: [[1, 2, 1]], expected: [2, -1, 2] },
      { args: [[1, 2, 3, 4, 3]], expected: [2, 3, 4, -1, 4] },
    ],
  },
  {
    id: 'min-add-valid-parentheses',
    title: 'Minimum Add to Make Parentheses Valid',
    difficulty: 'Medium',
    lc: 'minimum-add-to-make-parentheses-valid',
    from: 'IL8 – Stacks & Queues',
    tags: ['stack', 'counting'],
    statement: 'Return the minimum number of `(` or `)` insertions to make the string valid.\n\n**Example:** `"())"` → `1`, `"((("` → `3`',
    approaches: [
      {
        name: 'Stack',
        time: 'O(n)',
        space: 'O(n)',
        idea: 'Push `(`. On `)`, pop if possible, else it needs a partner (count++). Leftover `(` on the stack each need a `)`.',
        code: `
          function minAddToMakeValid(s) {
            const st = [];
            let count = 0;
            for (const ch of s) {
              if (ch === '(') st.push(ch);
              else if (st.length) st.pop();
              else count++;
            }
            return count + st.length;
          }
        `,
      },
      {
        name: 'Two counters (O(1) space)',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'The stack only ever holds `(`, so replace it with a counter `open`.',
        code: `
          function minAddToMakeValid(s) {
            let open = 0, add = 0;
            for (const ch of s) {
              if (ch === '(') open++;
              else if (open) open--;
              else add++;
            }
            return open + add;
          }
        `,
      },
    ],
    fn: 'minAddToMakeValid',
    tests: [
      { args: ['())'], expected: 1 },
      { args: ['((('], expected: 3 },
      { args: ['()))(('], expected: 4 },
      { args: ['()'], expected: 0 },
    ],
  },
  {
    id: 'maximal-rectangle',
    title: 'Maximal Rectangle (binary matrix)',
    difficulty: 'Hard',
    lc: 'maximal-rectangle',
    from: 'Lec 13 – Stacks (Bosscoder notes)',
    tags: ['monotonic-stack', 'matrix'],
    statement: 'Largest rectangle containing only `"1"`s in a binary matrix.',
    approaches: [
      {
        name: 'Histogram per row + largest rectangle',
        time: 'O(rows · cols)',
        space: 'O(cols)',
        idea: 'Treat each row as the floor of a histogram: `h[j]` = consecutive 1s ending at this row. Run “Largest Rectangle in Histogram” on every row.',
        code: `
          function maximalRectangle(matrix) {
            if (!matrix.length) return 0;
            const n = matrix[0].length, h = new Array(n).fill(0);
            const largest = (heights) => {
              const st = [];
              let best = 0;
              for (let i = 0; i <= heights.length; i++) {
                const cur = i === heights.length ? 0 : heights[i];
                while (st.length && heights[st[st.length - 1]] >= cur) {
                  const height = heights[st.pop()];
                  const left = st.length ? st[st.length - 1] : -1;
                  best = Math.max(best, height * (i - left - 1));
                }
                st.push(i);
              }
              return best;
            };
            let best = 0;
            for (const row of matrix) {
              for (let j = 0; j < n; j++) h[j] = row[j] === '1' ? h[j] + 1 : 0;
              best = Math.max(best, largest(h));
            }
            return best;
          }
        `,
      },
    ],
    fn: 'maximalRectangle',
    tests: [
      { args: [[['1', '0', '1', '0', '0'], ['1', '0', '1', '1', '1'], ['1', '1', '1', '1', '1'], ['1', '0', '0', '1', '0']]], expected: 6 },
      { args: [[['0']]], expected: 0 },
      { args: [[['1']]], expected: 1 },
    ],
  },
];

export const linkedListExtra = [
  {
    id: 'middle-of-linked-list',
    title: 'Middle of the Linked List',
    difficulty: 'Easy',
    lc: 'middle-of-the-linked-list',
    from: 'Lec 14 – Linked List 1 & 2',
    tags: ['fast-slow'],
    statement: 'Return the middle node (the second middle if the length is even). Tests return the list from the middle onwards.',
    approaches: [
      {
        name: 'Count, then walk n/2',
        time: 'O(n) — two traversals',
        space: 'O(1)',
        code: `
          function middleNode(head) {
            let n = 0;
            for (let p = head; p; p = p.next) n++;
            let mid = head;
            for (let i = 0; i < Math.floor(n / 2); i++) mid = mid.next;
            return mid;
          }
        `,
      },
      {
        name: 'Tortoise & hare',
        time: 'O(n) — one traversal',
        space: 'O(1)',
        idea: '`fast` moves 2 steps for every 1 step of `slow`; when fast falls off the end, slow is in the middle.',
        code: `
          function middleNode(head) {
            let slow = head, fast = head;
            while (fast && fast.next) {
              slow = slow.next;
              fast = fast.next.next;
            }
            return slow;
          }
        `,
      },
    ],
    fn: 'middleNode',
    input: list,
    output: toArr,
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [3, 4, 5] },
      { args: [[1, 2, 3, 4, 5, 6]], expected: [4, 5, 6] },
      { args: [[1]], expected: [1] },
    ],
  },
  {
    id: 'n-by-k-th-node',
    title: 'Find the (n/k)-th Node in a Linked List',
    difficulty: 'Easy',
    from: 'Lec 14 – Linked List (Bosscoder notes)',
    tags: ['linked-list'],
    statement: 'Given a list of length n and k, return the value of the `⌈n/k⌉`-th node (1-indexed), in one pass without knowing n.\n\n**Example:** `1→2→3→4→5→6→7, k = 3` → `3` (⌈7/3⌉ = 3)',
    approaches: [
      {
        name: 'Advance a second pointer every k nodes',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Walk with index i (1-based). Each time `i % k === 1` (start of a new block of k), move the answer pointer forward once. After n nodes it has moved ⌈n/k⌉ times.',
        code: `
          function nByKthNode(head, k) {
            let ans = null, i = 0;
            for (let p = head; p; p = p.next) {
              i++;
              if (i % k === 1 || k === 1) ans = ans ? ans.next : head;
            }
            return ans ? ans.val : -1;
          }
        `,
      },
    ],
    fn: 'nByKthNode',
    input: list,
    tests: [
      { args: [[1, 2, 3, 4, 5, 6, 7], 3], expected: 3 },
      { args: [[1, 2, 3, 4, 5], 2], expected: 3 },
      { args: [[1, 2, 3], 1], expected: 3 },
    ],
  },
  {
    id: 'linked-list-cycle-i',
    title: 'Linked List Cycle (detect)',
    difficulty: 'Easy',
    lc: 'linked-list-cycle',
    from: 'Lec 14 – Linked List 1 & 2',
    tags: ['fast-slow', 'hashing'],
    statement: 'Return true if the list has a cycle. (Test input: values + `pos` that the tail links back to, −1 for none.)',
    approaches: [
      {
        name: 'Hash set of visited nodes',
        time: 'O(n)',
        space: 'O(n)',
        code: `
          function hasCycle(head) {
            const seen = new Set();
            for (let p = head; p; p = p.next) {
              if (seen.has(p)) return true;
              seen.add(p);
            }
            return false;
          }
        `,
      },
      {
        name: 'Slow & fast pointers',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'Inside a cycle the fast pointer gains one node per step on the slow one, so they must meet.',
        code: `
          function hasCycle(head) {
            let slow = head, fast = head;
            while (fast && fast.next) {
              slow = slow.next;
              fast = fast.next.next;
              if (slow === fast) return true;
            }
            return false;
          }
        `,
      },
    ],
    fn: 'hasCycle',
    input: ([vals, pos], H) => {
      const head = H.list(vals);
      const nodes = [];
      for (let n = head; n; n = n.next) nodes.push(n);
      if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
      return [head];
    },
    tests: [
      { args: [[3, 2, 0, -4], 1], expected: true },
      { args: [[1, 2], 0], expected: true },
      { args: [[1], -1], expected: false },
    ],
  },
  {
    id: 'add-two-numbers',
    title: 'Add Two Numbers (digits in reverse)',
    difficulty: 'Medium',
    lc: 'add-two-numbers',
    from: 'Lec 14 – Linked List 1 & 2',
    tags: ['dummy-node', 'carry'],
    statement: 'Two non-negative numbers are stored as lists of digits in reverse order. Return their sum as a list.\n\n**Example:** `2→4→3 + 5→6→4` → `7→0→8` (342 + 465 = 807)',
    approaches: [
      {
        name: 'Dummy head + carry',
        time: 'O(max(n, m))',
        space: 'O(1) extra',
        idea: 'Loop while either list or the carry remains: `sum = carry + digits`, node = `sum % 10`, carry = `⌊sum / 10⌋`.',
        code: `
          function addTwoNumbers(l1, l2) {
            const dummy = new ListNode();
            let tail = dummy, carry = 0;
            while (l1 || l2 || carry) {
              let sum = carry;
              if (l1) { sum += l1.val; l1 = l1.next; }
              if (l2) { sum += l2.val; l2 = l2.next; }
              carry = Math.floor(sum / 10);
              tail = tail.next = new ListNode(sum % 10);
            }
            return dummy.next;
          }
        `,
      },
    ],
    fn: 'addTwoNumbers',
    input: (a, H) => [H.list(a[0]), H.list(a[1])],
    output: toArr,
    tests: [
      { args: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
      { args: [[9, 9, 9, 9], [9, 9]], expected: [8, 9, 0, 0, 1] },
      { args: [[0], [0]], expected: [0] },
    ],
  },
  {
    id: 'remove-linked-list-elements',
    title: 'Remove Linked List Elements',
    difficulty: 'Easy',
    lc: 'remove-linked-list-elements',
    from: 'Lec 14 – Linked List 1 & 2',
    tags: ['dummy-node'],
    statement: 'Remove every node whose value equals `val`.',
    approaches: [
      {
        name: 'Dummy node',
        time: 'O(n)',
        space: 'O(1)',
        idea: 'A dummy before head means removing the head is not a special case. Only advance `curr` when you did **not** delete (the next node may also match).',
        code: `
          function removeElements(head, val) {
            const dummy = new ListNode(-1, head);
            let curr = dummy;
            while (curr.next) {
              if (curr.next.val === val) curr.next = curr.next.next;
              else curr = curr.next;
            }
            return dummy.next;
          }
        `,
      },
    ],
    fn: 'removeElements',
    input: list,
    output: toArr,
    tests: [
      { args: [[1, 2, 6, 3, 4, 5, 6], 6], expected: [1, 2, 3, 4, 5] },
      { args: [[7, 7, 7, 7], 7], expected: [] },
    ],
  },
  {
    id: 'remove-duplicates-sorted-list',
    title: 'Remove Duplicates from Sorted List',
    difficulty: 'Easy',
    lc: 'remove-duplicates-from-sorted-list',
    from: 'Lec 14 – homework (83)',
    tags: ['linked-list'],
    statement: 'Delete duplicates so each value appears once.',
    approaches: [
      {
        name: 'Skip equal neighbours',
        time: 'O(n)',
        space: 'O(1)',
        code: `
          function deleteDuplicates(head) {
            let curr = head;
            while (curr && curr.next) {
              if (curr.val === curr.next.val) curr.next = curr.next.next;
              else curr = curr.next;
            }
            return head;
          }
        `,
      },
    ],
    fn: 'deleteDuplicates',
    input: list,
    output: toArr,
    tests: [
      { args: [[1, 1, 2]], expected: [1, 2] },
      { args: [[1, 1, 2, 3, 3]], expected: [1, 2, 3] },
    ],
  },
  {
    id: 'palindrome-linked-list',
    title: 'Palindrome Linked List',
    difficulty: 'Easy',
    lc: 'palindrome-linked-list',
    from: 'Lec 14 – homework (234)',
    tags: ['fast-slow', 'reversal'],
    statement: 'Return true if the list reads the same both ways, in O(1) extra space.',
    approaches: [
      {
        name: 'Middle + reverse second half + compare',
        time: 'O(n)',
        space: 'O(1)',
        code: `
          function isPalindrome(head) {
            let slow = head, fast = head;
            while (fast && fast.next) { slow = slow.next; fast = fast.next.next; }
            let prev = null;
            while (slow) { const nx = slow.next; slow.next = prev; prev = slow; slow = nx; }
            for (let a = head, b = prev; b; a = a.next, b = b.next) if (a.val !== b.val) return false;
            return true;
          }
        `,
      },
    ],
    explanation: 'Mention that this mutates the list; restore it by reversing the second half again if the caller needs the original.',
    fn: 'isPalindrome',
    input: list,
    tests: [
      { args: [[1, 2, 2, 1]], expected: true },
      { args: [[1, 2]], expected: false },
      { args: [[1, 2, 3, 2, 1]], expected: true },
    ],
  },
  {
    id: 'intersection-of-two-lists',
    title: 'Intersection of Two Linked Lists',
    difficulty: 'Easy',
    lc: 'intersection-of-two-linked-lists',
    from: 'Lec 14 – homework (160)',
    tags: ['two-pointers'],
    statement: 'Return the node where two lists merge, or null. (Tests: `[listA prefix, listB prefix, shared tail]`; we return the shared node’s value or null.)',
    approaches: [
      {
        name: 'Switch heads',
        time: 'O(n + m)',
        space: 'O(1)',
        idea: 'Walk A then B, and B then A. Both pointers travel `a + b + c` steps, so they arrive at the intersection together (or both hit null).',
        code: `
          function getIntersectionNode(headA, headB) {
            let p = headA, q = headB;
            while (p !== q) {
              p = p ? p.next : headB;
              q = q ? q.next : headA;
            }
            return p;
          }
        `,
      },
    ],
    fn: 'getIntersectionNode',
    input: ([a, b, shared], H) => {
      const tail = H.list(shared);
      const attach = (vals) => {
        if (!vals.length) return tail;
        const head = H.list(vals);
        let p = head;
        while (p.next) p = p.next;
        p.next = tail;
        return head;
      };
      return [attach(a), attach(b)];
    },
    output: (r) => (r ? r.val : null),
    tests: [
      { args: [[4, 1], [5, 6, 1], [8, 4, 5]], expected: 8 },
      { args: [[2, 6, 4], [1, 5], []], expected: null },
    ],
  },
];
