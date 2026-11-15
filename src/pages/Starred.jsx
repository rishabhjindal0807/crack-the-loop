import { Link } from 'react-router-dom';
import { allQuestions } from '../data/dsa/index.js';
import { sections } from '../data/sections.js';
import { useProgress } from '../lib/progress.js';
import { Badge, Card, diffColor } from '../components/ui.jsx';
import { QnaItem } from './QnaSection.jsx';

export default function Starred() {
  const p = useProgress();
  const dsa = allQuestions.filter((q) => p.isStarred(q.uid));
  const qna = sections.flatMap((s) =>
    s.categories.flatMap((c) =>
      c.items.filter((i) => p.isStarred(`${s.id}:${i.id}`)).map((i) => ({ s, c, i }))
    )
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">★ Revision list</h1>
        <p className="mt-1 text-sm text-slate-500">Everything you've starred, in one place — use it for the night before an interview.</p>
      </div>
      {dsa.length === 0 && qna.length === 0 && (
        <Card className="p-6 text-sm text-slate-500">Nothing starred yet. Tap ★ on any problem or question to add it here.</Card>
      )}
      {dsa.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">DSA</h2>
          <Card className="divide-y divide-slate-100 dark:divide-slate-800">
            {dsa.map((q) => (
              <Link key={q.uid} to={`/dsa/${q.topicId}/${q.id}`} className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <span>
                  <span className="font-medium">{q.title}</span> <span className="text-xs text-slate-500">· {q.topicTitle}</span>
                </span>
                <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
              </Link>
            ))}
          </Card>
        </section>
      )}
      {qna.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Concepts</h2>
          {qna.map(({ s, c, i }) => (
            <QnaItem key={`${s.id}:${i.id}`} item={i} uid={`${s.id}:${i.id}`} context={`${s.title} · ${c.title}`} />
          ))}
        </section>
      )}
    </div>
  );
}
