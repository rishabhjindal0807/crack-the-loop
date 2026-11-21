import arrays from './arrays.js';
import bits from './bits.js';
import maths from './maths.js';
import searching from './searching.js';
import recursion from './recursion.js';
import backtracking from './backtracking.js';
import sorting from './sorting.js';
import strings from './strings.js';
import hashing from './hashing.js';
import twoPointers from './two-pointers.js';
import linkedList from './linked-list.js';
import stackQueue from './stack-queue.js';
import trees from './trees.js';
import heaps from './heaps.js';
import greedy from './greedy.js';
import dp from './dp.js';
import graphs from './graphs.js';
import tries from './tries.js';
import { twoPointersExtra, hashingExtra } from './m1/two-pointers-hashing.js';
import { stackExtra, linkedListExtra } from './m1/stacks-ll.js';
import { treesExtra, triesExtra, heapsExtra } from './m1/trees-tries-heaps.js';
import { greedyExtra, dpExtra, searchingExtra, bitsExtra, recursionExtra } from './m1/greedy-dp-misc.js';
import { arraysLc, mathsLc, stringsLc, twoPointersLc, searchingLc, hashingLc, dpLc } from './m1/leetcode-extra.js';
import { arraysLc2, mathsLc2, jsChallenges } from './m1/leetcode-extra-2.js';

// ---- Bosscoder Module 1 (EV-21A) lecture mapping -------------------------------------------
const meta = {
  bits: { lecture: 'Lec 4 + IL4' },
  searching: { lecture: 'Lec 6 + IL4' },
  recursion: { lecture: 'Lec 7 + IL5' },
  backtracking: { lecture: 'Lec 8 + IL6' },
  sorting: { lecture: 'Lec 9–10 + IL6' },
  'two-pointers': { lecture: 'Lec 11 + IL7', source: 'notes' },
  hashing: { lecture: 'Lec 12 + IL7', source: 'notes' },
  'stack-queue': { lecture: 'Lec 13 + IL8', source: 'notes' },
  'linked-list': { lecture: 'Lec 14 + IL9', source: 'notes' },
  trees: { lecture: 'Lec 15–16', source: 'notes', title: 'Binary Trees, BST & BBST' },
  tries: { lecture: 'Lec 17', source: 'notes' },
  heaps: { lecture: 'Lec 18', source: 'notes' },
  greedy: { lecture: 'Lec 19', source: 'notes' },
  dp: { lecture: 'Lec 20', source: 'notes' },
};

const extras = {
  'two-pointers': [...twoPointersExtra, ...twoPointersLc],
  hashing: [...hashingExtra, ...hashingLc],
  'stack-queue': stackExtra,
  'linked-list': linkedListExtra,
  trees: treesExtra,
  tries: triesExtra,
  heaps: heapsExtra,
  greedy: greedyExtra,
  dp: [...dpExtra, ...dpLc],
  searching: [...searchingExtra, ...searchingLc],
  bits: bitsExtra,
  recursion: recursionExtra,
  // from your LeetCode practice history
  arrays: [...arraysLc, ...arraysLc2],
  maths: [...mathsLc, ...mathsLc2],
  strings: stringsLc,
};

// Existing problems that were also covered in class / assigned as homework.
const classTags = {
  'searching/peak-element': 'IL4 – Bit Manipulation & Searching',
  'bits/number-of-1-bits': 'IL4 – Bit Manipulation & Searching',
  'recursion/subsets-recursive': 'IL6 – Backtracking & Sorting',
  'sorting/sort-colors': 'IL7 – 2 Pointers & Hashing',
  'two-pointers/container-most-water': 'Lec 11 – 2 Pointers + IL7',
  'two-pointers/three-sum': 'IL7 – homework (15)',
  'two-pointers/remove-duplicates-sorted': 'IL7 – homework (26)',
  'two-pointers/sliding-window-maximum': 'IL8 – Stacks & Queues',
  'hashing/two-sum': 'Lec 11 – 2 Pointers',
  'hashing/subarray-sum-equals-k': 'Lec 11 – 2 Pointers (Bosscoder notes)',
  'hashing/group-anagrams': 'IL7 – 2 Pointers & Hashing',
  'hashing/longest-consecutive-sequence': 'IL7 – 2 Pointers & Hashing',
  'hashing/longest-substring-no-repeat': 'Lec 12 – Hashing 1 & 2',
  'stack-queue/valid-parentheses': 'IL8 – Stacks & Queues',
  'stack-queue/min-stack': 'Lec 13 + IL8 – Stacks & Queues',
  'stack-queue/largest-rectangle-histogram': 'Lec 13 – Stacks (Bosscoder notes)',
  'stack-queue/daily-temperatures': 'IL8 – homework (739)',
  'stack-queue/eval-rpn': 'IL8 – homework (150)',
  'linked-list/reverse-linked-list': 'Lec 14 – Linked List 1 & 2',
  'linked-list/remove-nth-from-end': 'IL9 – Linked List',
  'linked-list/merge-two-sorted-lists': 'Lec 14 – homework (21)',
  'trees/inorder-traversal': 'Lec 15 – Trees 1 & BST',
  'trees/level-order': 'Lec 15 – Trees 1 (Bosscoder notes)',
  'trees/kth-smallest-bst': 'Lec 16 – BBST & Trees 2',
  'tries/implement-trie': 'Lec 17 – Tries',
  'heaps/kth-largest-heap': 'Lec 18 – Heaps 1 & 2',
  'dp/climbing-stairs': 'Lec 20 – DP 1 & 2',
  'dp/house-robber': 'Lec 20 – DP 1 & 2',
};

