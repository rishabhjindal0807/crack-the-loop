import { Link, useParams } from 'react-router-dom';
import { topicById } from '../data/dsa/index.js';
import TopicSidebar from '../components/TopicSidebar.jsx';
import Markdown from '../lib/Markdown.jsx';
import { useProgress } from '../lib/progress.js';
import { Badge, Card, DoneToggle, ProgressBar, StarToggle, diffColor } from '../components/ui.jsx';

export default function DsaTopic() {
  const { topicId } = useParams();
  const t = topicById[topicId];
  const p = useProgress();
  if (!t) return <p>Topic not found. <Link className="text-indigo-600" to="/dsa">Back to DSA</Link></p>;
  const ids = t.questions.map((q) => `${t.id}/${q.id}`);

  return (
    <div className="flex gap-8">
      <TopicSidebar />
      <div className="min-w-0 flex-1 space-y-6">
        <div>
          <Link to="/dsa" className="text-sm text-slate-500 hover:text-indigo-600">← DSA</Link>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {t.icon} {t.title}
            </h1>
            {t.lecture && <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">{t.lecture}</Badge>}
            {t.source === 'curriculum' && <Badge className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">Not in your notes yet</Badge>}
          </div>
          <div className="mt-3 max-w-sm">
            <ProgressBar value={p.doneCount(ids)} total={ids.length} />
          </div>
        </div>

        <Card className="p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Key concepts</h2>
          <Markdown>{t.concepts}</Markdown>
        </Card>

        <div>
          <h2 className="mb-3 text-lg font-semibold">Problems</h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {t.questions.map((q, i) => {
              const uid = `${t.id}/${q.id}`;
              return (
                <div key={q.id} className="flex items-center gap-3 px-4 py-3">
                  <DoneToggle done={p.isDone(uid)} onClick={() => p.toggleDone(uid)} />
                  <span className="w-6 text-xs tabular-nums text-slate-400">{i + 1}.</span>
                  <Link to={`/dsa/${t.id}/${q.id}`} className="min-w-0 flex-1 truncate text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400">
                    {q.title}
                  </Link>
                  {q.lc && (
                    <a href={lcUrl(q.lc)} target="_blank" rel="noreferrer" className="hidden text-xs text-slate-400 hover:text-amber-500 sm:inline">
                      {q.lc.includes('geeksforgeeks') ? 'GfG ↗' : 'LeetCode ↗'}
                    </a>
                  )}
                  {q.from && <span title={q.from} className="text-xs">📒</span>}
                  <StarToggle on={p.isStarred(uid)} onClick={() => p.toggleStar(uid)} />
                  <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    </div>
  );
}

export const lcUrl = (lc) => (lc.startsWith('http') ? lc : `https://leetcode.com/problems/${lc}/`);
