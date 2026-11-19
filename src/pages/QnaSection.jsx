import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { sections } from '../data/sections.js';
import { NotesBox, PageHeader, ProgressBar, SectionTabs, StatusButton, StatusControl, StatusPill } from '../components/ui.jsx';

const areaLabel = { ui: 'Frontend', ai: 'Agentic AI', backend: 'Backend' };

export function QnaItem({ item, uid, defaultOpen = false, context }) {
  const [open, setOpen] = useState(defaultOpen);
  const ref = useRef(null);
  const p = useProgress();
  const st = p.status(uid);
  useEffect(() => {
    if (defaultOpen) {
      setOpen(true);
      ref.current?.scrollIntoView({ block: 'start' });
    }
  }, [defaultOpen]);
  return (
    <li ref={ref} className="scroll-mt-20">
      <div className="flex items-start gap-3 py-3">
        <div className="pt-0.5">
          <StatusButton status={st} onClick={() => p.toggleDone(uid)} title={item.q} />
        </div>
        <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-w-0 flex-1 items-start gap-3 text-left">
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-medium leading-snug text-slate-900 dark:text-white">{item.q}</span>
            <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              {item.level && <span>{item.level}</span>}
              {context && <span>{context}</span>}
              {st === 'revise' || st === 'mastered' ? <StatusPill status={st} /> : null}
              {p.note(uid) && <span>Has notes</span>}
            </span>
          </span>
          <svg viewBox="0 0 20 20" width="20" height="20" className={`mt-0.5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">
            <path d="m8 5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="mb-4 ml-11 space-y-5 border-l-2 border-slate-200 pl-5 dark:border-slate-800">
          <Markdown>{item.a}</Markdown>
          <div className="space-y-4 rounded-lg bg-slate-50 p-4 dark:bg-slate-900">
            <StatusControl status={st} onChange={(s) => p.setStatus(uid, s)} name={`st-${uid}`} />
            <NotesBox id={uid} value={p.note(uid)} onSave={(t) => p.setNote(uid, t)} />
          </div>
        </div>
      )}
    </li>
  );
}

export default function QnaSection({ section }) {
  const { catId } = useParams();
  const [params] = useSearchParams();
  const openId = params.get('q');
  const p = useProgress();
  const [query, setQuery] = useState('');
  const cat = section.categories.find((c) => c.id === catId) || null;
  const allIds = section.categories.flatMap((c) => c.items.map((i) => `${section.id}:${i.id}`));

  const filtered = useMemo(() => {
    const s = query.trim().toLowerCase();
    const cats = cat ? [cat] : section.categories;
    return cats
      .map((c) => ({ ...c, items: c.items.filter((i) => !s || i.q.toLowerCase().includes(s) || i.a.toLowerCase().includes(s)) }))
      .filter((c) => c.items.length);
  }, [query, cat, section]);

  const linkCls = ({ isActive }) =>
    `flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${isActive ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`;

  return (
    <div>
      <SectionTabs label="Concept areas" tabs={sections.map((s) => ({ to: `/${s.id}`, label: areaLabel[s.id] || s.title, active: s.id === section.id }))} />
      <div className="flex gap-10">
        <aside className="hidden w-56 shrink-0 lg:block" aria-label={`${section.title} topics`}>
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-0.5 overflow-y-auto pr-2">
            <NavLink end to={`/${section.id}`} className={linkCls}>All questions</NavLink>
            {section.categories.map((c) => {
              const ids = c.items.map((i) => `${section.id}:${i.id}`);
              return (
                <NavLink key={c.id} to={`/${section.id}/${c.id}`} className={linkCls}>
                  <span className="truncate">{c.title}</span>
                  <span className="ml-2 text-xs tabular-nums text-slate-600 dark:text-slate-400">{p.doneCount(ids)}/{ids.length}</span>
                </NavLink>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <PageHeader title={cat ? cat.title : section.title}>{cat ? cat.summary || section.tagline : section.tagline}</PageHeader>
          <div className="-mt-2 mb-6 max-w-xs">
            <ProgressBar value={p.doneCount(allIds)} total={allIds.length} label={`${section.title} covered`} />
          </div>

          {/* phones: topic picker */}
          <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden">
            <NavLink end to={`/${section.id}`} className={({ isActive }) => `shrink-0 rounded-full border px-3 py-1.5 text-sm ${isActive ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300'}`}>All</NavLink>
            {section.categories.map((c) => (
              <NavLink key={c.id} to={`/${section.id}/${c.id}`} className={({ isActive }) => `shrink-0 rounded-full border px-3 py-1.5 text-sm ${isActive ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900' : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300'}`}>{c.title}</NavLink>
            ))}
          </div>

          {!cat && section.resume && (
            <details className="mb-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <summary className="cursor-pointer text-[15px] font-semibold text-slate-900 dark:text-white">From your resume: be ready to talk about these</summary>
              <div className="mt-3"><Markdown>{section.resume}</Markdown></div>
            </details>
          )}

          <label htmlFor="qna-search" className="sr-only">Filter {section.title} questions</label>
          <input
            id="qna-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${areaLabel[section.id] || section.title} questions`}
            className="mb-8 w-full max-w-md rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900"
          />

          {filtered.map((c) => (
            <section key={c.id} className="mb-10" aria-labelledby={`cat-${c.id}`}>
              {!cat && (
                <div className="mb-1">
                  <h2 id={`cat-${c.id}`} className="text-lg font-semibold text-slate-900 dark:text-white">{c.title}</h2>
                  {c.summary && <p className="text-sm text-slate-600 dark:text-slate-400">{c.summary}</p>}
                </div>
              )}
              <ul className="divide-y divide-slate-200 border-b border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {c.items.map((item) => (
                  <QnaItem key={item.id} item={item} uid={`${section.id}:${item.id}`} defaultOpen={openId === item.id} />
                ))}
              </ul>
            </section>
          ))}
          {filtered.length === 0 && <p className="text-sm text-slate-600 dark:text-slate-400">No questions match “{query}”.</p>}
        </div>
      </div>
    </div>
  );
}
