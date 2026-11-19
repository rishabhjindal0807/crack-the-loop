import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { allOpps, nextRound, prepTasks, RESULTS, resultLabel, whenLabel } from '../lib/opps.js';
import { genericReady } from '../data/opportunities.js';
import { itemById } from '../data/items.js';
import { Card, NotesBox, ProgressBar, StatusPill } from '../components/ui.jsx';

const field = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';

function H2({ id, children, sub }) {
  return (
    <div className="mb-4">
      <h2 id={id} className="scroll-mt-20 text-xl font-semibold text-slate-900 dark:text-white">{children}</h2>
      {sub && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{sub}</p>}
    </div>
  );
}

function StudyLinks({ links, p }) {
  if (!links?.length) return null;
  return (
    <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
      {links.map((l) => {
        if (typeof l !== 'string') {
          return <li key={l.url}><a href={l.url} target="_blank" rel="noreferrer" className="font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">{l.title}</a></li>;
        }
        const it = itemById.get(l);
        if (!it) return null;
        return (
          <li key={l} className="flex items-center gap-2">
            <Link to={it.to} className="font-medium text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">{it.title}</Link>
            <StatusPill status={p.status(l)} />
          </li>
        );
      })}
    </ul>
  );
}

function Check({ checked, onChange, children, id }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded accent-indigo-600" />
      <span className={`text-[15px] leading-relaxed ${checked ? 'text-slate-500 line-through decoration-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{children}</span>
    </label>
  );
}

function Rounds({ o, p }) {
  const [editing, setEditing] = useState(null); // index being edited, or 'new'
  const [draft, setDraft] = useState(null);
  const save = (rounds) => (o.local ? p.saveOppLocal({ ...o, rounds }) : p.saveOppRounds(o.id, rounds));
  const start = (i) => {
    setEditing(i);
    setDraft(i === 'new' ? { id: `r${Date.now().toString(36)}`, name: `Round ${o.rounds.length + 1}`, date: '', time: '', type: '', withWhom: '', result: 'upcoming' } : { ...o.rounds[i] });
  };
  const commit = (e) => {
    e.preventDefault();
    const rounds = editing === 'new' ? [...o.rounds, draft] : o.rounds.map((r, i) => (i === editing ? draft : r));
    save(rounds);
    setEditing(null);
  };
  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));

  return (
    <div>
      <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
        {o.rounds.map((r, i) => (
          <li key={r.id} className="py-4">
            {editing === i ? null : (
              <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900 dark:text-white">{r.name}</p>
                  <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-300">{whenLabel(r.date, r.time)}</p>
                  <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                    {[r.type || 'Type of round not known yet', r.withWhom ? `with ${r.withWhom}` : 'interviewer not known yet'].join(', ')}
                  </p>
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{resultLabel[r.result]}</span>
                <div className="flex gap-3 text-sm">
                  <button onClick={() => start(i)} className="font-medium text-indigo-700 hover:underline dark:text-indigo-300">Edit</button>
                  <Link to={`/interviews?new=1&company=${encodeURIComponent(o.company)}&round=${encodeURIComponent(r.name)}`} className="font-medium text-indigo-700 hover:underline dark:text-indigo-300">Log a question</Link>
                </div>
              </div>
            )}
            {editing === i && <RoundForm draft={draft} set={set} onSubmit={commit} onCancel={() => setEditing(null)} onDelete={o.rounds.length > 1 ? () => { save(o.rounds.filter((_, k) => k !== i)); setEditing(null); } : null} />}
          </li>
        ))}
        {editing === 'new' && <li className="py-4"><RoundForm draft={draft} set={set} onSubmit={commit} onCancel={() => setEditing(null)} /></li>}
      </ul>
      {editing === null && (
        <button onClick={() => start('new')} className="mt-3 text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Add the next round</button>
      )}
    </div>
  );
}

function RoundForm({ draft, set, onSubmit, onCancel, onDelete }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2" aria-label="Round details">
      {[
        ['name', 'Round name', 'text', 'Round 1'],
        ['date', 'Date', 'date'],
        ['time', 'Time', 'time'],
        ['type', 'Type of round', 'text', 'e.g. Founder chat, system design, coding'],
        ['withWhom', 'With whom', 'text', 'e.g. Hitesh Ganjoo, CEO'],
      ].map(([k, label, type, ph]) => (
        <div key={k}>
          <label htmlFor={`rd-${k}`} className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">{label}</label>
          <input id={`rd-${k}`} type={type} value={draft[k] || ''} onChange={set(k)} placeholder={ph} className={field} />
        </div>
      ))}
      <div>
        <label htmlFor="rd-result" className="mb-1 block text-sm font-medium text-slate-900 dark:text-slate-100">Result</label>
        <select id="rd-result" value={draft.result} onChange={set('result')} className={field}>
          {RESULTS.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
        </select>
      </div>
      <div className="flex flex-wrap gap-2 sm:col-span-2">
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Save round</button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
        {onDelete && <button type="button" onClick={onDelete} className="ml-auto rounded-lg px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10">Remove round</button>}
      </div>
    </form>
  );
}

export default function InterviewPrep() {
  const { oppId } = useParams();
  const nav = useNavigate();
  const p = useProgress();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const o = allOpps(p).find((x) => x.id === oppId);
  if (!o) return <p>Interview not found. <Link to="/interviews" className="text-indigo-700 underline">See all interviews</Link></p>;

  const tasks = prepTasks(o);
  const done = tasks.filter((k) => p.prepDone(k)).length;
  const next = nextRound(o);
  const asked = p.interviews().filter((x) => (x.company || '').toLowerCase() === o.company.toLowerCase());
  const sections = o.tailored
    ? [['rounds', 'Rounds'], ['plan', 'Prep plan'], ['company', 'The company'], ['want', 'What they want'], ['match', 'Your match'], ['gaps', 'Gaps to fill'], ['likely', 'Likely questions'], ['ask', 'Ask them'], ['ready', 'Have ready'], ['jd', 'Job description']]
    : [['rounds', 'Rounds'], ['ready', 'Have ready'], ['jd', 'Job description']];

  return (
    <div className="max-w-4xl">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400">
        <Link to="/interviews" className="hover:text-slate-900 dark:hover:text-white">Interviews</Link>
      </nav>
      <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">{o.company}</h1>
      <p className="mt-1 text-[17px] text-slate-700 dark:text-slate-300">{o.role}</p>
      <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
        {[['Where', o.location], ['Experience asked', o.experience], ['Found via', o.source]].filter(([, v]) => v).map(([k, v]) => (
          <div key={k}>
            <dt className="text-slate-600 dark:text-slate-400">{k}</dt>
            <dd className="font-medium text-slate-900 dark:text-white">{v}</dd>
          </div>
        ))}
      </dl>

      <Card className="mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{next ? 'Next' : 'No round coming up'}</p>
            {next && <p className="text-lg font-semibold text-slate-900 dark:text-white">{next.name}: {whenLabel(next.date, next.time)}</p>}
          </div>
          <div className="w-full sm:w-64">
            <p className="mb-1.5 text-sm text-slate-600 dark:text-slate-400">Prep done</p>
            <ProgressBar value={done} total={tasks.length} label="Prep tasks done" />
          </div>
        </div>
      </Card>

      <nav aria-label="On this page" className="sticky top-14 z-10 -mx-4 mt-6 overflow-x-auto border-b border-slate-200 bg-slate-50/95 px-4 backdrop-blur sm:mx-0 sm:px-0 dark:border-slate-800 dark:bg-slate-950/95">
        <ul className="flex gap-5 py-2.5 text-sm">
          {sections.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); }} className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-14">
        <section aria-labelledby="rounds">
          <H2 id="rounds" sub="Fill in the time, type of round and interviewer when the recruiter confirms them.">Rounds</H2>
          <Rounds o={o} p={p} />
          {asked.length > 0 && (
            <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
              You've logged {asked.length} question{asked.length > 1 ? 's' : ''} from {o.company}.{' '}
              <Link to={`/interviews?company=${encodeURIComponent(o.company)}`} className="font-medium text-indigo-700 hover:underline dark:text-indigo-300">See them</Link>
            </p>
          )}
        </section>

        {o.tailored && (
          <>
            <section aria-labelledby="plan">
              <H2 id="plan" sub="Small steps, one day at a time. Tick them off as you go.">Prep plan</H2>
              <div className="space-y-8">
                {o.plan.map((d) => (
                  <div key={d.day}>
                    <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">{d.day}</h3>
                    <ul className="space-y-4">
                      {d.items.map((it) => {
                        const key = `${o.id}:${it.id}`;
                        return (
                          <li key={it.id}>
                            <Check id={`t-${it.id}`} checked={p.prepDone(key)} onChange={() => p.togglePrep(key)}>{it.text}</Check>
                            <div className="ml-8"><StudyLinks links={it.links} p={p} /></div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="company">
              <H2 id="company" sub="From public news articles and profiles; check their website before the call.">The company</H2>
              <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-slate-800 marker:text-slate-400 dark:text-slate-200">
                {o.about.map((a) => <li key={a}>{a}</li>)}
              </ul>
              <h3 className="mb-2 mt-6 text-sm font-semibold text-slate-900 dark:text-white">Sources</h3>
              <ul className="space-y-1 text-sm">
                {o.sources.map((s) => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="text-indigo-700 underline underline-offset-2 dark:text-indigo-300">{s.title}</a></li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="want">
              <H2 id="want" sub="The job description, in simple words.">What they want</H2>
              <Markdown>{o.want.map((w) => `- ${w}`).join('\n')}</Markdown>
            </section>

            <section aria-labelledby="match">
              <H2 id="match" sub="What they need, and the proof from your resume. Use these as talking points.">Your match</H2>
              <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {o.match.map((m) => (
                  <li key={m.need} className="grid gap-1 py-3.5 sm:grid-cols-[220px_1fr] sm:gap-6">
                    <span className="font-medium text-slate-900 dark:text-white">{m.need}</span>
                    <span className="text-[15px] text-slate-700 dark:text-slate-300">{m.proof}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="gaps">
              <H2 id="gaps" sub="What the job asks for that your resume doesn't show yet. Learn the basics and be honest about it.">Gaps to fill</H2>
              <ul className="space-y-6">
                {o.gaps.map((g) => (
                  <li key={g.gap}>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{g.gap}</h3>
                    <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300"><span className="font-medium">Why it matters:</span> {g.why}</p>
                    <p className="mt-1 text-[15px] text-slate-700 dark:text-slate-300"><span className="font-medium">What to do:</span> {g.how}</p>
                    <StudyLinks links={g.links} p={p} />
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="likely">
              <H2 id="likely" sub="Open each one and practise saying the answer out loud.">Likely questions</H2>
              <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {o.likely.map((l) => (
                  <li key={l.q}>
                    <details className="group py-3">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-3 text-[15px] font-medium text-slate-900 dark:text-white">
                        {l.q}
                        <svg viewBox="0 0 20 20" width="20" height="20" className="mt-0.5 shrink-0 text-slate-500 transition-transform group-open:rotate-90" aria-hidden="true"><path d="m8 5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </summary>
                      <div className="mt-2 pr-8">
                        <Markdown>{l.a}</Markdown>
                        <StudyLinks links={l.links} p={p} />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="ask">
              <H2 id="ask" sub="Pick 4–5. Asking good questions shows you think like an owner.">Questions to ask them</H2>
              <ol className="list-decimal space-y-2 pl-5 text-[15px] text-slate-800 marker:text-slate-500 dark:text-slate-200">
                {o.askThem.map((q) => <li key={q}>{q}</li>)}
              </ol>
            </section>
          </>
        )}

        <section aria-labelledby="ready">
          <H2 id="ready" sub="The things people forget until they're asked.">Have these ready</H2>
          <ul className="space-y-3">
            {(o.tailored ? o.ready : genericReady).map((r, i) => {
              const key = `${o.id}:${o.tailored ? 'ready' : 'g'}-${i}`;
              return <li key={key}><Check id={`r-${i}`} checked={p.prepDone(key)} onChange={() => p.togglePrep(key)}>{r}</Check></li>;
            })}
          </ul>
          {!o.tailored && (
            <p className="mt-6 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Want a full plan like the one for Iksha Labs (company research, your match, gaps, likely questions)? Send Claude the job description and it will add one here.
            </p>
          )}
        </section>

        <section aria-labelledby="jd">
          <H2 id="jd">Job description</H2>
          {o.jd ? (
            <details className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer text-sm font-medium text-slate-900 dark:text-white">Show the full job description</summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700 dark:text-slate-300">{o.jd}</p>
            </details>
          ) : (
            <p className="text-sm text-slate-600 dark:text-slate-400">No job description saved.</p>
          )}
        </section>

        <section aria-label="Your notes on this interview" className="rounded-xl bg-slate-100/70 p-5 dark:bg-slate-900">
          <NotesBox id={`opp:${o.id}`} value={p.note(`opp:${o.id}`)} onSave={(t) => p.setNote(`opp:${o.id}`, t)} placeholder="Anything to remember: names, what the recruiter said, salary discussed, next steps." />
        </section>

        {o.local && (
          <div className="border-t border-slate-200 pt-6 text-sm dark:border-slate-800">
            {confirmDelete ? (
              <span className="flex flex-wrap items-center gap-3">
                <span className="text-slate-700 dark:text-slate-300">Remove {o.company} and its rounds? Logged questions stay.</span>
                <button onClick={() => { p.removeOppLocal(o.id); nav('/interviews'); }} className="font-medium text-rose-700 hover:underline dark:text-rose-300">Remove</button>
                <button onClick={() => setConfirmDelete(false)} className="font-medium text-slate-700 dark:text-slate-300">Keep</button>
              </span>
            ) : (
              <button onClick={() => setConfirmDelete(true)} className="font-medium text-slate-700 hover:text-rose-700 dark:text-slate-300">Remove this interview</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
