import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { units, allClasses, classById, current, kindMeta } from '../data/classes.js';
import { useProgress } from '../lib/progress.js';
import { Card, ProgressBar } from '../components/ui.jsx';
import { links } from '../data/profile.js';

export const codeStyle = (c) =>
  c.id.startsWith('il')
    ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
    : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300';

function Ring({ value, total, size = 40 }) {
  const pct = total ? value / total : 0;
  const r = size / 2 - 4;
  const C = 2 * Math.PI * r;
  const full = total > 0 && value === total;
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90" aria-label={`${value} of ${total} done`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" className="stroke-slate-200 dark:stroke-slate-800" />
      {total > 0 && (
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth="4" strokeLinecap="round"
          className={full ? 'stroke-emerald-500' : 'stroke-indigo-500'} strokeDasharray={`${pct * C} ${C}`} />
      )}
      <text x="50%" y="50%" dy="4" textAnchor="middle" fontSize="11" fontWeight="600"
        className={`rotate-90 ${full ? 'fill-emerald-600' : 'fill-slate-600 dark:fill-slate-300'}`} style={{ transformOrigin: 'center' }}>
        {full ? '✓' : total ? `${value}/${total}` : '–'}
      </text>
    </svg>
  );
}

const filters = [
  ['all', 'All classes'],
  ['lec', 'Lectures'],
  ['il', 'IL sessions'],
  ['pending', 'Has pending problems'],
];

export default function Classes() {
  const p = useProgress();
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const ids = (c) => c.problems.map((q) => q.uid);
  const allIds = [...new Set(allClasses.flatMap(ids))];
  const cur = classById[current];
  const nextUp = cur.problems.find((q) => !p.isDone(q.uid));
  const homeworkLeft = allClasses.flatMap((c) => c.problems.filter((q) => q.kind === 'homework' && !p.isDone(q.uid)).map((q) => ({ ...q, cls: c.code })));

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
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes · Bosscoder Module 1</h1>
          <p className="mt-1 text-sm text-slate-500">
            {allClasses.filter((c) => c.id.startsWith('lec')).length} lectures + {allClasses.filter((c) => c.id.startsWith('il')).length} IL sessions · {allIds.length} problems taken from class, homework and notes
          </p>
        </div>
        <div className="w-full max-w-xs">
          <ProgressBar value={p.doneCount(allIds)} total={allIds.length} />
        </div>
      </div>

      {/* Continue */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 lg:col-span-2 dark:border-indigo-500/30 dark:from-indigo-500/10 dark:to-violet-500/5">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">📍 You are here</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={`rounded-lg px-2 py-0.5 text-sm font-bold ${codeStyle(cur)}`}>{cur.code}</span>
            <h2 className="text-xl font-semibold">{cur.title}</h2>
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{cur.about}</p>
          <div className="mt-4 max-w-sm">
            <ProgressBar value={p.doneCount(ids(cur))} total={cur.problems.length} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {nextUp ? (
              <Link to={`/dsa/${nextUp.topicId}/${nextUp.id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Next: {nextUp.title} →
              </Link>
            ) : (
              <span className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">✓ All {cur.code} problems done</span>
            )}
            <Link to={`/classes/${cur.id}`} className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-500/40 dark:bg-transparent dark:text-indigo-300">
              Open {cur.code}
            </Link>
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">📝 Homework left</p>
          <p className="mt-2 text-3xl font-bold tabular-nums">{homeworkLeft.length}</p>
          <ul className="mt-3 space-y-1.5 text-sm">
            {homeworkLeft.slice(0, 4).map((q) => (
              <li key={q.uid + q.cls}>
                <Link to={`/dsa/${q.topicId}/${q.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                  {q.title} <span className="text-xs text-slate-400">· {q.cls}</span>
                </Link>
              </li>
            ))}
            {homeworkLeft.length === 0 && <li className="text-slate-500">All homework done 🎉</li>}
          </ul>
          {homeworkLeft.length > 4 && (
            <button onClick={() => setFilter('pending')} className="mt-3 text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
              Show classes with pending problems →
            </button>
          )}
        </Card>
      </div>

      {/* Filters */}
      <div className="z-20 -mx-4 sm:sticky sm:top-14 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search classes or problems…"
          className="w-full max-w-xs rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-500/20"
        />
        {filters.map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`rounded-xl border px-3 py-2 text-sm ${filter === k ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700'}`}>
            {label}
          </button>
        ))}
        <div className="ml-auto hidden gap-1 lg:flex">
          {units.map((u, k) => (
            <button key={u.id} title={u.title}
              onClick={() => document.getElementById(`unit-${u.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="h-7 w-7 rounded-lg border border-slate-200 text-xs text-slate-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700">
              {k + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Units */}
      <div className="space-y-10">
        {visibleUnits.map((u) => {
          const unitNum = units.findIndex((x) => x.id === u.id) + 1;
          const uIds = [...new Set(u.classes.flatMap((c) => ids(classById[c.id])))];
          return (
            <section key={u.id} id={`unit-${u.id}`} className="scroll-mt-32">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold">
                  <span className="mr-2 text-sm font-medium text-slate-400">Unit {unitNum}</span>
                  {u.title}
                </h2>
                <div className="w-48">
                  <ProgressBar value={p.doneCount(uIds)} total={uIds.length} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {u.shown.map((c) => {
                  const count = (k) => c.problems.filter((q) => q.kind === k).length;
                  const isCur = c.id === current;
                  return (
                    <button key={c.id} onClick={() => nav(`/classes/${c.id}`)} className="group text-left">
                      <Card className={`flex h-full gap-3 p-4 transition group-hover:-translate-y-0.5 group-hover:shadow-md ${isCur ? 'border-indigo-400 ring-2 ring-indigo-200 dark:ring-indigo-500/30' : 'group-hover:border-indigo-300 dark:group-hover:border-indigo-500/50'}`}>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${codeStyle(c)}`}>{c.code}</span>
                            {isCur && <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">📍 You are here</span>}
                          </div>
                          <h3 className="mt-1.5 font-semibold leading-snug">{c.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{c.about}</p>
                          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                            {Object.entries(kindMeta).map(([k, m]) => count(k) > 0 && (
                              <span key={k} title={m.label}>{m.icon} {count(k)} {k === 'class' ? 'in class' : k === 'homework' ? 'homework' : 'from notes'}</span>
                            ))}
                            {c.problems.length === 0 && <span>No linked problems — practice from the topic</span>}
                          </p>
                        </div>
                        <Ring value={p.doneCount(ids(c))} total={c.problems.length} />
                      </Card>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        {visibleUnits.length === 0 && <p className="text-sm text-slate-500">No classes match. <button className="text-indigo-600" onClick={() => { setFilter('all'); setQuery(''); }}>Clear filters</button></p>}
      </div>

      <p className="text-xs text-slate-500">
        Notes for each class are in your local <em>Bosscoder Notes</em> folder · <a className="text-indigo-600 hover:underline dark:text-indigo-400" href={links.bosscoder} target="_blank" rel="noreferrer">Bosscoder curriculum ↗</a>
      </p>
    </div>
  );
}
