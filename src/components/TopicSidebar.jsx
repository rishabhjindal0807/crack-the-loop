import { NavLink } from 'react-router-dom';
import { topics } from '../data/dsa/index.js';
import { useProgress } from '../lib/progress.js';

export default function TopicSidebar() {
  const p = useProgress();
  const block = (key, label) => (
    <div className="mb-4">
      <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      {topics
        .filter((t) => t.source === key)
        .map((t) => {
          const ids = t.questions.map((q) => `${t.id}/${q.id}`);
          const done = p.doneCount(ids);
          return (
            <NavLink
              key={t.id}
              to={`/dsa/${t.id}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-1.5 text-sm ${
                  isActive ? 'bg-indigo-50 font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="truncate">{t.title}</span>
              <span className="ml-2 text-[11px] tabular-nums text-slate-400">
                {done}/{ids.length}
              </span>
            </NavLink>
          );
        })}
    </div>
  );
  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        {block('notes', 'Your notes')}
        {block('curriculum', 'Curriculum')}
      </div>
    </aside>
  );
}
