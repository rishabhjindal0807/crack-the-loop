import { allQuestions } from './dsa/index.js';
import { sections } from './sections.js';

// Every problem and concept question in one shape — used by Revise, Interviews and search.
export const everything = [
  ...allQuestions.map((q) => ({ id: q.uid, kind: 'Problem', title: q.title, area: q.topicTitle, to: `/dsa/${q.topicId}/${q.id}`, difficulty: q.difficulty })),
  ...sections.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.items.map((i) => ({ id: `${s.id}:${i.id}`, kind: 'Concept', title: i.q, area: `${s.title} · ${c.title}`, to: `/${s.id}/${c.id}?q=${encodeURIComponent(i.id)}` }))
    )
  ),
];
export const itemById = new Map(everything.map((x) => [x.id, x]));
