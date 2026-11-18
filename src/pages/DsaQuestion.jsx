import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { topicById } from '../data/dsa/index.js';
import TopicSidebar from '../components/TopicSidebar.jsx';
import Markdown from '../lib/Markdown.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import { useProgress } from '../lib/progress.js';
import { runTests } from '../lib/runner.js';
import { dedent } from '../lib/Markdown.jsx';
import { Badge, Card, DoneToggle, LcBadge, StarToggle, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';
import { lcUrl } from './DsaTopic.jsx';

const fmt = (v) => {
  const s = typeof v === 'string' ? v : JSON.stringify(v);
  return s && s.length > 160 ? s.slice(0, 160) + '…' : s;
};

function TestRunner({ q, code }) {
  const [results, setResults] = useState(null);
  if (!q.tests?.length) return null;
  const passed = results?.filter((r) => r.ok).length;
  return (
    <div className="mt-3">
      <button
        onClick={() => setResults(runTests(q, dedent(code)))}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
      >
        ▶ Run tests
      </button>
      {results && (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 text-xs dark:border-slate-800">
          <div className={`px-3 py-2 font-semibold ${passed === results.length ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'}`}>
            {passed}/{results.length} passed
          </div>
          {results.map((r, i) => (
            <div key={i} className="grid gap-1 border-t border-slate-100 px-3 py-2 font-mono dark:border-slate-800 sm:grid-cols-[auto_1fr]">
              <span>{r.ok ? '✅' : '❌'}</span>
              <span className="space-y-0.5 break-all">
                {r.args !== undefined && <span className="block text-slate-500">input: {fmt(r.args)}</span>}
                <span className="block">got: {fmt(r.got)}</span>
                {!r.ok && <span className="block text-slate-500">expected: {fmt(r.expected)}</span>}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DsaQuestion() {
  const { topicId, qid } = useParams();
  const t = topicById[topicId];
  const idx = t ? t.questions.findIndex((q) => q.id === qid) : -1;
  const q = idx >= 0 ? t.questions[idx] : null;
  const [tab, setTab] = useState(null);
  const p = useProgress();
  if (!q) return <p>Problem not found. <Link className="text-indigo-600" to="/dsa">Back to DSA</Link></p>;

  const uid = `${t.id}/${q.id}`;
  const active = tab !== null && tab < q.approaches.length ? tab : q.approaches.length - 1;
  const ap = q.approaches[active];
  const prev = t.questions[idx - 1];
  const next = t.questions[idx + 1];

  return (
    <div className="flex gap-8">
      <TopicSidebar />
      <div className="min-w-0 flex-1 space-y-5" key={uid}>
        <div className="text-sm text-slate-500">
          <Link to="/dsa" className="hover:text-indigo-600">DSA</Link> / <Link to={`/dsa/${t.id}`} className="hover:text-indigo-600">{t.title}</Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <DoneToggle done={p.isDone(uid)} onClick={() => p.toggleDone(uid)} />
          <h1 className="text-2xl font-bold tracking-tight">{q.title}</h1>
          <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
          <StarToggle on={p.isStarred(uid)} onClick={() => p.toggleStar(uid)} />
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {q.from && <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">📒 {q.from}</Badge>}
          {(q.tags || []).map((tg) => (
            <Badge key={tg} className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">#{tg}</Badge>
          ))}
          <LcBadge status={lcStatus(q.lc)} />
          {q.lc && !lcStatus(q.lc) && (
            <a href={lcUrl(q.lc)} target="_blank" rel="noreferrer" className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-700 hover:bg-amber-200 dark:bg-amber-500/15 dark:text-amber-300">
              {q.lc.includes('geeksforgeeks') ? 'Practice on GfG ↗' : 'Solve on LeetCode ↗'}
            </a>
          )}
        </div>

        {lcStatus(q.lc) && lcStatus(q.lc).verdict !== 'AC' && (
          <Card className="border-orange-200 bg-orange-50/60 p-4 text-sm dark:border-orange-500/30 dark:bg-orange-500/5">
            <strong className="text-orange-700 dark:text-orange-300">Your last LeetCode submission: {lcStatus(q.lc).verdictLabel}.</strong>{' '}
            {lcStatus(q.lc).verdict === 'TLE'
              ? 'Compare your approach’s complexity with the optimal one below — the constraints usually rule out the brute force.'
              : 'Run the tests below and check the edge cases in the explanation, then resubmit.'}
          </Card>
        )}

        <Card className="p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Problem</h2>
          <Markdown>{q.statement}</Markdown>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            {q.approaches.map((a, i) => (
              <button
                key={a.name}
                onClick={() => setTab(i)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${i === active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'}`}
              >
                {a.name}
              </button>
            ))}
          </div>
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            <Badge className="bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">Time: {ap.time}</Badge>
            <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">Space: {ap.space}</Badge>
          </div>
          {ap.idea && <Markdown className="mb-2">{ap.idea}</Markdown>}
          <CodeBlock code={ap.code} />
          <TestRunner q={q} code={ap.code} />
        </Card>

        {q.explanation && (
          <Card className="p-6">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Explanation & interview tips</h2>
            <Markdown>{q.explanation}</Markdown>
          </Card>
        )}

        <div className="flex justify-between gap-4 text-sm">
          {prev ? <Link to={`/dsa/${t.id}/${prev.id}`} className="rounded-lg border border-slate-200 px-3 py-2 hover:border-indigo-300 dark:border-slate-800">← {prev.title}</Link> : <span />}
          {next ? <Link to={`/dsa/${t.id}/${next.id}`} className="rounded-lg border border-slate-200 px-3 py-2 hover:border-indigo-300 dark:border-slate-800">{next.title} →</Link> : <span />}
        </div>
      </div>
    </div>
  );
}
