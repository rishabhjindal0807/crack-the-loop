import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { allQuestions, topics } from '../data/dsa/index.js';
import { lcSubmissions, lcStatus, lcSnapshotDate, lcProfile } from '../data/leetcode.js';
import { Badge, Card, diffColor } from '../components/ui.jsx';

const accepted = lcSubmissions.filter((s) => s.verdict === 'AC');
const retry = lcSubmissions.filter((s) => s.verdict !== 'AC');

// First site problem for each LeetCode slug (several topics can share one, e.g. Subsets).
const siteBySlug = new Map();
for (const q of allQuestions) if (q.lc && !siteBySlug.has(q.lc)) siteBySlug.set(q.lc, q);

const ring = (pct, color) => ({
  background: `conic-gradient(${color} ${pct * 3.6}deg, rgb(148 163 184 / 0.25) 0deg)`,
});

function Stat({ label, value, sub, className = '' }) {
  return (
    <div className={`rounded-2xl bg-white/10 px-4 py-3 ${className}`}>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs font-medium text-orange-100">{label}</div>
      {sub && <div className="mt-0.5 text-[11px] text-orange-200/80">{sub}</div>}
    </div>
  );
}

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

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-orange-100">My LeetCode · snapshot {lcSnapshotDate}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight">{accepted.length} problems solved</h1>
            <p className="mt-1 max-w-xl text-sm text-orange-50/90">
              Every problem below links to the matching write-up on this site — with brute-force → optimal JavaScript you can run.
            </p>
            <a href={lcProfile} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-lg bg-white/20 px-3 py-1.5 text-sm hover:bg-white/30">
              Open my LeetCode profile ↗
            </a>
          </div>
          <div className="relative h-32 w-32 shrink-0 rounded-full p-2" style={ring(acceptance, 'white')}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-orange-500/90">
              <span className="text-2xl font-bold">{acceptance}%</span>
              <span className="text-[11px] text-orange-100">accepted</span>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {byDiff.map(({ d, n }) => (
            <Stat key={d} label={d} value={n} />
          ))}
          <Stat label="To retry" value={retry.length} sub="WA / TLE" />
          <Stat label="Class problems done" value={`${classDone.length}/${classLc.length}`} sub="Bosscoder Module 1" />
        </div>
      </section>

      {/* Retry */}
      {retry.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold">↻ Needs another try</h2>
          <p className="mb-3 text-sm text-slate-500">Open the write-up, hit “Run tests” to see edge cases, then resubmit.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {retry.map((s) => {
              const q = siteBySlug.get(s.slug);
              return (
                <Card key={s.slug} className="border-orange-200 p-5 dark:border-orange-500/30">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold">
                      {s.num}. {s.title}
                    </h3>
                    <Badge className={diffColor[s.difficulty]}>{s.difficulty}</Badge>
                  </div>
                  <p className="mt-1 text-sm font-medium text-orange-600 dark:text-orange-400">Last result: {s.verdictLabel}</p>
                  <div className="mt-4 flex gap-2 text-sm">
                    {q && (
                      <Link to={`/dsa/${q.topicId}/${q.id}`} className="rounded-lg bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700">
                        Review solution
                      </Link>
                    )}
                    <a href={s.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 px-3 py-1.5 hover:border-orange-300 dark:border-slate-700">
                      Retry on LeetCode ↗
                    </a>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-5">
        {/* Topic coverage */}
        <Card className="p-6 lg:col-span-3">
          <h2 className="font-semibold">Coverage by topic</h2>
          <p className="mb-4 text-sm text-slate-500">Problems on this site that are on LeetCode, and how many you’ve solved there.</p>
          <div className="space-y-2.5">
            {topicRows.map(({ t, total, solved }) => (
              <Link key={t.id} to={`/dsa/${t.id}`} className="group grid grid-cols-[1fr_auto] items-center gap-3 sm:grid-cols-[14rem_1fr_auto]">
                <span className="truncate text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {t.icon} {t.title}
                </span>
                <span className="hidden h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 sm:block">
                  <span className="block h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-400" style={{ width: `${(solved / total) * 100}%` }} />
                </span>
                <span className="text-xs tabular-nums text-slate-500">
                  {solved}/{total}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Next up */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold">Next up from class</h2>
          <p className="mb-3 text-sm text-slate-500">Bosscoder problems you haven’t submitted on LeetCode yet — easiest first.</p>
          <ul className="space-y-2">
            {nextUp.slice(0, 10).map((q) => (
              <li key={q.uid} className="flex items-center justify-between gap-2 text-sm">
                <Link to={`/dsa/${q.topicId}/${q.id}`} className="min-w-0 truncate hover:text-indigo-600 dark:hover:text-indigo-400">
                  {q.title}
                </Link>
                <span className="flex shrink-0 items-center gap-2">
                  <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                  <a href={`https://leetcode.com/problems/${q.lc}/`} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-orange-500">
                    ↗
                  </a>
                </span>
              </li>
            ))}
          </ul>
          {nextUp.length > 10 && <p className="mt-3 text-xs text-slate-500">+ {nextUp.length - 10} more in the DSA section</p>}
        </Card>
      </section>

      {/* Full list */}
      <section>
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">All submissions ({lcSubmissions.length})</h2>
          <div className="flex flex-wrap gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title or #"
              className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-orange-400 dark:border-slate-700 dark:bg-slate-900"
            />
            {['All', 'Easy', 'Medium', 'Hard', 'To retry'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-xl border px-3 py-1.5 text-sm ${filter === f ? 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' : 'border-slate-200 dark:border-slate-700'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <Card className="divide-y divide-slate-100 dark:divide-slate-800">
          {table.map((s) => {
            const q = siteBySlug.get(s.slug);
            return (
              <div key={s.slug} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                <span className={`w-5 text-center ${s.verdict === 'AC' ? 'text-emerald-500' : 'text-orange-500'}`}>{s.verdict === 'AC' ? '✓' : '↻'}</span>
                <span className="w-12 tabular-nums text-slate-400">#{s.num}</span>
                <a href={s.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate font-medium hover:text-orange-600">
                  {s.title}
                </a>
                {q ? (
                  <Link to={`/dsa/${q.topicId}/${q.id}`} className="hidden shrink-0 text-xs text-indigo-600 hover:underline dark:text-indigo-400 sm:inline">
                    {q.topicTitle.split(/[,&(]/)[0].trim()} →
                  </Link>
                ) : (
                  <span className="hidden text-xs text-slate-400 sm:inline">—</span>
                )}
                {s.verdict !== 'AC' && <span className="hidden text-xs text-orange-600 md:inline">{s.verdictLabel}</span>}
                <Badge className={diffColor[s.difficulty]}>{s.difficulty}</Badge>
              </div>
            );
          })}
          {table.length === 0 && <p className="px-4 py-6 text-sm text-slate-500">No matches.</p>}
        </Card>
        <p className="mt-2 text-xs text-slate-500">
          To update after solving more: add a row in <code>src/data/leetcode.js</code> and push — the site redeploys automatically.
        </p>
      </section>
    </div>
  );
}
