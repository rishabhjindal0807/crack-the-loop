import { NavLink } from 'react-router-dom';
import { topics } from '../data/dsa/index.js';
import { useProgress } from '../lib/progress.js';

export default function TopicSidebar() {
  const p = useProgress();
  const block = (key, label) => (
    <div className="mb-5">
      <p className="mb-1 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>
      {topics
        .filter((t) => t.source === key)
        .map((t) => {
          const ids = t.questions.map((q) => `${t.id}/${q.id}`);
          return (
            <NavLink
              key={t.id}
              to={`/dsa/${t.id}`}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${
                  isActive ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="truncate">{t.title}</span>
              <span className="ml-2 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                {p.doneCount(ids)}/{ids.length}
              </span>
            </NavLink>
          );
        })}
    </div>
  );
  return (
    <aside className="hidden w-56 shrink-0 lg:block" aria-label="Topics">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
        {block('notes', 'Module 1, class order')}
        {block('curriculum', 'Beyond class so far')}
      </div>
    </aside>
  );
}
