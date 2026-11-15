export const diffColor = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Hard: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
};

export function Badge({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      {children}
    </div>
  );
}

export function ProgressBar({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs tabular-nums text-slate-500">
        {value}/{total}
      </span>
    </div>
  );
}

export function DoneToggle({ done, onClick }) {
  return (
    <button
      onClick={onClick}
      title={done ? 'Mark as not done' : 'Mark as done'}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs transition ${
        done
          ? 'border-emerald-500 bg-emerald-500 text-white'
          : 'border-slate-300 hover:border-emerald-500 dark:border-slate-600'
      }`}
    >
      {done ? '✓' : ''}
    </button>
  );
}

export function StarToggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      title={on ? 'Unstar' : 'Star for revision'}
      className={`text-base leading-none transition ${on ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400 dark:text-slate-600'}`}
    >
      ★
    </button>
  );
}
