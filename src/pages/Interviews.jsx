import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProgress } from '../lib/progress.js';
import { everything, itemById } from '../data/items.js';
import { committedInterviews } from '../data/interviews.js';
import { profile } from '../data/profile.js';
import { dedent } from '../lib/dedent.js';
import { Badge, Icon, PageHeader, StatusPill } from '../components/ui.jsx';

const ROUNDS = ['Online assessment', 'Recruiter screen', 'DSA round', 'Machine coding', 'Frontend system design', 'System design', 'AI / LLM design', 'Hiring manager', 'Behavioural'];
const TECH = ['DSA', 'Frontend', 'Agentic AI', 'Backend', 'System design', 'Behavioural', 'Other'];
const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ id: '', company: '', round: '', date: today(), tech: 'DSA', question: '', notes: '', link: '' });

const field = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-white';
const labelCls = 'mb-1.5 block text-sm font-medium text-slate-900 dark:text-slate-100';

function LinkPicker({ value, onChange }) {
  const [q, setQ] = useState('');
  const picked = value ? itemById.get(value) : null;
  const matches = useMemo(() => {
    const w = q.trim().toLowerCase();
    if (w.length < 2) return [];
    return everything.filter((x) => x.title.toLowerCase().includes(w)).slice(0, 6);
  }, [q]);
  if (picked) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-700">
        <span className="min-w-0 flex-1 truncate text-slate-900 dark:text-white">{picked.title}</span>
        <span className="text-xs text-slate-600 dark:text-slate-400">{picked.kind}</span>
        <button type="button" onClick={() => onChange('')} className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Change</button>
      </div>
    );
  }
  return (
    <div>
      <input id="iv-link" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type to find it, e.g. LRU cache" className={field} autoComplete="off" />
      {matches.length > 0 && (
        <ul className="mt-1 divide-y divide-slate-100 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
          {matches.map((m) => (
            <li key={m.id}>
              <button type="button" onClick={() => { onChange(m.id); setQ(''); }} className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                <span className="min-w-0 flex-1 truncate text-slate-900 dark:text-white">{m.title}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{m.area}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EntryForm({ initial, companies, onSave, onCancel }) {
  const [f, setF] = useState(initial);
  const [error, setError] = useState('');
  const first = useRef(null);
  useEffect(() => first.current?.focus(), []);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    if (!f.question.trim()) {
      setError('Add the question you were asked.');
      return;
    }
    onSave({ ...f, id: f.id || `iv-${Date.now().toString(36)}`, company: f.company.trim(), round: f.round.trim(), question: f.question.trim() });
  };
  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" aria-label={f.id ? 'Edit interview question' : 'Log an interview question'}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="iv-company" className={labelCls}>Company</label>
          <input ref={first} id="iv-company" list="iv-companies" value={f.company} onChange={set('company')} placeholder="e.g. Razorpay" className={field} />
          <datalist id="iv-companies">{companies.map((c) => <option key={c} value={c} />)}</datalist>
        </div>
        <div>
          <label htmlFor="iv-round" className={labelCls}>Round</label>
          <input id="iv-round" list="iv-rounds" value={f.round} onChange={set('round')} placeholder="e.g. DSA round" className={field} />
          <datalist id="iv-rounds">{ROUNDS.map((r) => <option key={r} value={r} />)}</datalist>
        </div>
        <div>
          <label htmlFor="iv-date" className={labelCls}>Date</label>
          <input id="iv-date" type="date" value={f.date} onChange={set('date')} className={field} />
        </div>
        <div>
          <label htmlFor="iv-tech" className={labelCls}>Area</label>
          <select id="iv-tech" value={f.tech} onChange={set('tech')} className={field}>
            {TECH.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="iv-question" className={labelCls}>Question you were asked</label>
          <textarea id="iv-question" rows={3} value={f.question} onChange={(e) => { set('question')(e); setError(''); }}
            aria-invalid={Boolean(error)} aria-describedby={error ? 'iv-error' : undefined}
            placeholder="Write it the way the interviewer said it, including follow-ups." className={field} />
          {error && <p id="iv-error" className="mt-1.5 text-sm text-rose-700 dark:text-rose-300">{error}</p>}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="iv-notes" className={labelCls}>How it went</label>
          <textarea id="iv-notes" rows={3} value={f.notes} onChange={set('notes')} placeholder="What you answered, what you missed, what to study before the next one." className={field} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="iv-link" className={labelCls}>Same as a question on this site <span className="font-normal text-slate-600 dark:text-slate-400">(optional)</span></label>
          <LinkPicker value={f.link} onChange={(link) => setF((x) => ({ ...x, link }))} />
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">{f.id ? 'Save changes' : 'Save question'}</button>
        <button type="button" onClick={onCancel} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
      </div>
    </form>
  );
}

function Entry({ x, p, onEdit, readOnly }) {
  const [confirm, setConfirm] = useState(false);
  const linked = x.link ? itemById.get(x.link) : null;
  return (
    <li className="py-4">
      <p className="whitespace-pre-line text-[15px] font-medium leading-snug text-slate-900 dark:text-white">{x.question}</p>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        {x.tech && <Badge>{x.tech}</Badge>}
        {x.date && <span>{new Date(x.date + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
        {linked && (
          <Link to={linked.to} className="inline-flex items-center gap-2 font-medium text-indigo-700 hover:underline dark:text-indigo-300">
            Study it: {linked.title} <StatusPill status={p.status(linked.id)} />
          </Link>
        )}
      </div>
      {x.notes && <p className="mt-2 whitespace-pre-line border-l-2 border-slate-200 pl-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">{x.notes}</p>}
      {!readOnly && (
        <div className="mt-2 flex gap-3 text-sm">
          <button onClick={onEdit} className="font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">Edit</button>
          {confirm ? (
            <span className="flex gap-3">
              <span className="text-slate-700 dark:text-slate-300">Delete this question?</span>
              <button onClick={() => p.removeInterview(x.id)} className="font-medium text-rose-700 hover:underline dark:text-rose-300">Delete</button>
              <button onClick={() => setConfirm(false)} className="font-medium text-slate-700 dark:text-slate-300">Keep</button>
            </span>
          ) : (
            <button onClick={() => setConfirm(true)} className="font-medium text-slate-700 hover:text-rose-700 dark:text-slate-300">Delete</button>
          )}
        </div>
      )}
    </li>
  );
}

export default function Interviews() {
  const p = useProgress();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(params.get('new') ? blank() : null);
  const [tech, setTech] = useState('All');
  const company = params.get('company') || '';

  const local = p.interviews();
  const all = [...local, ...committedInterviews.map((x) => ({ ...x, readOnly: true }))];
  const companies = [...new Set(all.map((x) => x.company || 'Unknown company'))];
  const shown = all.filter((x) => (!company || (x.company || 'Unknown company') === company) && (tech === 'All' || x.tech === tech));

  // company → round → entries, most recently used company first
  const groups = [];
  for (const x of [...shown].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.at || 0) - (a.at || 0))) {
    const c = x.company || 'Unknown company';
    let g = groups.find((y) => y.company === c);
    if (!g) groups.push((g = { company: c, rounds: [] }));
    const r = x.round || 'Round not set';
    let rg = g.rounds.find((y) => y.round === r);
    if (!rg) g.rounds.push((rg = { round: r, items: [] }));
    rg.items.push(x);
  }

  const save = (entry) => {
    p.saveInterview(entry);
    setEditing(null);
    if (params.get('new')) setParams({});
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="Interviews"
        actions={!editing && (
          <button onClick={() => setEditing(blank())} className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
            <Icon name="plus" size={16} /> Log a question
          </button>
        )}
      >
        Every question you're asked, by company and round. Log them right after the interview and link each one to the matching problem or concept here.
      </PageHeader>

      {editing && (
        <div className="mb-10">
          <EntryForm initial={editing} companies={companies} onSave={save} onCancel={() => { setEditing(null); if (params.get('new')) setParams({}); }} />
        </div>
      )}

      {all.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button onClick={() => setParams({})} aria-pressed={!company}
            className={`rounded-full border px-3 py-1 text-sm ${!company ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300'}`}>
            All companies
          </button>
          {companies.map((c) => (
            <button key={c} onClick={() => setParams({ company: c })} aria-pressed={company === c}
              className={`rounded-full border px-3 py-1 text-sm ${company === c ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300'}`}>
              {c}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            Area
            <select value={tech} onChange={(e) => setTech(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900">
              <option>All</option>
              {TECH.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
      )}

      {groups.map((g) => (
        <section key={g.company} className="mb-10" aria-labelledby={`co-${g.company}`}>
          <h2 id={`co-${g.company}`} className="text-xl font-semibold text-slate-900 dark:text-white">{g.company}</h2>
          {g.rounds.map((r) => (
            <div key={r.round} className="mt-4">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">{r.round}</h3>
              <ul className="divide-y divide-slate-200 border-b border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {r.items.map((x) => (
                  <Entry key={x.id} x={x} p={p} readOnly={x.readOnly} onEdit={() => { setEditing(x); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}

      {all.length === 0 && !editing && (
        <div className="rounded-xl border border-dashed border-slate-300 px-6 py-10 text-center dark:border-slate-700">
          <p className="text-[15px] font-medium text-slate-900 dark:text-white">No interview questions yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">After your next interview, log each question with the company and round. Patterns across companies show you what to practise.</p>
          <button onClick={() => setEditing(blank())} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">Log a question</button>
        </div>
      )}
      {all.length > 0 && shown.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No questions match these filters.</p>}

      <section className="mt-14 border-t border-slate-200 pt-8 dark:border-slate-800" aria-labelledby="pitch-h">
        <h2 id="pitch-h" className="text-lg font-semibold text-slate-900 dark:text-white">Before the interview: your 60-second pitch</h2>
        <p className="mt-3 max-w-[68ch] text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">{dedent(profile.pitch).replace(/\n(?!\n)/g, ' ')}</p>
      </section>
    </div>
  );
}
