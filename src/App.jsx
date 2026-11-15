import { useEffect, useState } from 'react';
import { NavLink, Route, Routes, useLocation, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import DsaHome from './pages/DsaHome.jsx';
import DsaTopic from './pages/DsaTopic.jsx';
import DsaQuestion from './pages/DsaQuestion.jsx';
import QnaSection from './pages/QnaSection.jsx';
import Starred from './pages/Starred.jsx';
import { sections } from './data/sections.js';
import { links } from './data/profile.js';

const nav = [
  { to: '/dsa', label: 'DSA' },
  { to: '/ui', label: 'UI / Frontend' },
  { to: '/ai', label: 'Agentic AI' },
  { to: '/backend', label: 'Backend' },
  { to: '/starred', label: '★ Revision' },
];

function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);
  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
      title="Toggle theme"
    >
      {dark ? '☀︎' : '☾'}
    </button>
  );
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <ScrollTop />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-sm text-white">RJ</span>
            <span className="hidden sm:inline">Crack the Loop</span>
          </Link>
          <nav className="hidden flex-1 items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <a href={links.leetcode} target="_blank" rel="noreferrer" className="hidden rounded-lg px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:inline">
              LeetCode ↗
            </a>
            <a href={links.github} target="_blank" rel="noreferrer" className="hidden rounded-lg px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:inline">
              GitHub ↗
            </a>
            <ThemeToggle />
            <button onClick={() => setOpen((o) => !o)} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm md:hidden dark:border-slate-700">
              ☰
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-slate-200 px-4 py-2 md:hidden dark:border-slate-800">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                {n.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dsa" element={<DsaHome />} />
          <Route path="/dsa/:topicId" element={<DsaTopic />} />
          <Route path="/dsa/:topicId/:qid" element={<DsaQuestion />} />
          {sections.map((s) => (
            <Route key={s.id} path={`/${s.id}/:catId?`} element={<QnaSection section={s} />} />
          ))}
          <Route path="/starred" element={<Starred />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800">
        Built for Rishabh Jindal's interview prep · DSA notes from Bosscoder Academy · Progress is saved in this browser
      </footer>
    </div>
  );
}
