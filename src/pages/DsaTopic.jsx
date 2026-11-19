import { Link, useParams } from 'react-router-dom';
import { topicById } from '../data/dsa/index.js';
import TopicSidebar from '../components/TopicSidebar.jsx';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { Badge, LcBadge, ProgressBar, StatusButton, StatusPill, diffColor } from '../components/ui.jsx';
import { lcStatus } from '../data/leetcode.js';

export default function DsaTopic() {
  const { topicId } = useParams();
  const t = topicById[topicId];
  const p = useProgress();
  if (!t) return <p>Topic not found. <Link className="text-indigo-700 underline" to="/dsa">See all topics</Link></p>;
  const ids = t.questions.map((q) => `${t.id}/${q.id}`);

  return (
    <div className="flex gap-10">
      <TopicSidebar />
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-600 dark:text-slate-400">
          <Link to="/dsa" className="hover:text-slate-900 dark:hover:text-white">Practice by topic</Link>
        </nav>
        <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">{t.title}</h1>
        {t.lecture && <p className="mt-1 text-[15px] text-slate-600 dark:text-slate-400">{t.lecture}</p>}
        <div className="mt-4 max-w-xs">
          <ProgressBar value={p.doneCount(ids)} total={ids.length} label={`${t.title} practised`} />
        </div>

        <details className="mt-8 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900" open>
          <summary className="cursor-pointer text-[15px] font-semibold text-slate-900 dark:text-white">Key concepts</summary>
          <div className="mt-3"><Markdown>{t.concepts}</Markdown></div>
        </details>

        <h2 className="mb-2 mt-10 text-lg font-semibold text-slate-900 dark:text-white">Problems</h2>
        <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {t.questions.map((q) => {
            const uid = `${t.id}/${q.id}`;
            const st = p.status(uid);
            return (
              <li key={q.id} className="flex items-center gap-3 py-2.5">
                <StatusButton status={st} onClick={() => p.toggleDone(uid)} title={q.title} />
                <Link to={`/dsa/${t.id}/${q.id}`} className="min-w-0 flex-1 text-sm font-medium text-slate-900 hover:text-indigo-700 dark:text-white dark:hover:text-indigo-300">
                  <span className="block truncate">{q.title}</span>
                  {q.from && <span className="block truncate text-xs font-normal text-slate-600 dark:text-slate-400">{q.from}</span>}
                </Link>
                {(st === 'revise' || st === 'mastered') && <StatusPill status={st} />}
                <span className="hidden sm:inline"><LcBadge status={lcStatus(q.lc)} compact /></span>
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export const lcUrl = (lc) => (lc.startsWith('http') ? lc : `https://leetcode.com/problems/${lc}/`);
