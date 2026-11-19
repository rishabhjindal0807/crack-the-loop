import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { allClasses, classById, current, kindMeta, topicTitles } from '../data/classes.js';
import { useProgress } from '../lib/progress.js';
import { Badge, Card, DoneToggle, LcBadge, ProgressBar, StarToggle, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';
import { links } from '../data/profile.js';
import { codeStyle } from './Classes.jsx';

export default function ClassDetail() {
  const { classId } = useParams();
  const nav = useNavigate();
  const p = useProgress();
  const [hideDone, setHideDone] = useState(false);
  const c = classById[classId];
  const i = allClasses.findIndex((x) => x.id === classId);
  const prev = allClasses[i - 1];
  const next = allClasses[i + 1];

  // ← / → move between classes
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) nav(`/classes/${prev.id}`);
      if (e.key === 'ArrowRight' && next) nav(`/classes/${next.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, nav]);

  if (!c) return <p>Class not found. <Link className="text-indigo-600" to="/classes">All classes</Link></p>;

  const ids = c.problems.map((q) => q.uid);
  const done = p.doneCount(ids);
  const nextUp = c.problems.find((q) => !p.isDone(q.uid));
  const groups = Object.entries(kindMeta)
    .map(([k, m]) => ({ k, ...m, items: c.problems.filter((q) => q.kind === k && (!hideDone || !p.isDone(q.uid))), total: c.problems.filter((q) => q.kind === k).length }))
    .filter((g) => g.total);
  const multiTopic = new Set(c.problems.map((q) => q.topicId)).size > 1;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="text-sm text-slate-500">
        <Link to="/classes" className="hover:text-indigo-600">Classes</Link> / {c.unitTitle}
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className={`rounded-lg px-2 py-0.5 text-sm font-bold ${codeStyle(c)}`}>{c.code}</span>
          <h1 className="text-2xl font-bold tracking-tight">{c.title}</h1>
          {c.id === current && <Badge className="bg-indigo-600 text-white">📍 You are here</Badge>}
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{c.about}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {topicTitles(c).map((t) => (
            <Link key={t.id} to={`/dsa/${t.id}`} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium hover:border-indigo-400 hover:text-indigo-600 dark:border-slate-700">
              {t.icon} {t.title} · concepts & all problems →
            </Link>
          ))}
        </div>
      </div>

      <Card className="flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-48 flex-1">
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">Progress</p>
          <ProgressBar value={done} total={ids.length} />
        </div>
        {nextUp ? (
          <Link to={`/dsa/${nextUp.topicId}/${nextUp.id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            Start next: {nextUp.title} →
          </Link>
        ) : ids.length ? (
          <span className="rounded-lg bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">✓ Class complete</span>
        ) : null}
        {ids.length > 0 && (
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="accent-indigo-600" /> Hide done
          </label>
        )}
      </Card>

      {groups.map((g) => (
        <section key={g.k}>
          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
            {g.icon} {g.label} <span className="font-normal normal-case tracking-normal text-slate-400">({p.doneCount(c.problems.filter((q) => q.kind === g.k).map((q) => q.uid))}/{g.total} done)</span>
          </h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {g.items.map((q) => (
              <div key={q.uid} className="flex items-center gap-3 px-4 py-3">
                <DoneToggle done={p.isDone(q.uid)} onClick={() => p.toggleDone(q.uid)} />
                <Link to={`/dsa/${q.topicId}/${q.id}`} className={`min-w-0 flex-1 truncate text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 ${p.isDone(q.uid) ? 'text-slate-400 line-through decoration-slate-300' : ''}`}>
                  {q.title}
                  {multiTopic && <span className="ml-2 text-xs font-normal text-slate-400 no-underline">{q.topicTitle}</span>}
                </Link>
                <LcBadge status={lcStatus(q.lc)} compact />
                <StarToggle on={p.isStarred(q.uid)} onClick={() => p.toggleStar(q.uid)} />
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
              </div>
            ))}
            {g.items.length === 0 && <p className="px-4 py-3 text-sm text-slate-500">All done ✓</p>}
          </Card>
        </section>
      ))}

      {c.problems.length === 0 && (
        <Card className="p-6 text-sm text-slate-600 dark:text-slate-400">
          No problems are linked to this class yet. Practise from{' '}
          {topicTitles(c).map((t, k) => (
            <span key={t.id}>{k > 0 && ' / '}<Link className="font-medium text-indigo-600 hover:underline dark:text-indigo-400" to={`/dsa/${t.id}`}>{t.title}</Link></span>
          ))}
          , or tell Claude the class problems to add them here.
        </Card>
      )}

      <Card className="p-5">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">📄 Notes</h2>
        {c.notes.length ? (
          <ul className="space-y-1 text-sm">
            {c.notes.map((n) => (
              <li key={n} className="flex items-center gap-2">
                <span className="text-slate-400">{n.endsWith('.pdf') ? '📕' : n.endsWith('.md') ? '🔗' : '📘'}</span>
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">{n}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Notes not uploaded yet.</p>
        )}
        <p className="mt-3 text-xs text-slate-500">
          In your <em>Documents / Bosscoder Notes</em> folder ·{' '}
          <a className="text-indigo-600 hover:underline dark:text-indigo-400" href={links.bosscoder} target="_blank" rel="noreferrer">Open on Bosscoder ↗</a>
        </p>
      </Card>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
        {prev ? (
          <Link to={`/classes/${prev.id}`} className="group flex flex-col">
            <span className="text-xs text-slate-400">← Previous</span>
            <span className="font-medium group-hover:text-indigo-600">{prev.code} · {prev.title}</span>
          </Link>
        ) : <span />}
        <span className="hidden text-xs text-slate-400 sm:inline">Tip: use ← → keys</span>
        {next ? (
          <Link to={`/classes/${next.id}`} className="group flex flex-col text-right">
            <span className="text-xs text-slate-400">Next →</span>
            <span className="font-medium group-hover:text-indigo-600">{next.code} · {next.title}</span>
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
