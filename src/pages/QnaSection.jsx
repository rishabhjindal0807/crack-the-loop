import { useMemo, useState } from 'react';
import { NavLink, useParams, Link } from 'react-router-dom';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { Badge, Card, DoneToggle, ProgressBar, StarToggle } from '../components/ui.jsx';

const levelColor = {
  Core: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  'Deep dive': 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  'From resume': 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Design: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  Coding: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
};

export function QnaItem({ item, uid, defaultOpen = false, context }) {
  const [open, setOpen] = useState(defaultOpen);
  const p = useProgress();
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="pt-0.5">
          <DoneToggle done={p.isDone(uid)} onClick={() => p.toggleDone(uid)} />
        </div>
        <button onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 text-left">
          <span className="block text-[15px] font-medium leading-snug">{item.q}</span>
          <span className="mt-1 flex flex-wrap gap-1.5">
            {item.level && <Badge className={levelColor[item.level] || levelColor.Core}>{item.level}</Badge>}
            {context && <Badge className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">{context}</Badge>}
          </span>
        </button>
        <StarToggle on={p.isStarred(uid)} onClick={() => p.toggleStar(uid)} />
        <button onClick={() => setOpen((o) => !o)} className={`text-slate-400 transition ${open ? 'rotate-90' : ''}`}>
          ›
        </button>
      </div>
      {open && (
        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800 sm:pl-12">
          <Markdown>{item.a}</Markdown>
        </div>
      )}
    </Card>
  );
}

export default function QnaSection({ section }) {
  const { catId } = useParams();
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

  return (
    <div className="flex gap-8">
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
          <NavLink end to={`/${section.id}`} className={({ isActive }) => `block rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
            Overview & all questions
          </NavLink>
          <p className="mb-1 mt-4 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Topics</p>
          {section.categories.map((c) => {
            const ids = c.items.map((i) => `${section.id}:${i.id}`);
            return (
              <NavLink key={c.id} to={`/${section.id}/${c.id}`} className={({ isActive }) => `flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${isActive ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}>
                <span className="truncate">{c.title}</span>
                <span className="ml-2 text-[11px] tabular-nums text-slate-400">{p.doneCount(ids)}/{ids.length}</span>
              </NavLink>
            );
          })}
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {section.icon} {section.title}
            {cat && <span className="text-slate-400"> / {cat.title}</span>}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{section.tagline}</p>
          <div className="mt-3 max-w-sm">
            <ProgressBar value={p.doneCount(allIds)} total={allIds.length} />
          </div>
        </div>

        {/* mobile topic picker */}
        <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
          <Link to={`/${section.id}`} className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">All</Link>
          {section.categories.map((c) => (
            <Link key={c.id} to={`/${section.id}/${c.id}`} className="shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs dark:border-slate-700">{c.title}</Link>
          ))}
        </div>

        {!cat && section.resume && (
          <Card className="border-amber-200 bg-amber-50/60 p-6 dark:border-amber-500/30 dark:bg-amber-500/5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">From your resume — be ready to talk about</h2>
            <Markdown>{section.resume}</Markdown>
          </Card>
        )}

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${section.title} questions…`}
          className="w-full max-w-md rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-indigo-500/20"
        />

        {filtered.map((c) => (
          <section key={c.id} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{c.title}</h2>
              {c.summary && <p className="text-sm text-slate-500">{c.summary}</p>}
            </div>
            {c.items.map((item) => (
              <QnaItem key={item.id} item={item} uid={`${section.id}:${item.id}`} />
            ))}
          </section>
        ))}
        {filtered.length === 0 && <p className="text-sm text-slate-500">No matches.</p>}
      </div>
    </div>
  );
}
