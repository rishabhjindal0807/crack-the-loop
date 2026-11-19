import { Link } from 'react-router-dom';
import { allQuestions } from '../data/dsa/index.js';
import { sections } from '../data/sections.js';
import { allClasses, classById, current } from '../data/classes.js';
import { lcSubmissions } from '../data/leetcode.js';
import { useProgress } from '../lib/progress.js';
import { Badge, Card, ProgressBar, StatusPill, diffColor } from '../components/ui.jsx';
import { reviseItems } from './Revise.jsx';
import { allOpps, daysUntil, nextRound, prepTasks, whenLabel } from '../lib/opps.js';

// Today answers one question: what should I do next?
function nextStep(p) {
  const start = allClasses.findIndex((c) => c.id === current);
  // the current class first, then the classes after it, then anything earlier that was skipped
  const order = [...allClasses.slice(start), ...allClasses.slice(0, start)];
  for (const c of order) {
    const q = c.problems.find((x) => !p.isDone(x.uid));
    if (q) return { cls: c, q, isCurrent: c.id === current };
  }
  return null;
}

const ago = (t) => {
  if (!t) return '';
  const d = Math.floor((Date.now() - t) / 86400000);
  return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago`;
};

export default function Today() {
  const p = useProgress();
  const step = nextStep(p);
  const cur = classById[current];
  const curIds = cur.problems.map((q) => q.uid);
  const revise = reviseItems(p).sort((a, b) => p.touchedAt(a.id) - p.touchedAt(b.id));
  const retries = lcSubmissions.filter((s) => s.verdict !== 'AC').length;
  const interviews = p.interviews();
  const dsaIds = allQuestions.map((q) => q.uid);
  const conceptIds = sections.flatMap((s) => s.categories.flatMap((c) => c.items.map((i) => `${s.id}:${i.id}`)));
  const allIds = [...dsaIds, ...conceptIds];
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const soon = allOpps(p)
    .map((o) => ({ o, r: nextRound(o) }))
    .filter(({ r }) => r && r.date && daysUntil(r.date) >= 0 && daysUntil(r.date) <= 21)
    .sort((a, b) => a.r.date.localeCompare(b.r.date));

  return (
    <div className="space-y-12">
      <section aria-labelledby="continue">
        <p className="text-sm text-slate-600 dark:text-slate-400">{date}</p>
        <h1 id="continue" className="sr-only">Today</h1>
        {soon.map(({ o, r }) => {
          const tasks = prepTasks(o);
          const done = tasks.filter((k) => p.prepDone(k)).length;
          return (
            <Link key={o.id} to={`/interviews/${o.id}`} className="group mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-indigo-200 bg-indigo-50/60 px-5 py-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-indigo-800 dark:text-indigo-300">Interview {daysUntil(r.date) === 0 ? 'today' : daysUntil(r.date) === 1 ? 'tomorrow' : `in ${daysUntil(r.date)} days`}</span>
                <span className="block text-[17px] font-semibold text-slate-900 group-hover:text-indigo-800 dark:text-white">{o.company}, {r.name}</span>
                <span className="block text-sm text-slate-700 dark:text-slate-300">{o.role} · {whenLabel(r.date, r.time)}</span>
              </span>
              <span className="w-full sm:w-56">
                <span className="mb-1 block text-xs text-slate-700 dark:text-slate-300">Prep done</span>
                <ProgressBar value={done} total={tasks.length} label={`${o.company} prep done`} />
              </span>
              <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Open prep plan</span>
            </Link>
          );
        })}
        {step ? (
          <div className="mt-3">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {step.isCurrent ? 'Continue' : 'Up next'} with{' '}
              <Link to={`/classes/${step.cls.id}`} className="text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-900 dark:text-white dark:decoration-slate-600">
                {step.cls.code}, {step.cls.title}
              </Link>
            </p>
            <Link to={`/dsa/${step.q.topicId}/${step.q.id}`} className="group mt-2 block max-w-3xl">
              <span className="block text-[34px] font-semibold leading-[1.1] tracking-tight text-slate-900 group-hover:text-indigo-700 sm:text-[44px] dark:text-white dark:group-hover:text-indigo-300">
                {step.q.title}
              </span>
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to={`/dsa/${step.q.topicId}/${step.q.id}`} className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
                Open problem
              </Link>
              <Badge className={diffColor[step.q.difficulty]}>{step.q.difficulty}</Badge>
              <span className="text-sm text-slate-600 dark:text-slate-400">{step.q.topicTitle}</span>
            </div>
            {step.isCurrent && (
              <div className="mt-6 max-w-sm">
                <ProgressBar value={p.doneCount(curIds)} total={curIds.length} label={`${cur.code} progress`} />
              </div>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <p className="text-[34px] font-semibold leading-tight tracking-tight text-slate-900 dark:text-white">Every class problem is done.</p>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Spend today on your revise list, or pick a topic in Practice.</p>
          </div>
        )}
      </section>

      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <section aria-labelledby="revise-h">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="revise-h" className="text-lg font-semibold text-slate-900 dark:text-white">Revise</h2>
            <Link to="/revise" className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">
              {revise.length ? `All ${revise.length}` : 'Open revise list'}
            </Link>
          </div>
          {revise.length ? (
            <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {revise.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <Link to={r.to} className="flex items-center gap-3 py-3 hover:bg-slate-50 dark:hover:bg-slate-900">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{r.title}</span>
                      <span className="block truncate text-xs text-slate-600 dark:text-slate-400">
                        {r.area}
                        {p.note(r.id) ? ' · has notes' : ''}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-slate-600 dark:text-slate-400">{ago(p.touchedAt(r.id))}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="border-y border-slate-200 py-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
              Nothing to revise yet. When a problem or concept feels shaky, set it to <StatusPill status="revise" /> and it shows up here.
            </p>
          )}
          {retries > 0 && (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Plus {retries} LeetCode submissions to retry.{' '}
              <Link to="/revise#retry" className="font-medium text-indigo-700 hover:underline dark:text-indigo-300">See them</Link>
            </p>
          )}
        </section>

        <section aria-labelledby="int-h">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 id="int-h" className="text-lg font-semibold text-slate-900 dark:text-white">Interviews</h2>
            <Link to="/interviews?new=1" className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300">Log a question</Link>
          </div>
          {interviews.length ? (
            <ul className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {interviews.slice(0, 4).map((x) => (
                <li key={x.id} className="py-3">
                  <Link to={`/interviews?company=${encodeURIComponent(x.company || '')}`} className="block hover:text-indigo-700 dark:hover:text-indigo-300">
                    <span className="block truncate text-sm font-medium text-slate-900 dark:text-white">{x.question}</span>
                    <span className="block text-xs text-slate-600 dark:text-slate-400">{[x.company, x.round, x.date && new Date(x.date + 'T00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })].filter(Boolean).join(' · ')}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Card className="p-4 text-sm text-slate-600 dark:text-slate-400">
              Write down every question right after an interview, while you still remember it. Over time this becomes your most accurate study guide.
              <Link to="/interviews?new=1" className="mt-3 block font-medium text-indigo-700 hover:underline dark:text-indigo-300">Log your first question</Link>
            </Card>
          )}
        </section>
      </div>

      <section aria-labelledby="prog-h">
        <h2 id="prog-h" className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Progress</h2>
        <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            ['Problems practised', p.doneCount(dsaIds), dsaIds.length, '/classes'],
            ['Concepts covered', p.doneCount(conceptIds), conceptIds.length, '/ui'],
            ['Mastered', p.countBy(allIds, 'mastered'), null, '/revise'],
            ['To revise', revise.length, null, '/revise'],
          ].map(([label, n, total, to]) => (
            <li key={label}>
              <Link to={to} className="group block">
                <span className="block text-sm text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white">{label}</span>
                <span className="mt-1 block text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                  {n}
                  {total && <span className="text-base font-normal text-slate-600 dark:text-slate-400"> / {total}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