const extraConcepts = {
  hashing: `
    - **From Lec 12:** a hash table maps *key → index → value*. An ideal hash function is **deterministic (idempotent), one-way, fast, uniform, and in range** (\`key % size\`).
    - **Collisions:** *open hashing / separate chaining* (a list per bucket) or *closed hashing / open addressing* (linear probing → clustering, quadratic probing, double hashing; deletes need a tombstone / soft delete).
    - **Load factor** α = n / b (entries / buckets). Keep it below ~0.75 and resize to keep operations O(1) on average.
  `,
  heaps: `
    - **From Lec 18:** a binary heap is a **complete binary tree** + the **heap-order property** (max-heap: parent ≥ children). Insert = append + heapify-up; extractMax = move last to root + heapify-down — both O(log n).
    - **Floyd’s build-heap** heapifies down from \`n/2 − 1\` to 0 in **O(n)**. Heap sort = build heap + n × extractMax ⇒ O(n log n), in place.
    - Top-k largest: **min-heap of size k** (O(n log k)); top-k smallest: max-heap of size k.
  `,
  dp: `
    - **From Lec 20:** brute-force recursion → write the **recurrence + base cases** → **memoization** (top-down) → **tabulation** (bottom-up) → **space optimisation** (keep only the previous row / two variables).
  `,
  greedy: `
    - **From Lec 19:** greedy = at every step choose what looks best right now (local optimum) and hope it reaches the global optimum. Unlike backtracking you never go back — so prove it (exchange argument) or find a counter-example.
  `,
  trees: `
    - **From Lec 16 (BST):** every node is greater than its entire left subtree and smaller than its entire right subtree ⇒ inorder is sorted; search/insert/delete are O(h). A **balanced** BST (AVL / red-black) keeps h = O(log n); a skewed one degrades to O(n).
    - **Delete** has 3 cases: leaf → remove; one child → splice it in; two children → replace with the inorder successor (min of right subtree) or predecessor.
  `,
};

const order = [
  arrays, bits, maths, searching, recursion, backtracking, sorting,
  twoPointers, hashing, stackQueue, linkedList, trees, tries, heaps, greedy, dp,
  strings, graphs, jsChallenges,
];

for (const t of order) {
  Object.assign(t, meta[t.id] || {});
  if (extras[t.id]) {
    const have = new Set(t.questions.map((q) => q.id));
    t.questions.push(...extras[t.id].filter((q) => !have.has(q.id)));
  }
  for (const q of t.questions) {
    const tag = classTags[`${t.id}/${q.id}`];
    if (tag && !q.from) q.from = tag;
  }
  if (extraConcepts[t.id] && !t.concepts.includes('From Lec')) t.concepts = t.concepts + '\n' + extraConcepts[t.id];
  // class / notes problems first, keeping their relative order
  t.questions.sort((a, b) => Number(!a.from) - Number(!b.from));
}
strings.source = 'curriculum';
strings.lecture = 'Not covered in class yet';
graphs.source = 'notes';
graphs.lecture = 'Lec 21';

export const topics = order;

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

export const allQuestions = topics.flatMap((t) =>
  t.questions.map((q) => ({ ...q, uid: `${t.id}/${q.id}`, topicId: t.id, topicTitle: t.title }))
);
