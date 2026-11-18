import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { topics, allQuestions } from '../data/dsa/index.js';
import { sections } from '../data/sections.js';
import { profile, links } from '../data/profile.js';
import { useProgress } from '../lib/progress.js';
import { Card, ProgressBar, Badge, diffColor } from '../components/ui.jsx';
import { dedent } from '../lib/Markdown.jsx';
import { lcSubmissions } from '../data/leetcode.js';

export default function Home() {
  const p = useProgress();
  const dsaIds = allQuestions.map((q) => q.uid);

  const cards = [
    {
      to: '/dsa',
      title: 'DSA',
      icon: '🧮',
      desc: `${topics.length} topics · ${allQuestions.length} problems with JavaScript solutions you can run`,
      ids: dsaIds,
    },
    ...sections.map((s) => {
      const ids = s.categories.flatMap((c) => c.items.map((i) => `${s.id}:${i.id}`));
      return { to: `/${s.id}`, title: s.title, icon: s.icon, desc: s.tagline, ids };
    }),
  ];

  // Next 3 DSA problems not yet done, in curriculum order
  const next = useMemo(() => allQuestions.filter((q) => !p.isDone(q.uid)).slice(0, 3), [p]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white shadow-lg sm:p-10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <p className="text-sm font-medium text-indigo-200">Interview preparation hub</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
        <p className="mt-1 text-indigo-100">{profile.title}</p>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-indigo-100/90">{profile.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <a className="rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25" href={links.leetcode} target="_blank" rel="noreferrer">LeetCode profile ↗</a>
          <a className="rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25" href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
          <a className="rounded-lg bg-white/15 px-3 py-1.5 hover:bg-white/25" href={links.bosscoder} target="_blank" rel="noreferrer">Bosscoder curriculum ↗</a>
        </div>
      </section>

      <Link to="/leetcode" className="group block">
        <Card className="flex flex-wrap items-center justify-between gap-4 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-5 transition group-hover:shadow-md dark:border-orange-500/30 dark:from-orange-500/10 dark:to-amber-500/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-600 dark:text-orange-400">My LeetCode</p>
            <p className="mt-1 text-lg font-semibold">
              {lcSubmissions.filter((s) => s.verdict === 'AC').length} solved
              <span className="ml-2 text-sm font-normal text-slate-500">
                {['Easy', 'Medium', 'Hard'].map((d) => `${lcSubmissions.filter((s) => s.verdict === 'AC' && s.difficulty === d).length} ${d}`).join(' · ')}
              </span>
            </p>
          </div>
          <span className="text-sm font-medium text-orange-700 dark:text-orange-300">
            ↻ {lcSubmissions.filter((s) => s.verdict !== 'AC').length} to retry · View dashboard →
          </span>
        </Card>
      </Link>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="group">
            <Card className="h-full p-5 transition group-hover:-translate-y-0.5 group-hover:border-indigo-300 group-hover:shadow-md dark:group-hover:border-indigo-500/50">
              <div className="text-2xl">{c.icon}</div>
              <h2 className="mt-3 font-semibold">{c.title}</h2>
              <p className="mt-1 min-h-10 text-sm text-slate-500 dark:text-slate-400">{c.desc}</p>
              <div className="mt-4">
                <ProgressBar value={p.doneCount(c.ids)} total={c.ids.length} />
              </div>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-5">
        <Card className="p-6 lg:col-span-3">
          <h2 className="font-semibold">“Tell me about yourself” — 60-second pitch</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {dedent(profile.pitch).replace(/\n(?!\n)/g, ' ')}
          </p>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold">Up next in DSA</h2>
          <ul className="mt-3 space-y-2">
            {next.map((q) => (
              <li key={q.uid}>
                <Link to={`/dsa/${q.topicId}/${q.id}`} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm hover:border-indigo-300 dark:border-slate-800">
                  <span>
                    <span className="block font-medium">{q.title}</span>
                    <span className="text-xs text-slate-500">{q.topicTitle}</span>
                  </span>
                  <Badge className={diffColor[q.difficulty]}>{q.difficulty}</Badge>
                </Link>
              </li>
            ))}
            {next.length === 0 && <li className="text-sm text-slate-500">All done — time for revision ★</li>}
          </ul>
        </Card>
      </section>
    </div>
  );
}
