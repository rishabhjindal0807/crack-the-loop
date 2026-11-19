import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Today from './pages/Home.jsx';
import DsaHome from './pages/DsaHome.jsx';
import DsaTopic from './pages/DsaTopic.jsx';
import QnaSection from './pages/QnaSection.jsx';
import Revise from './pages/Revise.jsx';
import LeetCode from './pages/LeetCode.jsx';
import Classes from './pages/Classes.jsx';
import ClassDetail from './pages/ClassDetail.jsx';
import Interviews from './pages/Interviews.jsx';
import CommandSearch from './components/CommandSearch.jsx';
import { Icon } from './components/ui.jsx';
import { sections } from './data/sections.js';
import { links, profile } from './data/profile.js';
import { progressStore } from './lib/progress.js';

// The problem page carries KaTeX + the diagram engine; load it only when a problem is opened.
const DsaQuestion = lazy(() => import('./pages/DsaQuestion.jsx'));

const nav = [
  { to: '/', label: 'Today', icon: 'today', match: (p) => p === '/' },
  { to: '/classes', label: 'Practice', icon: 'practice', match: (p) => /^\/(classes|dsa|leetcode)(\/|$)/.test(p) },
  { to: '/ui', label: 'Concepts', icon: 'concepts', match: (p) => /^\/(ui|ai|backend)(\/|$)/.test(p) },
  { to: '/interviews', label: 'Interviews', icon: 'interviews', match: (p) => p.startsWith('/interviews') },
  { to: '/revise', label: 'Revise', icon: 'revise', match: (p) => p.startsWith('/revise') },
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
      className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon name={dark ? 'sun' : 'moon'} size={18} />
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

function Backup() {
  const file = useRef(null);
  const [msg, setMsg] = useState('');
  const download = () => {
    const blob = new Blob([progressStore.export()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `crack-the-loop-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Backup downloaded.');
  };
  const restore = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    try {
      const n = progressStore.import(await f.text());
      setMsg(`Restored: ${n.items} progress entries, ${n.notes} notes, ${n.interviews} interview questions.`);
    } catch (err) {
      setMsg(`Couldn't restore: ${err.message}`);
    }
  };
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span>Your progress, notes and interview log are saved in this browser only.</span>
      <button onClick={download} className="font-medium text-slate-900 underline underline-offset-2 hover:text-indigo-600 dark:text-white">
        Export backup
      </button>
      <button onClick={() => file.current?.click()} className="font-medium text-slate-900 underline underline-offset-2 hover:text-indigo-600 dark:text-white">
        Import backup
      </button>
      <input ref={file} type="file" accept="application/json,.json" className="hidden" onChange={restore} aria-label="Import backup file" />
      <span aria-live="polite" className="text-slate-700 dark:text-slate-300">{msg}</span>
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (e.key === '/' && !e.target.closest?.('input, textarea, select, [contenteditable]')) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => setSearchOpen(false), [pathname]);

  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }}
        className="sr-only z-50 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-3">
        Skip to content
      </a>
      <ScrollTop />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4">
          <Link to="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-900 dark:text-white" aria-label="Crack the Loop — Today">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-bold text-white dark:bg-white dark:text-slate-900">RJ</span>
            <span className="hidden sm:inline">Crack the Loop</span>
          </Link>
          <nav aria-label="Main" className="hidden flex-1 items-center gap-1 md:flex">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                aria-current={n.match(pathname) ? 'page' : undefined}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  n.match(pathname) ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-2.5 text-sm text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
              aria-label="Search everything"
            >
              <Icon name="search" size={16} />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden rounded bg-slate-100 px-1.5 font-sans text-[11px] text-slate-600 lg:inline dark:bg-slate-800 dark:text-slate-400">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* phones: the five destinations are always one tap away */}
      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95">
        <div className="grid grid-cols-5">
          {nav.map((n) => {
            const on = n.match(pathname);
            return (
              <NavLink key={n.to} to={n.to} aria-current={on ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${on ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                <Icon name={n.icon} size={22} />
                {n.label}
              </NavLink>
            );
          })}
        </div>
      </nav>

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-8 focus:outline-none sm:py-10">
        <Suspense fallback={<p className="text-sm text-slate-500">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/dsa" element={<DsaHome />} />
            <Route path="/dsa/:topicId" element={<DsaTopic />} />
            <Route path="/dsa/:topicId/:qid" element={<DsaQuestion />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:classId" element={<ClassDetail />} />
            <Route path="/leetcode" element={<LeetCode />} />
            {sections.map((s) => (
              <Route key={s.id} path={`/${s.id}/:catId?`} element={<QnaSection section={s} />} />
            ))}
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/revise" element={<Revise />} />
            <Route path="/starred" element={<Navigate to="/revise" replace />} />
            <Route path="*" element={<Today />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-6 text-sm text-slate-600 dark:text-slate-400">
          <Backup />
          <p>
            {profile.name} · {profile.title} ·{' '}
            <a className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white" href={links.leetcode} target="_blank" rel="noreferrer">LeetCode</a> ·{' '}
            <a className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white" href={links.github} target="_blank" rel="noreferrer">GitHub</a> ·{' '}
            <a className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white" href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> ·{' '}
            <a className="underline underline-offset-2 hover:text-slate-900 dark:hover:text-white" href={links.bosscoder} target="_blank" rel="noreferrer">Bosscoder curriculum</a>
          </p>
        </div>
      </footer>

      <CommandSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
