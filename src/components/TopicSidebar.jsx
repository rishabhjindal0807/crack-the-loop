import { useEffect, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { topics } from '../data/dsa/index.js';
import { useProgress } from '../lib/progress.js';
import { statusStyle } from './ui.jsx';

export default function TopicSidebar() {
  const p = useProgress();
  const { topicId, qid } = useParams();
  const box = useRef(null);
  // keep the current problem visible inside the sidebar (without moving the page)
  useEffect(() => {
    const el = box.current;
    const cur = el?.querySelector('a[aria-current="page"]');
    if (!el || !cur) return;
    const top = cur.offsetTop - el.offsetTop;
    if (top < el.scrollTop || top > el.scrollTop + el.clientHeight - 40) el.scrollTop = top - el.clientHeight / 3;
  }, [topicId, qid]);
  const block = (key, label) => (
    <div className="mb-5">
      <p className="mb-1 px-2.5 text-xs font-medium text-slate-600 dark:text-slate-400">{label}</p>
      {topics
        .filter((t) => t.source === key)
        .map((t) => {
          const ids = t.questions.map((q) => `${t.id}/${q.id}`);
          const open = t.id === topicId;
          return (
            <div key={t.id}>
              <NavLink
                to={`/dsa/${t.id}`}
                end
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-md px-2.5 py-1.5 text-sm ${
                    isActive || open ? 'bg-slate-100 font-medium text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="truncate">{t.title}</span>
                <span className="ml-2 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                  {p.doneCount(ids)}/{ids.length}
                </span>
              </NavLink>
              {open && (
                <ul className="mb-2 ml-2.5 mt-1 border-l border-slate-200 dark:border-slate-800" aria-label={`${t.title} problems`}>
                  {t.questions.map((q) => {
                    const st = p.status(`${t.id}/${q.id}`);
                    const here = q.id === qid;
                    return (
                      <li key={q.id}>
                        <NavLink
                          to={`/dsa/${t.id}/${q.id}`}
                          aria-current={here ? 'page' : undefined}
                          className={`-ml-px flex items-center gap-2 border-l-2 py-1 pl-3 pr-1 text-[13px] leading-snug ${
                            here ? 'border-indigo-600 font-medium text-slate-900 dark:border-indigo-400 dark:text-white' : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                          }`}
                        >
                          <span className={`h-2 w-2 shrink-0 rounded-full ${statusStyle[st].dot}`} aria-hidden="true" />
                          <span className="truncate">{q.title}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
    </div>
  );
  return (
    <aside className="hidden w-60 shrink-0 lg:block" aria-label="Topics and problems">
      <div ref={box} className="sticky top-[124px] max-h-[calc(100vh-8.5rem)] overflow-y-auto pr-2">
        {block('notes', 'Module 1, class order')}
        {block('curriculum', 'Beyond class so far')}
      </div>
    </aside>
  );
}
