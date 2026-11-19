import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allQuestions, topics } from '../data/dsa/index.js';
import { lcSubmissions, lcStatus, lcSnapshotDate, lcProfile } from '../data/leetcode.js';
import { Badge, PageHeader, ProgressBar, SectionTabs, diffColor, practiceTabs } from '../components/ui.jsx';

const accepted = lcSubmissions.filter((s) => s.verdict === 'AC');
const retry = lcSubmissions.filter((s) => s.verdict !== 'AC');

// First site problem for each LeetCode slug (several topics can share one, e.g. Subsets).
const siteBySlug = new Map();
for (const q of allQuestions) if (q.lc && !siteBySlug.has(q.lc)) siteBySlug.set(q.lc, q);

export default function LeetCode() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');

  const byDiff = ['Easy', 'Medium', 'Hard'].map((d) => ({ d, n: accepted.filter((s) => s.difficulty === d).length }));
  const acceptance = Math.round((accepted.length / lcSubmissions.length) * 100);

  // Class (Bosscoder) problems that exist on LeetCode
  const classLc = useMemo(() => {
    const seen = new Set();
    return allQuestions.filter((q) => q.from && q.lc && !q.lc.startsWith('http') && !seen.has(q.lc) && seen.add(q.lc));
  }, []);
  const classDone = classLc.filter((q) => lcStatus(q.lc)?.verdict === 'AC');
  const nextUp = classLc
    .filter((q) => lcStatus(q.lc)?.verdict !== 'AC')
    .sort((a, b) => ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty) - ['Easy', 'Medium', 'Hard'].indexOf(b.difficulty));

  const topicRows = topics
    .map((t) => {
      const lcQs = t.questions.filter((q) => q.lc && !q.lc.startsWith('http'));
      const solved = lcQs.filter((q) => lcStatus(q.lc)?.verdict === 'AC').length;
      return { t, total: lcQs.length, solved };
    })
    .filter((r) => r.total);

  const table = lcSubmissions.filter(
    (s) =>
      (filter === 'All' || (filter === 'To retry' ? s.verdict !== 'AC' : s.difficulty === filter)) &&
      (!query || s.title.toLowerCase().includes(query.toLowerCase()) || String(s.num) === query.trim())
  );

  const row = 'divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800';
  const chip = (on) =>
    `rounded-full border px-3 py-1 text-sm ${on ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'}`;

  return (
    <div>
      <SectionTabs label="Practice views" tabs={practiceTabs} />
      <PageHeader
        title="LeetCode history"
        actions={<a href={lcProfile} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Open your LeetCode profile</a>}
      >
        Snapshot from {lcSnapshotDate}. Every submission links to its write-up here, so you can review the solution and run the tests.
      </PageHeader>

      <dl className="mb-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        {[
          ['Solved', accepted.length],
          ...byDiff.map(({ d, n }) => [d, n]),
          ['Acceptance', `${acceptance}%`],
          ['Class problems solved', `${classDone.length}/${classLc.length}`],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm text-slate-600 dark:text-slate-400">{label}</dt>
            <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{value}</dd>
          </div>
        ))}
      </dl>

      {retry.length > 0 && (
        <section className="mb-12" aria-labelledby="lc-retry">
          <h2 id="lc-retry" className="text-lg font-semibold text-slate-900 dark:text-white">Needs another try</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Open the write-up, run the tests to find the failing edge case, then resubmit.</p>
          <ul className={`mt-3 ${row}`}>
            {retry.map((s) => {
              const q = siteBySlug.get(s.slug);
              return (
                <li key={s.slug} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3">
                  <span className="min-w-0 flex-1 text-sm">
                    <span className="font-medium text-slate-900 dark:text-white">{s.num}. {s.title}</span>
                    <span className="block text-xs text-amber-800 dark:text-amber-300">Last result: {s.verdictLabel}</span>
                  </span>
                  <Badge className={diffColor[s.difficulty]}>{s.difficulty}</Badge>
                  {q && <Link to={`/dsa/${q.topicId}/${q.id}`} className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Review solution</Link>}
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-700 hover:underline dark:text-slate-300">Retry on LeetCode</a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mb-12 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="lc-cov">
          <h2 id="lc-cov" className="text-lg font-semibold text-slate-900 dark:text-white">Coverage by topic</h2>
          <p className="mb-4 mt-1 text-sm text-slate-600 dark:text-slate-400">Problems on this site that exist on LeetCode, and how many you've solved there.</p>
          <ul className="space-y-3">
            {topicRows.map(({ t, total, solved }) => (
              <li key={t.id}>
                <Link to={`/dsa/${t.id}`} className="group grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[13rem_1fr]">
                  <span className="truncate text-sm text-slate-900 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{t.title}</span>
                  <ProgressBar value={solved} total={total} label={`${t.title} solved on LeetCode`} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="lc-next">
          <h2 id="lc-next" className="text-lg font-semibold text-slate-900 dark:text-white">Class problems not on LeetCode yet</h2>
          <p className="mb-3 mt-1 text-sm text-slate-600 dark:text-slate-400">Easiest first.</p>
          <ul className={row}>
            {nextUp.slice(0, 10).map((q) => (
              <li key={q.uid} className="flex items-center gap-3 py-2.5 text-sm">
                <Link to={`/dsa/${q.topicId}/${q.id}`} className="min-w-0 flex-1 truncate font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">{q.title}</Link>
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                <a href={`https://leetcode.com/problems/${q.lc}/`} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300" aria-label={`Solve ${q.title} on LeetCode`}>Solve</a>
              </li>
            ))}
          </ul>
          {nextUp.length > 10 && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{nextUp.length - 10} more in Practice by class.</p>}
        </section>
      </div>

      <section aria-labelledby="lc-all">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 id="lc-all" className="text-lg font-semibold text-slate-900 dark:text-white">All submissions <span className="font-normal text-slate-500 dark:text-slate-400">{lcSubmissions.length}</span></h2>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor="lc-q" className="sr-only">Filter submissions</label>
            <input id="lc-q" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Title or number"
              className="w-40 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900" />
            {['All', 'Easy', 'Medium', 'Hard', 'To retry'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={chip(filter === f)}>{f}</button>
            ))}
          </div>
        </div>
        <ul className={row}>
          {table.map((s) => {
            const q = siteBySlug.get(s.slug);
            return (
              <li key={s.slug} className="flex items-center gap-3 py-2.5 text-sm">
                <span className="w-12 shrink-0 tabular-nums text-slate-600 dark:text-slate-400">{s.num}</span>
                <a href={s.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate font-medium text-slate-900 hover:underline dark:text-white">{s.title}</a>
                {q && <Link to={`/dsa/${q.topicId}/${q.id}`} className="hidden shrink-0 text-indigo-700 hover:underline sm:inline dark:text-indigo-300">Write-up</Link>}
                {s.verdict !== 'AC' && <span className="shrink-0 text-xs text-amber-800 dark:text-amber-300">{s.verdictLabel}</span>}
                <Badge className={diffColor[s.difficulty]}>{s.difficulty}</Badge>
              </li>
            );
          })}
          {table.length === 0 && <li className="py-6 text-sm text-slate-600 dark:text-slate-400">No submissions match.</li>}
        </ul>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          To update after solving more, send Claude the problem, or add a row in <code>src/data/leetcode.js</code>; the site redeploys on push.
        </p>
      </section>
    </div>
  );
}
