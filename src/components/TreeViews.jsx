import { useState } from 'react';

// One tree, four views. Left / right views pick one node per LEVEL (row);
// top / bottom views pick one node per COLUMN (horizontal distance from the root).
//
//          1
//        /   \
//       2     3
//      / \     \
//     4   5     6
//          \
//           7
const NODES = {
  1: { hd: 0, level: 0 },
  2: { hd: -1, level: 1 },
  3: { hd: 1, level: 1 },
  4: { hd: -2, level: 2 },
  5: { hd: 0, level: 2 },
  6: { hd: 2, level: 2 },
  7: { hd: 1, level: 3 },
};
const EDGES = [[1, 2], [1, 3], [2, 4], [2, 5], [3, 6], [5, 7]];
const VIEWS = {
  right: { label: 'Right view', seen: [1, 3, 6, 7], how: 'Stand on the right: you see the LAST node of each level (row).' },
  left: { label: 'Left view', seen: [1, 2, 4, 7], how: 'Stand on the left: you see the FIRST node of each level (row).' },
  top: { label: 'Top view', seen: [4, 2, 1, 3, 6], how: 'Look down from above: you see the HIGHEST node in each column. 3 hides 7, and 1 hides 5.' },
  bottom: { label: 'Bottom view', seen: [4, 2, 5, 7, 6], how: 'Look up from below: you see the LOWEST node in each column. 7 hides 3, and 5 hides 1.' },
};
const X = (hd) => 280 + hd * 90;
const Y = (level) => 70 + level * 72;
const R = 21;

export default function TreeViews({ visual }) {
  const [view, setView] = useState(visual.view || 'right');
  const v = VIEWS[view];
  const seen = new Set(v.seen);
  const byRow = view === 'left' || view === 'right';

  return (
    <div>
      <div role="tablist" aria-label="Which view" className="mb-3 flex flex-wrap gap-1 rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
        {Object.entries(VIEWS).map(([k, x]) => (
          <button key={k} role="tab" aria-selected={k === view} onClick={() => setView(k)}
            className={`rounded-md px-3 py-1.5 text-sm ${k === view ? 'bg-white font-medium text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}>
            {x.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox="0 0 560 340" className="min-w-[420px]" role="img" aria-label={`${v.label}: ${v.seen.join(', ')}. ${v.how}`}>
          <defs>
            <marker id="tv-eye" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>

          {/* guide lines: rows for left/right, columns for top/bottom */}
          {byRow
            ? [0, 1, 2, 3].map((l) => (
                <g key={l}>
                  <line x1={60} x2={500} y1={Y(l)} y2={Y(l)} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="4 5" />
                  <text x={view === 'right' ? 18 : 520} y={Y(l) + 4} fontSize="11" className="fill-slate-500 dark:fill-slate-400">L{l}</text>
                </g>
              ))
            : [-2, -1, 0, 1, 2].map((hd) => (
                <g key={hd}>
                  <line x1={X(hd)} x2={X(hd)} y1={40} y2={300} className="stroke-slate-200 dark:stroke-slate-800" strokeDasharray="4 5" />
                  <text x={X(hd)} y={view === 'top' ? 330 : 24} textAnchor="middle" fontSize="11" className="fill-slate-500 dark:fill-slate-400">{hd > 0 ? `+${hd}` : hd}</text>
                </g>
              ))}

          {EDGES.map(([a, b]) => (
            <line key={`${a}${b}`} x1={X(NODES[a].hd)} y1={Y(NODES[a].level)} x2={X(NODES[b].hd)} y2={Y(NODES[b].level)} stroke="#94a3b8" strokeWidth="1.75" />
          ))}

          {/* the "eye" arrows pointing at what you see */}
          {v.seen.map((id) => {
            const { hd, level } = NODES[id];
            const x = X(hd), y = Y(level);
            const [x1, y1, x2, y2] =
              view === 'right' ? [545, y, x + R + 6, y]
              : view === 'left' ? [15, y, x - R - 6, y]
              : view === 'top' ? [x, 8, x, y - R - 6]
              : [x, 335, x, y + R + 6];
            return <line key={`eye-${id}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#tv-eye)" />;
          })}

          {Object.entries(NODES).map(([id, { hd, level }]) => {
            const on = seen.has(Number(id));
            return (
              <g key={id}>
                <circle cx={X(hd)} cy={Y(level)} r={R} strokeWidth={on ? 3 : 2}
                  className={on ? 'fill-emerald-100 stroke-emerald-600 dark:fill-emerald-500/30 dark:stroke-emerald-400' : 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500'} />
                <text x={X(hd)} y={Y(level) + 6} textAnchor="middle" fontSize="16" fontWeight="700" className="fill-slate-800 dark:fill-slate-100">{id}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">{v.label}</span>
        {v.seen.map((id) => (
          <span key={id} className="flex h-8 min-w-8 items-center justify-center rounded-md bg-emerald-600 px-2 font-mono font-semibold text-white">{id}</span>
        ))}
      </div>
      <p className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
        {v.how}{' '}
        {byRow
          ? 'The dashed lines are the levels; "L0" is the root.'
          : 'The dashed lines are columns. The number is the horizontal distance: root 0, one step left −1, one step right +1.'}
      </p>
    </div>
  );
}
