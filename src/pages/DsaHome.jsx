import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { topics, allQuestions } from '../data/dsa/index.js';
import { useProgress } from '../lib/progress.js';
import { Badge, LcBadge, PageHeader, ProgressBar, SectionTabs, StatusButton, StatusPill, diffColor, practiceTabs } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';

const chip = (on) =>
  `rounded-full border px-3 py-1 text-sm ${on ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'}`;

export default function DsaHome() {
  const p = useProgress();
  const [query, setQuery] = useState('');
  const [diff, setDiff] = useState('All');
  const [classOnly, setClassOnly] = useState(false);

  const results = useMemo(() => {
    const s = query.trim().toLowerCase();
    if (!s && diff === 'All' && !classOnly) return null;
    return allQuestions.filter(
      (q) =>
        (diff === 'All' || q.difficulty === diff) &&
        (!classOnly || q.from) &&
        (!s || q.title.toLowerCase().includes(s) || q.topicTitle.toLowerCase().includes(s) || (q.tags || []).some((t) => t.includes(s)))
    );
  }, [query, diff, classOnly]);

  const groups = [
    { key: 'notes', title: 'Module 1, in class order' },
    { key: 'curriculum', title: 'Beyond class so far', desc: 'Strings, graphs and JavaScript challenges.' },
  ];

  return (
    <div>
      <SectionTabs label="Practice views" tabs={practiceTabs} />
      <PageHeader title="Practice by topic">
        {allQuestions.length} problems with JavaScript solutions you can run in the browser, from brute force to optimal.
      </PageHeader>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <label htmlFor="dsa-filter" className="sr-only">Filter problems</label>
        <input
          id="dsa-filter"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by name, topic or tag"
          className="mr-2 w-full max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
        />
        {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
          <button key={d} onClick={() => setDiff(d)} aria-pressed={diff === d} className={chip(diff === d)}>{d}</button>
        ))}
        <button onClick={() => setClassOnly((v) => !v)} aria-pressed={classOnly} className={chip(classOnly)}>
          From class ({allQuestions.filter((q) => q.from).length})
        </button>
      </div>

      {results ? (
        <section aria-label="Matching problems">
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">{results.length} problems</p>
          <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {results.map((q) => (
              <li key={q.uid} className="flex items-center gap-3 py-2.5">
                <StatusButton status={p.status(q.uid)} onClick={() => p.toggleDone(q.uid)} title={q.title} />
                <Link to={`/dsa/${q.topicId}/${q.id}`} className="min-w-0 flex-1 truncate text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">
                  {q.title}
                  <span className="ml-2 font-normal text-slate-600 dark:text-slate-400">{q.topicTitle}</span>
                </Link>
                <StatusPill status={p.status(q.uid) === 'revise' || p.status(q.uid) === 'mastered' ? p.status(q.uid) : 'todo'} />
                <span className="hidden sm:inline"><LcBadge status={lcStatus(q.lc)} compact /></span>
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
              </li>
            ))}
          </ul>
          {results.length === 0 && <p className="py-6 text-sm text-slate-600 dark:text-slate-400">No problems match. Try fewer filters.</p>}
        </section>
      ) : (
        groups.map((g) => (
          <section key={g.key} className="mb-12" aria-labelledby={`g-${g.key}`}>
            <h2 id={`g-${g.key}`} className="text-lg font-semibold text-slate-900 dark:text-white">{g.title}</h2>
            {g.desc && <p className="text-sm text-slate-600 dark:text-slate-400">{g.desc}</p>}
            <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {topics
                .filter((t) => t.source === g.key)
                .map((t) => {
                  const ids = t.questions.map((q) => `${t.id}/${q.id}`);
                  return (
                    <li key={t.id}>
                      <Link to={`/dsa/${t.id}`} className="group grid gap-x-8 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_200px] sm:items-center">
                        <span className="min-w-0">
                          <span className="block font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">
                            {t.title}
                            {t.lecture && g.key === 'notes' && <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">{t.lecture}</span>}
                          </span>
                          <span className="mt-0.5 block text-sm text-slate-600 dark:text-slate-400">{t.blurb}</span>
                        </span>
                        <ProgressBar value={p.doneCount(ids)} total={ids.length} label={`${t.title} practised`} />
                      </Link>
                    </li>
                  );
                })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
