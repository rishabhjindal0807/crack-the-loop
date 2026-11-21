import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { allClasses, classById, current, kindMeta, topicTitles, classWhen } from '../data/classes.js';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { Badge, LcBadge, ProgressBar, StatusButton, StatusPill, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';
import { links } from '../data/profile.js';

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
      if (e.target.closest?.('input, textarea, select, [contenteditable], [role="dialog"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowLeft' && prev) nav(`/classes/${prev.id}`);
      if (e.key === 'ArrowRight' && next) nav(`/classes/${next.id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, nav]);

  if (!c) return <p>Class not found. <Link className="text-indigo-700 underline" to="/classes">See all classes</Link></p>;

  const ids = c.problems.map((q) => q.uid);
  const nextUp = c.problems.find((q) => !p.isDone(q.uid));
  const groups = Object.entries(kindMeta)
    .map(([k, m]) => ({ k, ...m, all: c.problems.filter((q) => q.kind === k) }))
    .map((g) => ({ ...g, items: g.all.filter((q) => !hideDone || !p.isDone(q.uid)) }))
    .filter((g) => g.all.length);
  const multiTopic = new Set(c.problems.map((q) => q.topicId)).size > 1;

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">
          <span className="text-slate-500 dark:text-slate-400">{c.code}</span> {c.title}
        </h1>
        {c.id === current && <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-600/20 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-400/20">Current class</Badge>}
      </div>
      <p className="mt-2 max-w-2xl text-[15px] text-slate-600 dark:text-slate-400">{c.about}</p>
      {c.date && (
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          {c.upcoming ? 'Live class: ' : 'Held on '}
          <span className="font-medium">{classWhen(c)}</span>
          {c.instructor && <> with {c.instructor}</>}
        </p>
      )}
      {c.missed && (
        <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <strong>You missed this class.</strong> Watch the recording on{' '}
          <a className="font-medium underline" href={links.bosscoder} target="_blank" rel="noreferrer">Bosscoder</a>, or read the class notes and the key concepts below, then do the problems.
        </p>
      )}
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        Topic{topicTitles(c).length > 1 ? 's' : ''}:{' '}
        {topicTitles(c).map((t, k) => (
          <span key={t.id}>
            {k > 0 && ', '}
            <Link to={`/dsa/${t.id}`} className="font-medium text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 dark:text-white dark:decoration-slate-600">{t.title}</Link>
          </span>
        ))}
      </p>

      {ids.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="w-64"><ProgressBar value={p.doneCount(ids)} total={ids.length} label={`${c.code} practised`} /></div>
          {nextUp ? (
            <Link to={`/dsa/${nextUp.topicId}/${nextUp.id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
              Start {nextUp.title}
            </Link>
          ) : (
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Every problem in this class is done</span>
          )}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input type="checkbox" checked={hideDone} onChange={(e) => setHideDone(e.target.checked)} className="h-4 w-4 accent-indigo-600" /> Hide practised
          </label>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.k} className="mt-10" aria-labelledby={`k-${g.k}`}>
          <h2 id={`k-${g.k}`} className="text-lg font-semibold text-slate-900 dark:text-white">
            {g.label} <span className="font-normal text-slate-500 dark:text-slate-400">{p.doneCount(g.all.map((q) => q.uid))}/{g.all.length}</span>
          </h2>
          <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {g.items.map((q) => {
              const st = p.status(q.uid);
              return (
                <li key={q.uid} className="flex items-center gap-3 py-2.5">
                  <StatusButton status={st} onClick={() => p.toggleDone(q.uid)} title={q.title} />
                  <Link to={`/dsa/${q.topicId}/${q.id}`} className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">
                    {q.title}
                    {multiTopic && <span className="ml-2 font-normal text-slate-600 dark:text-slate-400">{q.topicTitle}</span>}
                  </Link>
                  {(st === 'revise' || st === 'mastered') && <StatusPill status={st} />}
                  <span className="hidden sm:inline"><LcBadge status={lcStatus(q.lc)} compact /></span>
                  <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                </li>
              );
            })}
            {g.items.length === 0 && <li className="py-3 text-sm text-slate-600 dark:text-slate-400">All practised.</li>}
          </ul>
        </section>
      ))}

      {c.problems.length === 0 && (
        <p className="mt-8 rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
          No problems from this class yet. Send Claude the class problems to add them here. Until then, practise from{' '}
          {topicTitles(c).map((t, k) => (
            <span key={t.id}>{k > 0 && ' or '}<Link className="font-medium text-indigo-700 underline dark:text-indigo-300" to={`/dsa/${t.id}`}>{t.title}</Link></span>
          ))}
          .
        </p>
      )}

      {topicTitles(c).map((t) => (
        <details key={t.id} className="mt-10 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" open={c.problems.length < 3}>
          <summary className="cursor-pointer text-[15px] font-semibold text-slate-900 dark:text-white">Key concepts: {t.title}</summary>
          <div className="mt-3"><Markdown>{t.concepts}</Markdown></div>
        </details>
      ))}

      {(() => {
        const inClass = new Set(ids);
        const more = topicTitles(c).flatMap((t) => t.questions.filter((q) => !inClass.has(`${t.id}/${q.id}`)).map((q) => ({ ...q, uid: `${t.id}/${q.id}`, topicId: t.id })));
        if (!more.length) return null;
        return (
          <section className="mt-10" aria-labelledby="more-practice">
            <h2 id="more-practice" className="text-lg font-semibold text-slate-900 dark:text-white">
              More practice on {topicTitles(c).map((t) => t.title).join(' and ')} <span className="font-normal text-slate-500 dark:text-slate-400">{p.doneCount(more.map((q) => q.uid))}/{more.length}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Not set in this class, but the same ideas.</p>
            <ul className="mt-2 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {more.map((q) => (
                <li key={q.uid} className="flex items-center gap-3 py-2.5">
                  <StatusButton status={p.status(q.uid)} onClick={() => p.toggleDone(q.uid)} title={q.title} />
                  <Link to={`/dsa/${q.topicId}/${q.id}`} className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">{q.title}</Link>
                  <span className="hidden sm:inline"><LcBadge status={lcStatus(q.lc)} compact /></span>
                  <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                </li>
              ))}
            </ul>
          </section>
        );
      })()}

      <section className="mt-10" aria-labelledby="notes-files">
        <h2 id="notes-files" className="text-lg font-semibold text-slate-900 dark:text-white">Class notes</h2>
        {c.notes.length ? (
          <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {c.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Not uploaded yet.</p>
        )}
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          These files are in Documents / Bosscoder Notes on your Mac. The originals are on{' '}
          <a className="font-medium text-indigo-700 underline dark:text-indigo-300" href={links.bosscoder} target="_blank" rel="noreferrer">Bosscoder</a>.
        </p>
      </section>

      <nav aria-label="Other classes" className="mt-12 flex items-center justify-between gap-3 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
        {prev ? (
          <Link to={`/classes/${prev.id}`} className="group min-w-0">
            <span className="block text-xs text-slate-600 dark:text-slate-400">Previous class</span>
            <span className="block truncate font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white">{prev.code} {prev.title}</span>
          </Link>
        ) : <span />}
        <span className="hidden text-xs text-slate-600 sm:inline dark:text-slate-400">Use ← → to move between classes</span>
        {next ? (
          <Link to={`/classes/${next.id}`} className="group min-w-0 text-right">
            <span className="block text-xs text-slate-600 dark:text-slate-400">Next class</span>
            <span className="block truncate font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white">{next.code} {next.title}</span>
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
