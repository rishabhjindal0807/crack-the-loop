import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { topics, allQuestions } from '../data/dsa/index.js';
import { useProgress } from '../lib/progress.js';
import { Card, ProgressBar, Badge, LcBadge, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';
import { links } from '../data/profile.js';

export default function DsaHome() {
  const p = useProgress();
  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState('All');
  const [notesOnly, setNotesOnly] = useState(false);

  const results = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s && diff === 'All' && !notesOnly) return null;
    return allQuestions.filter(
      (q) =>
        (diff === 'All' || q.difficulty === diff) &&
        (!notesOnly || q.from) &&
        (!s || q.title.toLowerCase().includes(s) || q.topicTitle.toLowerCase().includes(s) || (q.tags || []).some((t) => t.includes(s)))
    );
  }, [query, diff, notesOnly]);

  const groups = [
    { key: 'notes', title: 'Bosscoder Module 1 — in class order', desc: 'All 20 lectures + 8 IL sessions of Master Problem Solving in DS & Algo (EV-21A): every class and homework problem re-solved in JavaScript. 📒 marks the lecture it came from.' },
    { key: 'curriculum', title: 'Not covered in class yet', desc: 'Strings and graphs — classic interview problems to get ahead.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Structures & Algorithms</h1>
          <p className="mt-1 text-sm text-slate-500">
            {allQuestions.length} problems · JavaScript solutions with brute-force → optimal walkthroughs · hit “Run tests” to execute them in your browser
          </p>
        </div>
        <a href={links.leetcode} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
          Your LeetCode profile ↗
        </a>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search problems, topics, tags…"
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-500/20"
        />
        {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDiff(d)}
            className={`rounded-xl border px-3 py-2 text-sm ${diff === d ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700'}`}
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => setNotesOnly((v) => !v)}
          className={`rounded-xl border px-3 py-2 text-sm ${notesOnly ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'border-slate-200 dark:border-slate-700'}`}
        >
          📒 Bosscoder notes only ({allQuestions.filter((q) => q.from).length})
        </button>
      </div>

      {results ? (
        <Card className="divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((q) => (
            <Link key={q.uid} to={`/dsa/${q.topicId}/${q.id}`} className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <span className="flex items-center gap-2">
                {p.isDone(q.uid) && <span className="text-emerald-500">✓</span>}
                <span className="font-medium">{q.title}</span>
                <span className="text-xs text-slate-500">· {q.topicTitle}</span>
                {q.from && <span className="hidden text-xs text-indigo-500 sm:inline">📒 {q.from}</span>}
              </span>
              <span className="flex items-center gap-2">
                <LcBadge status={lcStatus(q.lc)} compact />
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
              </span>
            </Link>
          ))}
          {results.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">No matches.</p>}
        </Card>
      ) : (
        groups.map((g) => (
          <section key={g.key}>
            <h2 className="text-lg font-semibold">{g.title}</h2>
            <p className="mb-4 text-sm text-slate-500">{g.desc}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics
                .filter((t) => t.source === g.key)
                .map((t) => {
                  const ids = t.questions.map((q) => `${t.id}/${q.id}`);
                  return (
                    <Link key={t.id} to={`/dsa/${t.id}`} className="group">
                      <Card className="h-full p-5 transition group-hover:border-indigo-300 group-hover:shadow-md dark:group-hover:border-indigo-500/50">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">{t.title}</h3>
                          <span className="text-xl">{t.icon}</span>
                        </div>
                        {t.lecture && <p className="mt-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">{t.lecture}</p>}
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{t.blurb}</p>
                        <div className="mt-4">
                          <ProgressBar value={p.doneCount(ids)} total={ids.length} />
                        </div>
                      </Card>
                    </Link>
                  );
                })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
