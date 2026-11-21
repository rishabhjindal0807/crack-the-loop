import { allQuestions, topicById } from './dsa/index.js';

// Bosscoder Module 1 — every lecture (Lec) and instructor-led session (IL), grouped into units.
// `current` marks the class you're on right now; update it as the module moves on.
export const current = 'lec-21';

export const units = [
  {
    id: 'arrays',
    title: 'Arrays, Complexity & Prefix Sums',
    classes: [
      { id: 'lec-1', code: 'Lec 1', title: 'Orientation, Arrays & Maths', topics: ['arrays'],
        about: 'Static vs dynamic arrays, amortised push, first problem-solving patterns.',
        notes: ['Lecture 1 - Orientation & Arrays and Maths-lecture notes.pdf', 'Lecture 1 -Arrays_and_Dynamic_Arrays.docx'] },
      { id: 'lec-2', code: 'Lec 2', title: 'Time Complexity & 1D / 2D Arrays', topics: ['arrays'],
        about: 'Big-O, prefix sums, sub-matrix sums and 2D range-sum queries.',
        notes: ['Lec 2 -Time Complexity & 1D - 2D Arrays - Instructor notes.pdf', 'Lec 2-SubMatrices_and_Range_Sum-Bosscoder-notes.pdf'] },
      { id: 'lec-3', code: 'Lec 3', title: '1D & 2D Arrays', topics: ['arrays'],
        about: 'Matrix traversal patterns — spiral, rotation, in-place tricks.',
        notes: ['Lec 3- 1D & 2D Arrays- Instructor Notes.pdf'] },
      { id: 'il-1', code: 'IL1', title: 'Arrays & Maths · 1D & 2D Arrays', topics: ['arrays'],
        about: 'Instructor-led practice on array problems.',
        notes: ['IL1 - Arrays & Maths || 1D & 2D Arrays.pdf'] },
      { id: 'il-2', code: 'IL2', title: '1D & 2D Arrays', topics: ['arrays'],
        about: '2D prefix sums and searching a sorted matrix.',
        notes: ['IL2 - 1D & 2D Arrays.pdf'] },
    ],
  },
  {
    id: 'bits-maths',
    title: 'Bit Manipulation & Maths',
    classes: [
      { id: 'lec-4', code: 'Lec 4', title: 'Bit Manipulation', topics: ['bits'],
        about: 'AND / OR / XOR tricks, checking and setting bits, XOR to find the odd one out.',
        notes: ['Lec 4 -Bit Manipulation- Insctructor Notes.pdf', 'Lec 4-Bit_Manipulation-Bosscoder.docx'] },
      { id: 'lec-5', code: 'Lec 5', title: 'Maths 1 & Maths 2', topics: ['maths'],
        about: 'GCD, divisors in O(√n), primes and sieve, modular arithmetic, randN from randM.',
        notes: ['Lec 5-Maths 1 & Maths 2- Instructor Notes.pdf', 'Lec 5- Maths 1- Bosscoder Notes.pdf', 'Lec 5- Maths 2- Bosscoder Notes.pdf'] },
      { id: 'il-3', code: 'IL3', title: 'Maths 1 & Maths 2', topics: ['maths'],
        about: 'Divisor counting, primes and modular arithmetic in practice.',
        notes: ['IL3 - Maths 1 & Maths 2.pdf'] },
    ],
  },
  {
    id: 'searching',
    title: 'Searching',
    classes: [
      { id: 'lec-6', code: 'Lec 6', title: 'Searching 1 & Searching 2', topics: ['searching'],
        about: 'Binary search templates, first/last occurrence, rotated arrays, binary search on the answer.',
        notes: ['Lec 6 -Searching 1 & Searching 2- Instructor Notes.pdf', 'Lec 6- Searching 1- Bosscoder Notes.pdf', 'Lec 6- Searching 2- Bosscoder Notes.pdf'] },
      { id: 'il-4', code: 'IL4', title: 'Bit Manipulation & Searching', topics: ['bits', 'searching'],
        about: 'Bit counting and reversing, peak elements, binary search practice.',
        notes: ['IL4 - Bit Manipulation & Searching - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'recursion',
    title: 'Recursion & Backtracking',
    classes: [
      { id: 'lec-7', code: 'Lec 7', title: 'Recursion 1 & Recursion 2', topics: ['recursion'],
        about: 'Base case + faith in the smaller call, recursion trees, pick / don’t-pick subsets and permutations.',
        notes: ['Lec 7-Recursion 1 & Recursion 2- Instructor Notes.pdf', 'Lec 7- Recursion 1- Bosscoder Notes.pdf', 'Lec 7- Recursion 2- Bosscoder Notes.pdf'] },
      { id: 'il-5', code: 'IL5', title: 'Recursion', topics: ['recursion'],
        about: 'Game-theory style recursion (minimax) and more practice.',
        notes: ['IL5 - Recursion - Instructor Notes.pdf'] },
      { id: 'lec-8', code: 'Lec 8', title: 'Backtracking', topics: ['backtracking'],
        about: 'Choose → explore → un-choose; N-Queens, rat in a maze, combinations.',
        notes: ['Lec 8 - Backtracking- Ins Notes.pdf', 'Lec 8- Backtracking- Bosscoder Notes.pdf'] },
    ],
  },
  {
    id: 'sorting',
    title: 'Sorting',
    classes: [
      { id: 'lec-9', code: 'Lec 9', title: 'Sorting 1 & Sorting 2', topics: ['sorting'],
        about: 'Elementary sorts, counting/bucket sort, merge sort, inversion count, quick sort.',
        notes: ['Lec 9 - Sorting 1 & Sorting 2-Instructor Notes.pdf', 'Lec 9- Sorting 1- Bosscoder Notes.pdf', 'Lec 9- Sorting 2- Bosscoder Notes.pdf'] },
      { id: 'lec-10', code: 'Lec 10', title: 'Sorting Revision', topics: ['sorting'],
        about: 'Stability, in-place vs extra space, choosing the right sort.',
        notes: ['Lec 10 - Sorting Revision - Instructor Notes.pdf'] },
      { id: 'il-6', code: 'IL6', title: 'Backtracking & Sorting', topics: ['backtracking', 'sorting', 'recursion'],
        about: 'Subsets, backtracking and sorting practice.',
        notes: ['IL6 - Backtracking & Sorting - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'two-pointers-hashing',
    title: 'Two Pointers & Hashing',
    classes: [
      { id: 'lec-11', code: 'Lec 11', title: '2 Pointers', topics: ['two-pointers'],
        about: 'Opposite-end and same-direction pointers, sliding windows, pairs with a target.',
        notes: ['Lec 11 - 2 Pointers - Instructor Notes.pdf', 'Lec 11 - 2 Pointers - Bosscoder Notes.md'] },
      { id: 'lec-12', code: 'Lec 12', title: 'Hashing 1 & Hashing 2', topics: ['hashing'],
        about: 'Hash functions, collisions (chaining / probing), load factor, prefix-sum + map tricks.',
        notes: ['Lec 12 - Hashing 1 & Hashing 2 - Instructor Notes.pdf', 'Lec 12 - Hashing 1 & Hashing 2 - Bosscoder Notes.md'] },
      { id: 'il-7', code: 'IL7', title: '2 Pointers & Hashing', topics: ['two-pointers', 'hashing'],
        about: 'Dutch flag, move zeroes, anagram groups, longest consecutive sequence.',
        notes: ['IL7 - 2 Pointers & Hashing - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'stacks',
    title: 'Stacks & Queues',
    classes: [
      { id: 'lec-13', code: 'Lec 13', title: 'Stacks & Queues', topics: ['stack-queue'],
        about: 'Array / queue-backed stacks, monotonic stacks, nearest smaller / greater element.',
        notes: ['Lec 13 - Stacks & Queues - Instructor Notes.pdf', 'Lec 13 - Stacks & Queues - Bosscoder Notes.md'] },
      { id: 'il-8', code: 'IL8', title: 'Stacks & Queues', topics: ['stack-queue', 'two-pointers'],
        about: 'Valid parentheses, circular queue, sliding-window maximum with a deque.',
        notes: ['IL8 - Stacks & Queues - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'linked-list',
    title: 'Linked List',
    classes: [
      { id: 'lec-14', code: 'Lec 14', title: 'Linked List 1 & Linked List 2', topics: ['linked-list'],
        about: 'Reverse, middle (slow / fast), cycle detection, merging — and the dummy-node trick.',
        notes: ['Lec 14 - Linked List 1 & Linked List 2 - Instructor Notes.pdf', 'Lec 14 - Linked List 1 & Linked List 2 - Bosscoder Notes.md'] },
      { id: 'il-9', code: 'IL9', title: 'Linked List', topics: ['linked-list'],
        about: 'Pointer surgery with a dummy node — remove nth from end, swap pairs.',
        notes: [] },
    ],
  },
  {
    id: 'trees',
    title: 'Trees, Tries & Heaps',
    classes: [
      { id: 'lec-15', code: 'Lec 15', title: 'Trees 1 & BST', topics: ['trees'],
        about: 'Traversals (pre / in / post / level), height, balanced trees.',
        notes: ['Lec 15 - Trees 1 & BST - Instructor Notes.pdf', 'Lec 15 - Trees 1 & BST - Bosscoder Notes.md'] },
      { id: 'lec-16', code: 'Lec 16', title: 'BBST & Trees 2', topics: ['trees'],
        about: 'BST search / insert / delete, kth smallest, recovering a BST.',
        notes: ['Lec 16 - BBST & Trees 2 - Instructor Notes.pdf'] },
      { id: 'il-10', code: 'IL10', title: 'Trees 1 & BST', topics: ['trees'],
        about: 'Instructor-led practice on tree traversals and BSTs.',
        notes: [] },
      { id: 'lec-17', code: 'Lec 17', title: 'Tries', topics: ['tries'],
        about: 'Prefix trees: insert / search / startsWith, wildcard search, replace words.',
        notes: ['Lec 17 - Tries - Instructor Notes.pdf'] },
      { id: 'lec-18', code: 'Lec 18', title: 'Heaps 1 & Heaps 2', topics: ['heaps'],
        about: 'Heapify up / down, O(n) build-heap, heap sort, top-k with a size-k heap.',
        notes: ['Lec 18 - Heaps 1 & Heaps 2 - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'greedy-dp',
    title: 'Greedy & Dynamic Programming',
    classes: [
      { id: 'lec-19', code: 'Lec 19', title: 'Greedy', topics: ['greedy'],
        about: 'Local-best choices and when they are safe: activity selection, fractional knapsack, partition labels.',
        notes: ['Lec 19 - Greedy - Instructor Notes.pdf'] },
      { id: 'lec-20', code: 'Lec 20', title: 'DP 1 & DP 2', topics: ['dp'],
        about: 'Recurrence → memoization → tabulation → space optimisation.',
        notes: ['Lec 20 - DP 1 & DP 2 - Instructor Notes.pdf'] },
    ],
  },
  {
    id: 'graphs',
    title: 'Graphs',
    classes: [
      { id: 'lec-21', code: 'Lec 21', title: 'Graph', topics: ['graphs'],
        about: 'Graph basics: nodes and edges, in-degree and out-degree, adjacency lists, BFS and DFS.',
        notes: [] },
    ],
  },
];

// Dates and attendance from your Bosscoder dashboard (P = present, A = absent). Upcoming classes have a time.
// Update this when a class happens or new classes are scheduled.
export const schedule = {
  'lec-1': ['2026-08-29', 'P'], 'lec-2': ['2026-08-30', 'P'], 'il-1': ['2026-09-03', 'P'], 'lec-3': ['2026-09-05', 'P'],
  'lec-4': ['2026-09-06', 'P'], 'il-2': ['2026-09-10', 'P'], 'lec-5': ['2026-09-12', 'P'], 'lec-6': ['2026-09-13', 'P'],
  'il-3': ['2026-09-17', 'P'], 'lec-7': ['2026-09-19', 'P'], 'lec-8': ['2026-09-20', 'P'], 'il-4': ['2026-09-24', 'P'],
  'lec-9': ['2026-09-27', 'P'], 'il-5': ['2026-10-01', 'P'], 'lec-10': ['2026-10-03', 'P'], 'lec-11': ['2026-10-04', 'P'],
  'il-6': ['2026-10-08', 'P'], 'lec-12': ['2026-10-10', 'P'], 'lec-13': ['2026-10-11', 'A'], 'lec-14': ['2026-10-24', 'A'],
  'lec-15': ['2026-10-25', 'A'], 'lec-16': ['2026-10-31', 'P'], 'lec-17': ['2026-11-01', 'P'], 'il-7': ['2026-11-05', 'P'],
  'lec-18': ['2026-11-07', 'P'], 'il-8': ['2026-11-12', 'P'], 'lec-19': ['2026-11-14', 'P'], 'lec-20': ['2026-11-15', 'P'],
  'il-9': ['2026-11-19', 'P'],
  'lec-21': ['2026-11-21', null, '11:00 AM', 'Nimish Gupta'],
  'il-10': ['2026-11-22', null, '11:00 AM', 'Nimish Gupta'],
};

// ---- link problems to classes by their `from` tag -------------------------------------
// "Lec 13 + IL8 – …" belongs to both; "(+ IL7 homework 706)" adds a homework link to IL7.
const codeToId = (c) => {
  const m = c.match(/^(?:Lec(?:ture)?\s*(\d+)|IL\s*(\d+))$/i);
  return m ? (m[1] ? `lec-${m[1]}` : `il-${m[2]}`) : null;
};

function parseFrom(from) {
  const hits = [...from.matchAll(/(Lec(?:ture)?\s*\d+|IL\s*\d+)/gi)];
  const out = [];
  hits.forEach((m, k) => {
    const id = codeToId(m[1]);
    if (!id || out.some((o) => o.id === id)) return;
    const seg = from.slice(m.index, hits[k + 1]?.index ?? from.length); // text up to the next class code
    const kind = /homework/i.test(seg) ? 'homework' : /Bosscoder notes/i.test(seg) ? 'notes' : 'class';
    out.push({ id, kind });
  });
  return out;
}

export const allClasses = units.flatMap((u) =>
  u.classes.map((c) => {
    const [date, attended, time, instructor] = schedule[c.id] || [];
    return { ...c, unitId: u.id, unitTitle: u.title, date, missed: attended === 'A', upcoming: !attended && Boolean(date), time, instructor };
  })
);

// "Today, 11:00 AM" / "Tomorrow" / "Sat, 25 Oct"
export function classWhen(c) {
  if (!c.date) return '';
  const [y, m, d] = c.date.split('-').map(Number);
  const day = new Date(y, m - 1, d);
  const now = new Date();
  const diff = Math.round((day - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000);
  const label = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : day.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
  return c.time && diff >= 0 ? `${label}, ${c.time}` : label;
}
export const classById = Object.fromEntries(allClasses.map((c) => [c.id, c]));

const problemsByClass = Object.fromEntries(allClasses.map((c) => [c.id, []]));
for (const q of allQuestions) {
  if (!q.from) continue;
  for (const { id, kind } of parseFrom(q.from)) problemsByClass[id]?.push({ ...q, kind });
}
for (const c of allClasses) c.problems = problemsByClass[c.id];

export const classOfQuestion = (q) => (q.from ? parseFrom(q.from)[0]?.id : null);

export const topicTitles = (c) => c.topics.map((t) => topicById[t]).filter(Boolean);

export const kindMeta = {
  class: { label: 'Solved in class' },
  homework: { label: 'Homework' },
  notes: { label: 'From the Bosscoder notes' },
};
