import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { STATUSES } from '../lib/progress.js';

// Colour is reserved for meaning: difficulty and status. Everything else is neutral.
export const diffColor = {
  Easy: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20',
  Medium: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20',
  Hard: 'bg-rose-50 text-rose-700 ring-rose-600/15 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20',
};

export function Badge({ children, className = 'bg-slate-100 text-slate-600 ring-slate-900/5 dark:bg-slate-800 dark:text-slate-300 dark:ring-white/10', title }) {
  return (
    <span title={title} className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return <div className={`rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}>{children}</div>;
}

export function ProgressBar({ value, total, label }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={label || 'Progress'}
      >
        <div className="h-full rounded-full bg-indigo-600 transition-[width] dark:bg-indigo-400" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">
        {value}/{total}
      </span>
    </div>
  );
}

// ---- status ---------------------------------------------------------------------------------
export const statusStyle = {
  todo: { dot: 'border border-slate-300 bg-transparent dark:border-slate-600', text: 'text-slate-600 dark:text-slate-400' },
  solved: { dot: 'bg-indigo-600 dark:bg-indigo-500', text: 'text-indigo-700 dark:text-indigo-300' },
  revise: { dot: 'bg-amber-500', text: 'text-amber-800 dark:text-amber-300' },
  mastered: { dot: 'bg-emerald-600 dark:bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
};
const statusLabel = Object.fromEntries(STATUSES.map((s) => [s.id, s.label]));

function StatusGlyph({ status, size = 18 }) {
  const s = statusStyle[status];
  return (
    <span className={`flex items-center justify-center rounded-[5px] text-white ${s.dot} ${status === 'mastered' ? 'rounded-full' : ''}`} style={{ width: size, height: size }}>
      {status === 'solved' || status === 'mastered' ? (
        <svg viewBox="0 0 16 16" width={size - 6} height={size - 6} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3.5 8.5l3 3 6-7" />
        </svg>
      ) : status === 'revise' ? (
        <svg viewBox="0 0 16 16" width={size - 6} height={size - 6} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <path d="M12.5 6.5A5 5 0 1 0 13 9" />
          <path d="M13 3v3.5H9.5" />
        </svg>
      ) : null}
    </span>
  );
}

// List control: one tap marks Solved (or back to To do). 32px hit area around an 18px glyph.
export function StatusButton({ status, onClick, title = 'item' }) {
  const done = status !== 'todo';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={done}
      aria-label={done ? `${title}: ${statusLabel[status]}. Mark as to do` : `Mark ${title} as solved`}
      title={done ? `${statusLabel[status]} — click to mark as to do` : 'Mark as solved'}
      className="-m-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <StatusGlyph status={status} />
    </button>
  );
}

// Detail control: To do · Solved · Revise · Mastered (a real radio group, so arrow keys work).
export function StatusControl({ status, onChange, name }) {
  return (
    <fieldset className="inline-flex flex-wrap rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
      <legend className="sr-only">Status</legend>
      {STATUSES.map((s) => {
        const on = status === s.id;
        return (
          <label
            key={s.id}
            className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-indigo-500 ${
              on ? 'bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <input type="radio" name={name} value={s.id} checked={on} onChange={() => onChange(s.id)} className="sr-only" />
            <span className={`h-2 w-2 rounded-full ${statusStyle[s.id].dot}`} aria-hidden="true" />
            {s.label}
          </label>
        );
      })}
    </fieldset>
  );
}

export function StatusPill({ status }) {
  if (status === 'todo') return null;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${statusStyle[status].text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${statusStyle[status].dot}`} aria-hidden="true" />
      {statusLabel[status]}
    </span>
  );
}

// ---- notes ----------------------------------------------------------------------------------
export function NotesBox({ value, onSave, id, placeholder = 'What tripped you up? What would you say in the interview?' }) {
  const [text, setText] = useState(value);
  const [state, setState] = useState('idle');
  const timer = useRef(null);
  useEffect(() => setText(value), [value, id]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const change = (t) => {
    setText(t);
    setState('typing');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSave(t);
      setState('saved');
    }, 500);
  };
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={`note-${id}`} className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Your notes
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {state === 'typing' ? 'Saving…' : state === 'saved' ? 'Saved in this browser' : ''}
        </span>
      </div>
      <textarea
        id={`note-${id}`}
        value={text}
        onChange={(e) => change(e.target.value)}
        onBlur={() => {
          clearTimeout(timer.current);
          if (text !== value) {
            onSave(text);
            setState('saved');
          }
        }}
        rows={Math.min(12, Math.max(3, text.split('\n').length + 1))}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-relaxed text-slate-800 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500"
      />
    </div>
  );
}

// ---- LeetCode status chip -------------------------------------------------------------------
export function LcBadge({ status, compact = false }) {
  if (!status) return null;
  const solved = status.verdict === 'AC';
  return (
    <a
      href={status.url}
      target="_blank"
      rel="noreferrer"
      title={`LeetCode #${status.num}: ${status.verdictLabel}`}
      className={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset hover:underline ${
        solved
          ? 'text-slate-600 ring-slate-900/10 dark:text-slate-300 dark:ring-white/15'
          : 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20'
      }`}
    >
      {compact ? (solved ? 'LC ✓' : `LC ${status.verdict}`) : solved ? 'Accepted on LeetCode' : `LeetCode: ${status.verdictLabel}`}
    </a>
  );
}

// ---- section tabs (Practice: classes / topics / LeetCode, Concepts: frontend / AI / backend) --
export function SectionTabs({ tabs, label }) {
  return (
    <nav aria-label={label} className="-mx-4 mb-6 overflow-x-auto border-b border-slate-200 px-4 dark:border-slate-800 sm:mx-0 sm:px-0">
      <div className="flex gap-6">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `-mb-px whitespace-nowrap border-b-2 py-2.5 text-sm font-medium transition ${
                isActive || t.active
                  ? 'border-indigo-600 text-slate-900 dark:border-indigo-400 dark:text-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`
            }
          >
            {t.label}
            {t.count !== undefined && <span className="ml-1.5 tabular-nums text-slate-500 dark:text-slate-400">{t.count}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export const practiceTabs = [
  { to: '/classes', label: 'By class' },
  { to: '/dsa', label: 'By topic' },
  { to: '/leetcode', label: 'LeetCode history' },
];

export function PageHeader({ title, children, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {children && <p className="mt-1.5 max-w-2xl text-[15px] text-slate-600 dark:text-slate-400">{children}</p>}
      </div>
      {actions}
    </div>
  );
}

// ---- icons (1.75 stroke, 20px) --------------------------------------------------------------
const paths = {
  today: <><path d="M4 11.5 12 5l8 6.5" /><path d="M6 10v9h12v-9" /></>,
  practice: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m13.5 5-3 14" /></>,
  concepts: <><path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H19v14H6.5A1.5 1.5 0 0 0 5 19.5z" /><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19" /></>,
  interviews: <><path d="M5 5h14v10H9l-4 4z" /><path d="M9 9h6M9 12h3" /></>,
  revise: <><path d="M19 12a7 7 0 1 1-2.05-4.95" /><path d="M19 4v4h-4" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.2-4.2" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></>,
  moon: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  plus: <path d="M12 5v14M5 12h14" />,
};
export function Icon({ name, size = 20, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
