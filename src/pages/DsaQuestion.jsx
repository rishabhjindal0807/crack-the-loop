import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { topicById } from '../data/dsa/index.js';
import TopicSidebar from '../components/TopicSidebar.jsx';
import Markdown from '../lib/Markdown.jsx';
import MathMarkdown from '../lib/MathMarkdown.jsx';
import CodeBlock from '../components/CodeBlock.jsx';
import LinkedListVisual from '../components/LinkedListVisual.jsx';
import { figures } from '../components/ProofFigures.jsx';
import { useProgress } from '../lib/progress.js';
import { runTests } from '../lib/runner.js';
import { dedent } from '../lib/Markdown.jsx';
import { Badge, Card, LcBadge, NotesBox, StatusControl, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';
import { lcUrl } from './DsaTopic.jsx';
import { classOfQuestion, classById } from '../data/classes.js';

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
        className="rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Run tests
      </button>
      {results && (
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 text-xs dark:border-slate-800">
          <div aria-live="polite" className={`px-3 py-2 font-semibold ${passed === results.length ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300'}`}>
            {passed}/{results.length} passed
          </div>
          {results.map((r, i) => (
            <div key={i} className="grid gap-1 border-t border-slate-100 px-3 py-2 font-mono dark:border-slate-800 sm:grid-cols-[auto_1fr]">
              <span className={`font-sans font-semibold ${r.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{r.ok ? 'Pass' : 'Fail'}</span>
              <span className="space-y-0.5 break-all">
                {r.args !== undefined && <span className="block text-slate-600 dark:text-slate-400">input: {fmt(r.args)}</span>}
                <span className="block">got: {fmt(r.got)}</span>
                {!r.ok && <span className="block text-slate-600 dark:text-slate-400">expected: {fmt(r.expected)}</span>}
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
  const [vtab, setVtab] = useState(0);
  const p = useProgress();
  if (!q) return <p>Problem not found. <Link className="text-indigo-700 underline" to="/dsa">See all topics</Link></p>;

  const uid = `${t.id}/${q.id}`;
  const visuals = q.visual ? (Array.isArray(q.visual) ? q.visual : [q.visual]) : [];
  const vi = Math.min(vtab, Math.max(0, visuals.length - 1));
  const active = tab !== null && tab < q.approaches.length ? tab : q.approaches.length - 1;
  const ap = q.approaches[active];
  const prev = t.questions[idx - 1];
  const next = t.questions[idx + 1];
  const cls = q.from ? classById[classOfQuestion(q)] : null;
  const lc = lcStatus(q.lc);
  const H2 = ({ children, id }) => <h2 id={id} className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">{children}</h2>;

  return (
    <div className="flex gap-10">
      <TopicSidebar />
      <article className="min-w-0 flex-1 space-y-10" key={uid}>
        <header>
          <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400">
            <Link to="/dsa" className="hover:text-slate-900 dark:hover:text-white">Practice</Link>
            <span aria-hidden="true"> / </span>
            <Link to={`/dsa/${t.id}`} className="hover:text-slate-900 dark:hover:text-white">{t.title}</Link>
          </nav>
          <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">{q.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
            {q.from && (cls ? (
              <Link to={`/classes/${cls.id}`} className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900 dark:decoration-slate-600 dark:hover:text-white">{q.from}</Link>
            ) : <span>{q.from}</span>)}
            {lc ? <LcBadge status={lc} /> : q.lc && (
              <a href={lcUrl(q.lc)} target="_blank" rel="noreferrer" className="font-medium text-indigo-700 hover:underline dark:text-indigo-300">
                {q.lc.includes('geeksforgeeks') ? 'Practise on GfG' : 'Solve on LeetCode'}
              </a>
            )}
            {(q.tags || []).length > 0 && <span>{q.tags.map((tg) => `#${tg}`).join('  ')}</span>}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <StatusControl status={p.status(uid)} onChange={(st) => p.setStatus(uid, st)} name={`st-${uid}`} />
            {p.note(uid) && <a href="#notes" onClick={(e) => { e.preventDefault(); document.getElementById('notes')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">You have notes on this</a>}
          </div>
        </header>

        {lc && lc.verdict !== 'AC' && (
          <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
            <strong>Your last LeetCode submission: {lc.verdictLabel}.</strong>{' '}
            {lc.verdict === 'TLE'
              ? 'Compare your approach’s complexity with the optimal one below; the constraints usually rule out the brute force.'
              : 'Run the tests below and check the edge cases in the explanation, then resubmit.'}
          </p>
        )}

        <section aria-labelledby="problem">
          <H2 id="problem">Problem</H2>
          <Markdown>{q.statement}</Markdown>
        </section>

        {visuals.length > 0 && (
          <section aria-labelledby="visual">
            <H2 id="visual">Step by step</H2>
            <Card className="p-5">
              {visuals.length > 1 && (
                <div role="tablist" aria-label="Diagrams" className="mb-4 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
                  {visuals.map((v, k) => (
                    <button key={k} role="tab" aria-selected={k === vi} onClick={() => setVtab(k)}
                      className={`rounded-md px-3 py-1.5 text-sm ${k === vi ? 'bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                      {v.tab || `Diagram ${k + 1}`}
                    </button>
                  ))}
                </div>
              )}
              {visuals[vi].title && <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">{visuals[vi].title}</p>}
              <LinkedListVisual key={`${uid}-${vi}`} visual={visuals[vi]} uid={`${uid}-${vi}`} />
            </Card>
          </section>
        )}

        <section aria-labelledby="solutions">
          <H2 id="solutions">Solutions</H2>
          <div role="tablist" aria-label="Approaches" className="mb-5 flex gap-6 overflow-x-auto border-b border-slate-200 dark:border-slate-800">
            {q.approaches.map((a, i) => (
              <button key={a.name} role="tab" aria-selected={i === active} onClick={() => setTab(i)}
                className={`-mb-px whitespace-nowrap border-b-2 py-2.5 text-sm font-medium ${i === active ? 'border-indigo-600 text-slate-900 dark:border-indigo-400 dark:text-white' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
                {a.name}
              </button>
            ))}
          </div>
          <dl className="mb-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <div className="flex gap-1.5"><dt className="text-slate-600 dark:text-slate-400">Time</dt><dd className="font-medium text-slate-900 dark:text-white">{ap.time}</dd></div>
            <div className="flex gap-1.5"><dt className="text-slate-600 dark:text-slate-400">Space</dt><dd className="font-medium text-slate-900 dark:text-white">{ap.space}</dd></div>
          </dl>
          {ap.idea && <Markdown className="mb-2">{ap.idea}</Markdown>}
          <CodeBlock code={ap.code} />
          <TestRunner q={q} code={ap.code} />
        </section>

        {q.math && (
          <section aria-labelledby="proof">
            <H2 id="proof">Why it works</H2>
            {q.math.figure && figures[q.math.figure] && (
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                {(() => { const F = figures[q.math.figure]; return <F />; })()}
              </div>
            )}
            <MathMarkdown className="prose-table:mx-auto prose-table:w-auto prose-th:px-6 prose-td:px-6">{q.math.body}</MathMarkdown>
          </section>
        )}

        {q.explanation && (
          <section aria-labelledby="tips">
            <H2 id="tips">Interview notes</H2>
            <Markdown>{q.explanation}</Markdown>
          </section>
        )}

        <section id="notes" aria-label="Your notes" className="scroll-mt-20 rounded-xl bg-slate-50 p-5 dark:bg-slate-900">
          <NotesBox id={uid} value={p.note(uid)} onSave={(text) => p.setNote(uid, text)} />
        </section>

        <nav aria-label="More problems in this topic" className="flex justify-between gap-4 border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
          {prev ? (
            <Link to={`/dsa/${t.id}/${prev.id}`} className="group min-w-0">
              <span className="block text-xs text-slate-600 dark:text-slate-400">Previous</span>
              <span className="block truncate font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/dsa/${t.id}/${next.id}`} className="group min-w-0 text-right">
              <span className="block text-xs text-slate-600 dark:text-slate-400">Next</span>
              <span className="block truncate font-medium text-slate-900 group-hover:text-indigo-700 dark:text-white">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>
      </article>
    </div>
  );
}
