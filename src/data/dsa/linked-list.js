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
      title: 'Linked List Cycle II',
      difficulty: 'Medium',
      lc: 'linked-list-cycle-ii',
      from: 'IL9 – Linked List (+ Lec 14 homework 142)',
      tags: ['fast-slow', 'floyd', 'cycle'],
      statement: 'Given the `head` of a linked list, return the node where the cycle begins, or `null` if there is no cycle. Do **not** modify the list.\n\nInternally `pos` is the index the tail’s `next` points back to (−1 = no cycle); it is not passed to you. *(Test input here: values + `pos`; the runner reports the index of the node you return.)*',
      visual: {
        title: 'Floyd’s algorithm on 1 → 2 → 3 → 4 → 5 → 6, tail links back to 3',
        steps: [
          { order: ['1', '2', '3', '4', '5', '6'], edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], changed: [['6', '3']], pointers: { slow: '1', fast: '1' },
            code: 'let slow = head, fast = head', caption: 'The tail (6) links back to 3 — that is the cycle start we need to find. Both pointers start at head.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], pointers: { slow: '2', fast: '3' },
            code: 'slow = slow.next; fast = fast.next.next', caption: 'Phase 1: slow moves 1 step, fast moves 2.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], pointers: { slow: '3', fast: '5' },
            code: 'slow = slow.next; fast = fast.next.next', caption: 'Both are inside the cycle now.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], changed: [['6', '3']], pointers: { slow: '4', fast: '3' },
            code: 'slow = slow.next; fast = fast.next.next', caption: 'fast went 5 → 6 → 3, round the loop, and is now chasing slow from behind.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], pointers: { slow: '5', fast: '5' },
            code: 'if (slow == fast) → they meet at 5', caption: 'Inside a loop fast gains one node per step, so it must land on slow. Meeting proves there is a cycle — but 5 is not its start.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], pointers: { ptr1: '1', ptr2: '5' },
            code: 'let ptr1 = head; let ptr2 = slow', caption: 'Phase 2: one pointer back at head, one at the meeting point.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], pointers: { ptr1: '2', ptr2: '6' },
            code: 'ptr1 = ptr1.next; ptr2 = ptr2.next', caption: 'Now both move ONE step at a time.' },
          { edges: [['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', '6'], ['6', '3']], changed: [['6', '3']], pointers: { ptr1: '3', ptr2: '3' },
            code: 'ptr1 == ptr2 → return ptr1', caption: 'They meet at 3 — the cycle start. head → 3 is 2 steps, and meeting point 5 → 6 → 3 is also 2 steps. That is always true (see the maths below).' },
        ],
      },
      approaches: [
        {
          name: 'Hash set of visited nodes',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Walk the list and remember every node object. The first node you see twice is where the cycle begins.',
          code: `
            function detectCycle(head) {
              const seen = new Set();
              for (let p = head; p; p = p.next) {
                if (seen.has(p)) return p;
                seen.add(p);
              }
              return null;
            }
          `,
        },
        {
          name: 'Your accepted solution (Floyd, LeetCode)',
          time: 'O(n)',
          space: 'O(1)',
          idea: `
            **Phase 1:** slow moves 1, fast moves 2 — if fast reaches \`null\` there is no cycle; if they meet, there is one.
            **Phase 2:** put \`ptr1\` at head and \`ptr2\` at the meeting point and move both one step at a time — they meet exactly at the cycle start.
          `,
          code: `
            var detectCycle = function (head) {
              if (head == null || head.next == null) return null;

              let slow = head, fast = head;

              while (fast != null && fast.next != null) {
                slow = slow.next;
                fast = fast.next.next;

                if (slow == fast) {
                  let ptr1 = head;
                  let ptr2 = slow;

                  while (ptr1 != ptr2) {
                    ptr1 = ptr1.next;
                    ptr2 = ptr2.next;
                  }
                  return ptr1;
                }
              }
              return null;
            };
          `,
        },
      ],
      math: {
        figure: 'floyd-cycle',
        body: `
**Notation** (see the figure)

- $a$ — steps from head to the cycle start $S$ &nbsp;(here $a = 2$)
- $L$ — number of nodes in the cycle &nbsp;(here $L = 4$)
- $b$ — steps from $S$ forward to the meeting point $M$, with $0 \\le b < L$ &nbsp;(here $b = 2$)
- $t$ — loop iterations until slow and fast meet

#### Step 1 — If there is a cycle, slow and fast must meet

After $a$ steps slow enters the cycle, and fast is already inside it. Let $g$ be how many nodes fast is *behind* slow, counted forward around the cycle, so $0 \\le g < L$.
Every iteration fast moves 2 and slow moves 1, so the gap shrinks by exactly one:

$$g \\;\\to\\; g-1 \\;\\to\\; g-2 \\;\\to\\; \\cdots \\;\\to\\; 0$$

Because it drops by 1 each time, fast can never jump over slow — they land on the same node within $g < L$ more steps.
With no cycle, fast reaches \`null\` first and we return \`null\`.

#### Step 2 — Slow has not finished a lap when they meet

Slow enters the cycle at step $a$ and they meet fewer than $L$ steps later, so slow is less than one lap past $S$:

$$\\text{slow walked:}\\qquad t = a + b, \\qquad 0 \\le b < L$$

#### Step 3 — Fast walked twice as far

Fast stands on the same node $M$, so it walked the same path plus some whole number $k \\ge 1$ of extra laps:

$$\\text{fast walked:}\\qquad 2t = a + b + kL$$

Substitute $t = a + b$:

$$2(a + b) = a + b + kL \\quad\\Longrightarrow\\quad a + b = kL$$

$$\\boxed{\\;a = kL - b = (k-1)\\,L + (L - b)\\;}$$

#### Step 4 — What the formula means

$L - b$ is the distance from $M$ forward to $S$ (the orange arc). So a pointer that starts at $M$ and walks $a$ steps first covers $L - b$ steps to reach $S$, then $(k-1)$ full laps that bring it back to $S$.
A pointer from head that walks the same $a$ steps also arrives at $S$ — so **ptr1 (from head) and ptr2 (from $M$), moving one step at a time, are both at $S$ after exactly $a$ steps.**

They can't meet any earlier: until step $a$, ptr1 is still on the tail, while ptr2 never leaves the cycle.

#### Check it on the example

| iteration $t$ | slow | fast |
|:-:|:-:|:-:|
| 0 | 1 | 1 |
| 1 | 2 | 3 |
| 2 | 3 | 5 |
| 3 | 4 | 3 |
| 4 | **5** | **5** |

They meet at $t = 4$. Slow walked $4 = a + b = 2 + 2$ ✓. Fast walked $8 = a + b + kL = 4 + k \\cdot 4$, so $k = 1$ ✓.
Then $a = kL - b = 4 - 2 = 2$: ptr1 goes $1 \\to 2 \\to 3$ and ptr2 goes $5 \\to 6 \\to 3$ — both reach 3 in 2 steps ✓.

#### Edge cases fall out of the same equation

- **Cycle starts at head** ($a = 0$): $b = kL$ with $0 \\le b < L$ forces $b = 0$ — they meet at head, and \`ptr1 == ptr2\` straight away.
- **Self-loop** ($L = 1$): again $b = 0$, so they meet on the node itself.

#### Complexity

Phase 1 runs at most $a + g < a + L \\le n$ iterations, phase 2 exactly $a \\le n$, so time is $O(n)$ and extra space is $O(1)$.

#### Why fast moves exactly 2

With speeds 2 and 1 the gap closes by 1 per step, so it can't skip past 0. With speed 3 the gap closes by 2 — if $L$ is even and $g$ is odd, fast jumps over slow forever. Speed 2 is the choice that always works, and it is what gives $a = kL - b$.

**Bonus — cycle length:** after they meet, keep one pointer at $M$ and walk the other until it returns; the number of steps is $L$.
`,
      },
      explanation: `
        **The proof** is in the *Mathematical proof* card above — in one line: \`a = kL − b\`, so head and the meeting point are the same distance from the cycle start.

        **Edge cases:** empty list or one node with no loop → \`null\` (your early return). A one-node self-loop (\`pos = 0\`) still works:
        they meet at head, and \`ptr1 == ptr2\` immediately.

        **Interview follow-ups:** *Cycle length?* After meeting, keep one pointer still and count steps until the other comes back.
        *Linked List Cycle I (LC 141)* is just phase 1. The same idea finds a duplicate in an array (LC 287 — the one you have as TLE!) by treating \`i → nums[i]\` as a linked list.
      `,
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
        { args: [[1, 2, 3, 4, 5, 6], 2], expected: 2, label: 'the example from the visual' },
        { args: [[1], 0], expected: 0, label: 'single-node self-loop' },
        { args: [[1, 2, 3], -1], expected: -1, label: 'no cycle' },
        { args: [[], -1], expected: -1, label: 'empty list' },
      ],
    },
    {
      id: 'remove-nth-from-end',
      title: 'Remove Nth Node From End of List',
      difficulty: 'Medium',
      lc: 'remove-nth-node-from-end-of-list',
      tags: ['two-pointers', 'dummy-node'],
      statement: 'Given the `head` of a linked list, remove the n-th node from the end and return its head.\n\n**Example:** `1→2→3→4→5, n = 2` → `1→2→3→5`',
      visual: {
        title: 'One pass on 1 → 2 → 3 → 4 → 5, n = 2',
        steps: [
          { order: ['D', '1', '2', '3', '4', '5', 'null'], edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', 'null']], pointers: { slow: 'D', fast: 'D' },
            code: 'slow = fast = dummy', caption: 'Both pointers start at a dummy node placed before head.' },
          { edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', 'null']], pointers: { slow: 'D', fast: '3' },
            code: 'for (i = 0; i <= n; i++) fast = fast.next', caption: 'Move fast n + 1 = 3 steps. Now exactly n = 2 nodes sit between slow and fast.' },
          { edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', 'null']], pointers: { slow: '1', fast: '4' },
            code: 'slow = slow.next; fast = fast.next', caption: 'Move both together — the gap stays the same.' },
          { edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', 'null']], pointers: { slow: '2', fast: '5' },
            code: 'slow = slow.next; fast = fast.next', caption: 'Still moving together.' },
          { edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', '5'], ['5', 'null']], pointers: { slow: '3', fast: 'null' },
            code: 'fast === null → stop', caption: 'fast fell off the end, so slow is just BEFORE the 2nd node from the end (4).' },
          { edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '5'], ['4', '5'], ['5', 'null']], changed: [['3', '5']], pointers: { slow: '3' },
            code: 'slow.next = slow.next.next', caption: '3 now skips 4. Nothing points to 4 any more, so it is out of the list.' },
          { order: ['D', '1', '2', '3', '5', 'null'], edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '5'], ['5', 'null']], pointers: {},
            code: 'return dummy.next', caption: 'Result: 1 → 2 → 3 → 5. If n were 5 (the head), slow would stop at the dummy — that is why it exists.' },
        ],
      },
      approaches: [
        {
          name: 'Two passes (count length)',
          time: 'O(L) — two traversals',
          space: 'O(1)',
          idea: 'Count the length L, then the node to delete is the (L − n + 1)-th from the start — stop at the node before it.',
          code: `
            function removeNthFromEnd(head, n) {
              let len = 0;
              for (let p = head; p; p = p.next) len++;
              const dummy = new ListNode(0, head);
              let prev = dummy;
              for (let i = 0; i < len - n; i++) prev = prev.next;
              prev.next = prev.next.next;
              return dummy.next;
            }
          `,
        },
        {
          name: 'One pass: gap of n between two pointers',
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
        {
          name: 'Your accepted solution (LeetCode)',
          time: 'O(L) — one pass',
          space: 'O(1)',
          idea: `
            Same one-pass idea, as you submitted it. Moving \`fast\` **n + 1** steps from the dummy leaves exactly n nodes between
            \`slow\` and \`fast\`; when \`fast\` falls off the end, \`slow\` sits **just before** the node to delete. The dummy node
            makes deleting the head (\`n = L\`) work without a special case.
          `,
          code: `
            var removeNthFromEnd = function (head, n) {
              let dummy = new ListNode(0);
              dummy.next = head;
              let slow = dummy;
              let fast = dummy;
              for (let i = 0; i <= n; i++) {
                fast = fast.next;
              }
              while (fast != null) {
                slow = slow.next;
                fast = fast.next;
              }
              slow.next = slow.next.next;
              return dummy.next;
            };
          `,
        },
      ],
      explanation: `
        **Interview talking points:** why the dummy node (removing the head is otherwise a special case), why \`<= n\` (n + 1 moves so
        \`slow\` stops one node *before* the target), and the follow-up “can you do it in one pass?” — which is exactly this gap trick.
        The same two-pointer gap finds the k-th node from the end.
      `,
      fn: 'removeNthFromEnd',
      input: list,
      output: toArr,
      tests: [
        { args: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
        { args: [[1], 1], expected: [] },
        { args: [[1, 2], 1], expected: [1] },
        { args: [[1, 2, 3], 3], expected: [2, 3], label: 'remove the head' },
      ],
    },
    {
      id: 'swap-nodes-in-pairs',
      title: 'Swap Nodes in Pairs',
      difficulty: 'Medium',
      lc: 'swap-nodes-in-pairs',
      from: 'IL9 – Linked List',
      tags: ['dummy-node', 'pointer-manipulation', 'recursion'],
      statement: 'Swap every two adjacent nodes and return the new head. You must change the **nodes** (their `next` pointers), not the values inside them.\n\n**Example:** `1→2→3→4` → `2→1→4→3`, `1→2→3` → `2→1→3`',
      visual: {
        title: 'Iterative swap on 1 → 2 → 3 → 4',
        steps: [
          { order: ['D', '1', '2', '3', '4', 'null'], edges: [['D', '1'], ['1', '2'], ['2', '3'], ['3', '4'], ['4', 'null']], pointers: { prev: 'D', first: '1', second: '2' },
            code: 'first = prev.next; second = first.next', caption: 'A dummy node sits before head, so the first pair has a “prev” too. Mark the pair to swap.' },
          { edges: [['D', '1'], ['1', '3'], ['2', '3'], ['3', '4'], ['4', 'null']], changed: [['1', '3']], pointers: { prev: 'D', first: '1', second: '2' },
            code: 'first.next = second.next', caption: '1 now skips over 2 and points at the rest of the list (3). Nothing is lost — 2 still points to 3.' },
          { edges: [['D', '1'], ['1', '3'], ['2', '1'], ['3', '4'], ['4', 'null']], changed: [['2', '1']], pointers: { prev: 'D', first: '1', second: '2' },
            code: 'second.next = first', caption: '2 points back to 1 — the pair is reversed internally.' },
          { edges: [['D', '2'], ['2', '1'], ['1', '3'], ['3', '4'], ['4', 'null']], changed: [['D', '2']], pointers: { prev: 'D', first: '1', second: '2' },
            code: 'prev.next = second', caption: 'Reconnect the pair to what came before it: dummy → 2.' },
          { order: ['D', '2', '1', '3', '4', 'null'], edges: [['D', '2'], ['2', '1'], ['1', '3'], ['3', '4'], ['4', 'null']], pointers: { prev: '1', first: '3', second: '4' },
            code: 'prev = first', caption: 'Redrawn in list order: dummy → 2 → 1 → 3 → 4. Node 1 is now the tail of the swapped pair, so it becomes prev for the next pair (3, 4).' },
          { edges: [['D', '2'], ['2', '1'], ['1', '3'], ['3', 'null'], ['4', 'null']], changed: [['3', 'null']], pointers: { prev: '1', first: '3', second: '4' },
            code: 'first.next = second.next', caption: '3 skips over 4 (here the rest is null).' },
          { edges: [['D', '2'], ['2', '1'], ['1', '3'], ['3', 'null'], ['4', '3']], changed: [['4', '3']], pointers: { prev: '1', first: '3', second: '4' },
            code: 'second.next = first', caption: '4 points back to 3.' },
          { edges: [['D', '2'], ['2', '1'], ['1', '4'], ['4', '3'], ['3', 'null']], changed: [['1', '4']], pointers: { prev: '1', first: '3', second: '4' },
            code: 'prev.next = second', caption: 'Connect the previous pair (ending at 1) to the new front of this pair (4).' },
          { order: ['D', '2', '1', '4', '3', 'null'], edges: [['D', '2'], ['2', '1'], ['1', '4'], ['4', '3'], ['3', 'null']], pointers: { prev: '3' },
            code: 'prev = first → prev.next === null, loop ends', caption: 'Fewer than two nodes left, so stop. Return dummy.next → 2 → 1 → 4 → 3.' },
        ],
      },
      approaches: [
        {
          name: 'Recursive',
          time: 'O(n)',
          space: 'O(n) stack',
          idea: 'Swap the first two nodes, and let recursion swap the rest: `first.next = swapPairs(second.next)`, then `second.next = first`; `second` is the new head.',
          code: `
            function swapPairs(head) {
              if (!head || !head.next) return head;
              const first = head, second = head.next;
              first.next = swapPairs(second.next);
              second.next = first;
              return second;
            }
          `,
        },
        {
          name: 'Your accepted solution (iterative, LeetCode)',
          time: 'O(n)',
          space: 'O(1)',
          idea: `
            Walk pair by pair with \`prev\` pointing at the node **before** the pair. Three pointer writes swap it —
            \`first.next = second.next\`, \`second.next = first\`, \`prev.next = second\` — then \`prev = first\`
            (the old first is now the pair's tail). Step through the visual above to watch each write.
          `,
          code: `
            var swapPairs = function (head) {
              let dummy = new ListNode(0);
              let prev = dummy;
              let first, second;

              prev.next = head;
              while (prev.next != null && prev.next.next != null) {
                first = prev.next;
                second = first.next;

                first.next = second.next;
                second.next = first;
                prev.next = second;
                prev = first;
              }
              return dummy.next;
            };
          `,
        },
      ],
      explanation: `
        **Order matters.** Write \`first.next = second.next\` first: if you did \`second.next = first\` first, you'd lose the only
        reference to the rest of the list. A good habit — when re-pointing, save or reconnect the “rest” before breaking a link.

        **Why the dummy node:** the first pair has no node before it; the dummy gives it one, so the head swap is not a special case,
        and \`dummy.next\` is always the answer.

        **Follow-up:** Reverse Nodes in k-Group (LC 25) generalises this — reverse k nodes at a time with the same prev/first bookkeeping.
      `,
      fn: 'swapPairs',
      input: list,
      output: toArr,
      tests: [
        { args: [[1, 2, 3, 4]], expected: [2, 1, 4, 3] },
        { args: [[]], expected: [] },
        { args: [[1]], expected: [1] },
        { args: [[1, 2, 3]], expected: [2, 1, 3], label: 'odd length — last node stays' },
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
