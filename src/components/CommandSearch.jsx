import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { allQuestions } from '../data/dsa/index.js';
import { sections } from '../data/sections.js';
import { allClasses } from '../data/classes.js';
import { useProgress } from '../lib/progress.js';
import { Icon, StatusPill } from './ui.jsx';

// One search box for everything: problems, concept questions, classes and your interview log.
const staticIndex = [
  ...allQuestions.map((q) => ({
    kind: 'Problem',
    id: q.uid,
    title: q.title,
    sub: `${q.topicTitle}${q.from ? ` · ${q.from}` : ''}`,
    hay: `${q.title} ${q.topicTitle} ${(q.tags || []).join(' ')} ${q.from || ''} ${q.lc || ''}`.toLowerCase(),
    to: `/dsa/${q.topicId}/${q.id}`,
  })),
  ...sections.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.items.map((i) => ({
        kind: 'Concept',
        id: `${s.id}:${i.id}`,
        title: i.q,
        sub: `${s.title} · ${c.title}`,
        hay: `${i.q} ${s.title} ${c.title} ${i.level}`.toLowerCase(),
        to: `/${s.id}/${c.id}?q=${encodeURIComponent(i.id)}`,
      }))
    )
  ),
  ...allClasses.map((c) => ({
    kind: 'Class',
    id: c.id,
    title: `${c.code} · ${c.title}`,
    sub: c.about,
    hay: `${c.code} ${c.title} ${c.about}`.toLowerCase(),
    to: `/classes/${c.id}`,
  })),
];

function score(item, words) {
  if (!words.every((w) => item.hay.includes(w))) return -1;
  const t = item.title.toLowerCase();
  let s = 0;
  for (const w of words) s += t.startsWith(w) ? 6 : t.includes(w) ? 3 : 1;
  return s - (item.kind === 'Class' ? 0 : 0.5);
}

export default function CommandSearch({ open, onClose }) {
  const nav = useNavigate();
  const p = useProgress();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);

  const results = useMemo(() => {
    const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    const interviews = p.interviews().map((x) => ({
      kind: 'Interview',
      id: x.id,
      title: x.question,
      sub: [x.company, x.round].filter(Boolean).join(' · '),
      hay: `${x.question} ${x.company} ${x.round} ${x.tech} ${x.notes}`.toLowerCase(),
      to: `/interviews?company=${encodeURIComponent(x.company || '')}`,
    }));
    return [...interviews, ...staticIndex]
      .map((it) => ({ it, s: score(it, words) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .map((r) => r.it);
  }, [q, p]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  if (!open) return null;
  const go = (r) => {
    onClose();
    nav(r.to);
  };
  const onKey = (e) => {
    if (e.key === 'Escape') onClose();
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter' && results[active]) go(results[active]);
    else if (e.key === 'Tab') e.preventDefault(); // keep focus in the dialog
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh] backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <Icon name="search" className="text-slate-500" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search problems, concepts, classes, interviews"
            aria-label="Search"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
            className="h-14 flex-1 bg-transparent text-[15px] text-slate-900 placeholder:text-slate-500 focus:outline-none dark:text-white"
          />
          <kbd className="hidden rounded border border-slate-200 px-1.5 text-xs text-slate-500 sm:block dark:border-slate-700">Esc</kbd>
        </div>
        <ul id="search-results" ref={listRef} role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
          {results.map((r, i) => (
            <li
              key={`${r.kind}-${r.id}`}
              id={`sr-${i}`}
              data-i={i}
              role="option"
              aria-selected={i === active}
              onMouseMove={() => setActive(i)}
              onClick={() => go(r)}
              className={`mx-2 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${i === active ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
            >
              <span className="w-[72px] shrink-0 text-xs text-slate-500 dark:text-slate-400">{r.kind}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{r.title}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{r.sub}</span>
              </span>
              {(r.kind === 'Problem' || r.kind === 'Concept') && <StatusPill status={p.status(r.id)} />}
            </li>
          ))}
          {q.trim() && results.length === 0 && <li className="px-5 py-6 text-sm text-slate-600 dark:text-slate-400">Nothing matches “{q}”. Try a problem name, a topic like “heap”, or a company.</li>}
          {!q.trim() && <li className="px-5 py-5 text-sm text-slate-600 dark:text-slate-400">Type to search {staticIndex.length} problems, concept questions and classes, plus your interview log.</li>}
        </ul>
      </div>
    </div>
  );
}
