import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { allQuestions, topics } from '../data/dsa/index.js';
import { everything, itemById as byId } from '../data/items.js';
import { lcSubmissions } from '../data/leetcode.js';
import { useProgress } from '../lib/progress.js';
import { Badge, PageHeader, ProgressBar, StatusPill, diffColor } from '../components/ui.jsx';

export const reviseItems = (p) => everything.filter((x) => p.status(x.id) === 'revise');

const siteBySlug = new Map();
for (const q of allQuestions) if (q.lc && !siteBySlug.has(q.lc)) siteBySlug.set(q.lc, q);

function Row({ item, p, showNote = true }) {
  const note = p.note(item.id);
  return (
    <li className="flex items-start gap-4 py-3.5">
      <div className="min-w-0 flex-1">
        <Link to={item.to} className="text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">
          {item.title}
        </Link>
        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">{item.area}</p>
        {showNote && note && <p className="mt-1.5 line-clamp-3 whitespace-pre-line border-l-2 border-slate-200 pl-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">{note}</p>}
      </div>
      {item.difficulty && <Badge className={diffColor[item.difficulty]}>{item.difficulty}</Badge>}
      {p.status(item.id) === 'revise' ? (
        <button onClick={() => p.setStatus(item.id, 'mastered')} className="shrink-0 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:border-slate-700 dark:text-slate-300">
          Mark mastered
        </button>
      ) : (
        <StatusPill status={p.status(item.id)} />
      )}
    </li>
  );
}

export default function Revise() {
  const p = useProgress();
  const { hash } = useLocation();
  const [kind, setKind] = useState('All');
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
  }, [hash]);

  const revise = reviseItems(p).filter((x) => kind === 'All' || x.kind === kind);
  const notes = Object.entries(p.notes())
    .map(([id, n]) => ({ item: byId.get(id), at: n.at }))
    .filter((x) => x.item)
    .sort((a, b) => b.at - a.at);
  const retries = lcSubmissions.filter((s) => s.verdict !== 'AC');
  const mastered = everything.filter((x) => p.status(x.id) === 'mastered');
  const weak = topics
    .filter((t) => t.source === 'notes')
    .map((t) => {
      const ids = t.questions.map((q) => `${t.id}/${q.id}`);
      return { t, ids, done: p.doneCount(ids), revise: p.countBy(ids, 'revise') };
    })
    .sort((a, b) => a.done / a.ids.length - b.done / b.ids.length || b.revise - a.revise)
    .slice(0, 5);

  return (
    <div className="max-w-4xl">
      <PageHeader title="Revise">The night-before list: everything you marked Revise, the notes you wrote, and the topics that need the most work.</PageHeader>

      <section aria-labelledby="queue">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="queue" className="text-lg font-semibold text-slate-900 dark:text-white">Marked Revise</h2>
          <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5 text-sm dark:bg-slate-800" role="group" aria-label="Show">
            {['All', 'Problem', 'Concept'].map((k) => (
              <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
                className={`rounded-md px-2.5 py-1 ${kind === k ? 'bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                {k === 'All' ? 'All' : `${k}s`}
              </button>
            ))}
          </div>
        </div>
        {revise.length ? (
          <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {revise.map((x) => <Row key={x.id} item={x} p={p} />)}
          </ul>
        ) : (
          <p className="mt-3 border-y border-slate-200 py-5 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
            Nothing here yet. On any problem or concept, set the status to <StatusPill status="revise" /> when it feels shaky; it appears here until you mark it mastered.
          </p>
        )}
      </section>

      <section aria-labelledby="notes-h" className="mt-12">
        <h2 id="notes-h" className="text-lg font-semibold text-slate-900 dark:text-white">Your notes <span className="font-normal text-slate-500 dark:text-slate-400">{notes.length}</span></h2>
        {notes.length ? (
          <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {notes.map(({ item }) => <Row key={item.id} item={item} p={p} />)}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Notes you write on a problem or concept are collected here, newest first.</p>
        )}
      </section>

      <section aria-labelledby="retry" id="retry" className="mt-12 scroll-mt-20">
        <h2 id="retry-h" className="text-lg font-semibold text-slate-900 dark:text-white">LeetCode retries <span className="font-normal text-slate-500 dark:text-slate-400">{retries.length}</span></h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Your last submission wasn't accepted. Read the write-up, run the tests here, then resubmit.</p>
        <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {retries.map((s) => {
            const q = siteBySlug.get(s.slug);
            return (
              <li key={s.num} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3.5">
                <span className="min-w-0 flex-1 text-sm">
                  {q ? (
                    <Link to={`/dsa/${q.topicId}/${q.id}`} className="font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">{s.num}. {s.title}</Link>
                  ) : (
                    <span className="font-medium text-slate-900 dark:text-white">{s.num}. {s.title}</span>
                  )}
                  <span className="block text-xs text-amber-800 dark:text-amber-300">Last result: {s.verdictLabel}</span>
                </span>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Retry on LeetCode</a>
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="weak-h" className="mt-12">
        <h2 id="weak-h" className="text-lg font-semibold text-slate-900 dark:text-white">Weakest topics</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Module 1 topics with the lowest share of problems practised.</p>
        <ul className="mt-4 space-y-3">
          {weak.map(({ t, ids, done, revise: r }) => (
            <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] items-center gap-4 sm:grid-cols-[240px_1fr_auto]">
              <Link to={`/dsa/${t.id}`} className="truncate text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">{t.title}</Link>
              <ProgressBar value={done} total={ids.length} label={`${t.title} practised`} />
              <span className="hidden text-xs text-slate-600 sm:block dark:text-slate-400">{r ? `${r} to revise` : ''}</span>
            </li>
          ))}
        </ul>
      </section>

      {mastered.length > 0 && (
        <details className="mt-12">
          <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white">Mastered <span className="font-normal text-slate-500 dark:text-slate-400">{mastered.length}</span></summary>
          <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {mastered.map((x) => <Row key={x.id} item={x} p={p} showNote={false} />)}
          </ul>
        </details>
      )}
    </div>
  );
}
