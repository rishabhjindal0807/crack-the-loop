const list = (a, H) => [H.list(a[0]), ...a.slice(1)];
const toArr = (r, H) => H.arr(r);

export default {
  id: 'linked-list',
  title: 'Linked List',
  icon: '🔗',
  source: 'curriculum',
  blurb: 'Dummy nodes, reversal, fast/slow pointers, merging and LRU cache.',
  concepts: `
    \`\`\`js
    class ListNode { constructor(val = 0, next = null) { this.val = val; this.next = next; } }
    \`\`\`
    - **Dummy head** removes edge cases when the head itself may change (merge, delete, partition).
    - **Reverse in place:** \`prev = null; while (cur) { next = cur.next; cur.next = prev; prev = cur; cur = next; }\`
    - **Fast & slow pointers:** middle node, cycle detection (Floyd), k-th from end (gap of k).
    - Draw boxes and arrows — every pointer reassignment order matters.
    - **LRU cache** = hash map + doubly linked list (or a JS \`Map\`, which preserves insertion order).
    - *In the runner, \`ListNode\` is pre-defined and tests convert arrays ↔ lists for you.*
  `,
  questions: [
    {
      id: 'reverse-linked-list',
      title: 'Reverse Linked List',
      difficulty: 'Easy',
      lc: 'reverse-linked-list',
      tags: ['reversal'],
      statement: 'Reverse a singly linked list and return the new head.',
      approaches: [
        {
          name: 'Iterative',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function reverseList(head) {
              let prev = null, cur = head;
              while (cur) {
                const next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
              }
              return prev;
            }
          `,
        },
        {
          name: 'Recursive',
          time: 'O(n)',
          space: 'O(n) stack',
          idea: 'Reverse the rest, then make the next node point back at the current one.',
          code: `
            function reverseList(head) {
              if (!head || !head.next) return head;
              const newHead = reverseList(head.next);
              head.next.next = head;
              head.next = null;
              return newHead;
            }
          `,
        },
      ],
      fn: 'reverseList',
      input: list,
      output: toArr,
      tests: [
        { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
        { args: [[]], expected: [] },
      ],
    },
    {
      id: 'merge-two-sorted-lists',
      title: 'Merge Two Sorted Lists',
      difficulty: 'Easy',
      lc: 'merge-two-sorted-lists',
      tags: ['dummy-node'],
      statement: 'Merge two sorted lists into one sorted list.',
      approaches: [
        {
          name: 'Dummy node',
          time: 'O(n + m)',
          space: 'O(1)',
          code: `
            function mergeTwoLists(a, b) {
              const dummy = new ListNode();
              let tail = dummy;
              while (a && b) {
                if (a.val <= b.val) { tail.next = a; a = a.next; }
                else { tail.next = b; b = b.next; }
                tail = tail.next;
              }
              tail.next = a || b;
              return dummy.next;
            }
          `,
        },
      ],
      fn: 'mergeTwoLists',
      input: (a, H) => [H.list(a[0]), H.list(a[1])],
      output: toArr,
      tests: [
        { args: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
        { args: [[], [0]], expected: [0] },
      ],
    },
    {
      id: 'linked-list-cycle',
      title: 'Linked List Cycle II (find cycle start)',
      difficulty: 'Medium',
      lc: 'linked-list-cycle-ii',
      tags: ['fast-slow', 'floyd'],
      statement: 'Return the node where the cycle begins, or null. (Test input: values + `pos`, the index the tail links back to; we return that node’s index.)',
      approaches: [
        {
          name: "Floyd's tortoise & hare",
          time: 'O(n)',
          space: 'O(1)',
          idea: 'After slow and fast meet, a pointer from head and one from the meeting point, moving 1 step each, meet at the cycle start (distance math: `a = c·L − b`).',
          code: `
            function detectCycle(head) {
              let slow = head, fast = head;
              while (fast && fast.next) {
                slow = slow.next;
                fast = fast.next.next;
                if (slow === fast) {
                  let p = head;
                  while (p !== slow) { p = p.next; slow = slow.next; }
                  return p;
                }
              }
              return null;
            }
          `,
        },
      ],
      fn: 'detectCycle',
      input: ([vals, pos], H) => {
        const head = H.list(vals);
        const nodes = [];
        for (let n = head; n; n = n.next) nodes.push(n);
        if (pos >= 0) nodes[nodes.length - 1].next = nodes[pos];
        return [head, nodes];
      },
      output: (r, _H, args) => (r ? args[1].indexOf(r) : -1),
      tests: [
        { args: [[3, 2, 0, -4], 1], expected: 1 },
        { args: [[1, 2], 0], expected: 0 },
        { args: [[1], -1], expected: -1 },
      ],
    },
    {
      id: 'remove-nth-from-end',
      title: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      lc: 'remove-nth-node-from-end-of-list',
      tags: ['two-pointers', 'dummy-node'],
      statement: 'Remove the n-th node from the end in one pass.',
      approaches: [
        {
          name: 'Gap of n between two pointers',
          time: 'O(L)',
          space: 'O(1)',
          code: `
            function removeNthFromEnd(head, n) {
              const dummy = new ListNode(0, head);
              let fast = dummy, slow = dummy;
              for (let i = 0; i <= n; i++) fast = fast.next;
              while (fast) { fast = fast.next; slow = slow.next; }
              slow.next = slow.next.next;
              return dummy.next;
            }
          `,
        },
      ],
      fn: 'removeNthFromEnd',
      input: list,
      output: toArr,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
        { args: [[1], 1], expected: [] },
        { args: [[1, 2], 1], expected: [1] },
      ],
    },
    {
      id: 'reorder-list',
      title: 'Reorder List (L0 → Ln → L1 → Ln−1 …)',
      difficulty: 'Medium',
      lc: 'reorder-list',
      tags: ['fast-slow', 'reversal', 'merge'],
      statement: 'Reorder in place to `L0 → Ln → L1 → Ln−1 → …`.',
      approaches: [
        {
          name: 'Middle → reverse second half → weave',
          time: 'O(n)',
          space: 'O(1)',
          idea: 'Combines three linked-list primitives — a favourite because it tests all of them at once.',
          code: `
            function reorderList(head) {
              if (!head || !head.next) return head;
              let slow = head, fast = head;
              while (fast.next && fast.next.next) { slow = slow.next; fast = fast.next.next; }
              let prev = null, cur = slow.next;
              slow.next = null;
              while (cur) { const nx = cur.next; cur.next = prev; prev = cur; cur = nx; }
              let a = head, b = prev;
              while (b) {
                const an = a.next, bn = b.next;
                a.next = b; b.next = an;
                a = an; b = bn;
              }
              return head;
            }
          `,
        },
      ],
      fn: 'reorderList',
      input: list,
      output: toArr,
      tests: [
        { args: [[1, 2, 3, 4]], expected: [1, 4, 2, 3] },
        { args: [[1, 2, 3, 4, 5]], expected: [1, 5, 2, 4, 3] },
      ],
    },
    {
      id: 'lru-cache',
      title: 'LRU Cache',
      difficulty: 'Medium',
      lc: 'lru-cache',
      tags: ['design', 'hash-map', 'doubly-linked-list'],
      statement: 'Design a cache with `get(key)` and `put(key, value)` in O(1), evicting the least recently used key when over capacity.',
      approaches: [
        {
          name: 'JS Map (insertion order)',
          time: 'O(1)',
          space: 'O(capacity)',
          idea: '`Map` iterates in insertion order, so delete + re-set moves a key to “most recent”, and `keys().next()` is the LRU.',
          code: `
            class LRUCache {
              constructor(capacity) {
                this.cap = capacity;
                this.map = new Map();
              }
              get(key) {
                if (!this.map.has(key)) return -1;
                const v = this.map.get(key);
                this.map.delete(key);
                this.map.set(key, v);
                return v;
              }
              put(key, value) {
                this.map.delete(key);
                this.map.set(key, value);
                if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
              }
            }
          `,
        },
        {
          name: 'Hash map + doubly linked list',
          time: 'O(1)',
          space: 'O(capacity)',
          idea: 'What the interviewer usually wants: sentinel head/tail nodes; move-to-front on access; evict `tail.prev`.',
          code: `
            class LRUCache {
              constructor(capacity) {
                this.cap = capacity;
                this.map = new Map();
                this.head = { prev: null, next: null };
                this.tail = { prev: this.head, next: null };
                this.head.next = this.tail;
              }
              _remove(node) {
                node.prev.next = node.next;
                node.next.prev = node.prev;
              }
              _addFront(node) {
                node.next = this.head.next;
                node.prev = this.head;
                this.head.next.prev = node;
                this.head.next = node;
              }
              get(key) {
                const node = this.map.get(key);
                if (!node) return -1;
                this._remove(node);
                this._addFront(node);
                return node.val;
              }
              put(key, val) {
                if (this.map.has(key)) this._remove(this.map.get(key));
                const node = { key, val };
                this._addFront(node);
                this.map.set(key, node);
                if (this.map.size > this.cap) {
                  const lru = this.tail.prev;
                  this._remove(lru);
                  this.map.delete(lru.key);
                }
              }
            }
          `,
        },
      ],
      explanation: 'Mention you used caching like this in production (Redis with TTL/LRU eviction) — it is a nice bridge to system design.',
      kind: 'class',
      fn: 'LRUCache',
      tests: [
        {
          ops: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
          args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
          expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
        },
      ],
    },
  ],
};
