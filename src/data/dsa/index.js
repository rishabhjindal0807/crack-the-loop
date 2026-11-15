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

export const topics = [
  arrays, bits, maths, searching, recursion, backtracking, sorting,
  strings, hashing, twoPointers, linkedList, stackQueue, trees, heaps, greedy, dp, graphs, tries,
];

export const topicById = Object.fromEntries(topics.map((t) => [t.id, t]));

export const allQuestions = topics.flatMap((t) =>
  t.questions.map((q) => ({ ...q, uid: `${t.id}/${q.id}`, topicId: t.id, topicTitle: t.title }))
);
