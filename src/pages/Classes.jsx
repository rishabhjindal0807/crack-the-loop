import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { units, allClasses, classById, current, kindMeta } from '../data/classes.js';
import { useProgress } from '../lib/progress.js';
import { PageHeader, ProgressBar, SectionTabs, practiceTabs } from '../components/ui.jsx';

export function Ring({ value, total, size = 36 }) {
  const pct = total ? value / total : 0;
  const r = size / 2 - 3;
  const C = 2 * Math.PI * r;
  const full = total > 0 && value === total;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0" role="img" aria-label={total ? `${value} of ${total} practised` : 'No linked problems'}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="3" className="stroke-slate-200 dark:stroke-slate-800" />
      {total > 0 && (
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="3" strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={full ? 'stroke-emerald-600 dark:stroke-emerald-500' : 'stroke-indigo-600 dark:stroke-indigo-400'} strokeDasharray={`${pct * C} ${C}`} />
      )}
      <text x="50%" y="50%" dy="3.5" textAnchor="middle" fontSize="10" fontWeight="600" className={full ? 'fill-emerald-700 dark:fill-emerald-400' : 'fill-slate-700 dark:fill-slate-300'}>
        {full ? '✓' : total ? `${value}/${total}` : '–'}
      </text>
    </svg>
  );
}

const filters = [
  ['all', 'All'],
  ['lec', 'Lectures'],
  ['il', 'IL sessions'],
  ['pending', 'With work left'],
];
const chip = (on) =>
  `rounded-full border px-3 py-1 text-sm ${on ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'}`;

export default function Classes() {
  const p = useProgress();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const ids = (c) => c.problems.map((q) => q.uid);
  const allIds = [...new Set(allClasses.flatMap(ids))];
  const cur = classById[current];
  const homeworkLeft = new Set(allClasses.flatMap((c) => c.problems.filter((q) => q.kind === 'homework' && !p.isDone(q.uid)).map((q) => q.uid))).size;

  const match = useMemo(() => {
    const s = query.trim().toLowerCase();
    return (c) => {
      if (filter === 'lec' && !c.id.startsWith('lec')) return false;
      if (filter === 'il' && !c.id.startsWith('il')) return false;
      if (filter === 'pending' && !c.problems.some((q) => !p.isDone(q.uid))) return false;
      if (!s) return true;
      return [c.code, c.title, c.about, ...c.problems.map((q) => q.title)].join(' ').toLowerCase().includes(s);
    };
  }, [filter, query, p]);

  const visibleUnits = units.map((u) => ({ ...u, shown: u.classes.map((c) => classById[c.id]).filter(match) })).filter((u) => u.shown.length);

  return (
    <div>
      <SectionTabs label="Practice views" tabs={practiceTabs} />
      <PageHeader title="Practice by class" actions={<div className="w-64"><ProgressBar value={p.doneCount(allIds)} total={allIds.length} label="Class problems practised" /></div>}>
        Bosscoder Module 1: {allClasses.filter((c) => c.id.startsWith('lec')).length} lectures and {allClasses.filter((c) => c.id.startsWith('il')).length} instructor-led sessions. You're on{' '}
        <Link to={`/classes/${cur.id}`} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 dark:text-white dark:decoration-slate-600">{cur.code}, {cur.title}</Link>
        {homeworkLeft > 0 ? `, with ${homeworkLeft} homework problems still open.` : '.'}
      </PageHeader>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <label htmlFor="cls-filter" className="sr-only">Filter classes</label>
        <input id="cls-filter" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter classes or problems"
          className="mr-2 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900" />
        {filters.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k} className={chip(filter === k)}>{label}</button>
        ))}
      </div>

      <div className="space-y-12">
        {visibleUnits.map((u) => {
          const uIds = [...new Set(u.classes.flatMap((c) => ids(classById[c.id])))];
          return (
            <section key={u.id} aria-labelledby={`unit-${u.id}`}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-3">
                <h2 id={`unit-${u.id}`} className="text-lg font-semibold text-slate-900 dark:text-white">{u.title}</h2>
                <div className="w-48"><ProgressBar value={p.doneCount(uIds)} total={uIds.length} label={`${u.title} practised`} /></div>
              </div>
              <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {u.shown.map((c) => {
                  const count = (k) => c.problems.filter((q) => q.kind === k).length;
                  const isCur = c.id === current;
                  return (
                    <li key={c.id}>
                      <Link to={`/classes/${c.id}`} className="group flex items-center gap-4 py-3.5">
                        <span className="w-14 shrink-0 text-sm tabular-nums text-slate-600 dark:text-slate-400">{c.code}</span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="truncate font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{c.title}</span>
                            {isCur && <span className="shrink-0 rounded-md bg-indigo-50 px-1.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">Current</span>}
                          </span>
                          <span className="mt-0.5 block truncate text-sm text-slate-600 dark:text-slate-400">
                            {c.problems.length
                              ? Object.keys(kindMeta).filter((k) => count(k)).map((k) => `${count(k)} ${k === 'class' ? 'in class' : k === 'homework' ? 'homework' : 'from notes'}`).join(', ')
                              : 'No linked problems yet'}
                            <span className="hidden md:inline">{c.about ? `. ${c.about}` : ''}</span>
                          </span>
                        </span>
                        <Ring value={p.doneCount(ids(c))} total={c.problems.length} />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {visibleUnits.length === 0 && (
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No classes match.{' '}
            <button className="font-medium text-indigo-700 underline dark:text-indigo-300" onClick={() => { setFilter('all'); setQuery(''); }}>Clear filters</button>
          </p>
        )}
      </div>
    </div>
  );
}
