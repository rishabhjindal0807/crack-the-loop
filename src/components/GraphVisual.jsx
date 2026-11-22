import { useEffect, useState } from 'react';

// Step-through diagram for graph traversals (BFS / DFS).
// visual = {
//   type: 'graph', title, directed?,
//   nodes: { [id]: [x, y] },            // positions in a 560 × 300 box
//   edges: [[a, b], …],
//   labels?: { [id]: 'source' | … },   // small text under a node
//   matrix?: number[][],  // show the adjacency matrix next to the graph; step.row highlights the row being scanned
//   listLabel?: 'queue' | 'call stack',   // a stack shows its top on the right
//   listMarker?: false,   // hide the front / top marker (e.g. for a plain 'path' list)
//   waitingLabel?: text for the "visited, waiting" legend entry,
//   steps: [{
//     seen: [ids],        // visited so far (marked when added to the queue / stack)
//     done: [ids],        // already taken out and processed
//     current: id,        // the node being processed in this step
//     list: [ids], front: number,   // the queue / stack contents; items before `front` are already used
//     tree: [[a, b]],     // edges that discovered a new node so far
//     hot: [[a, b]],      // edges looked at in this step (orange)
//     found: id,          // destination reached
//     result: [ids],      // output so far (traversals)
//     labels: { [id]: text },   // per-step text under nodes (overrides visual.labels)
//     row: index,         // matrix row being scanned
//     stat: { label, value },  // a counter, e.g. provinces found so far
//     code, caption,
//   }]
// }

const R = 22;
const W = 560;
const key = (a, b) => [a, b].sort().join('-');

export default function GraphVisual({ visual }) {
  const steps = visual.steps;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setI((x) => x + 1), 1700);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  const H = visual.height || 300;
  const st = steps[i];
  const seen = new Set(st.seen || []);
  const done = new Set(st.done || []);
  const tree = new Set((st.tree || []).map(([a, b]) => key(a, b)));
  const hot = new Set((st.hot || []).map(([a, b]) => key(a, b)));
  const list = st.list || [];
  const front = st.front || 0;
  const isStack = /stack/.test(visual.listLabel || '');
  const marker = visual.listMarker !== false;

  const nodeStyle = (id) => {
    if (st.found === id) return 'fill-emerald-100 stroke-emerald-600 dark:fill-emerald-500/30';
    if (st.current === id) return 'fill-orange-100 stroke-orange-500 dark:fill-orange-500/25';
    if (done.has(id)) return 'fill-indigo-600 stroke-indigo-600 dark:fill-indigo-500 dark:stroke-indigo-400';
    if (seen.has(id)) return 'fill-indigo-100 stroke-indigo-500 dark:fill-indigo-500/25';
    return 'fill-white stroke-slate-400 dark:fill-slate-900 dark:stroke-slate-500';
  };
  const textStyle = (id) => (done.has(id) && st.current !== id && st.found !== id ? 'fill-white' : 'fill-slate-800 dark:fill-slate-100');

  const line = (a, b) => {
    const [x1, y1] = visual.nodes[a], [x2, y2] = visual.nodes[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    const end = visual.directed ? R + 6 : R;
    return [x1 + (dx / len) * R, y1 + (dy / len) * R, x2 - (dx / len) * end, y2 - (dy / len) * end];
  };

  return (
    <div>
      <p className="mb-2 text-xs text-slate-600 sm:hidden dark:text-slate-400">Swipe the diagram sideways to see the whole graph.</p>
      <div className={visual.matrix ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]' : ''}>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950" tabIndex={0} aria-label="Graph diagram, scrollable">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[420px]" role="img" aria-label={st.caption}>
          <defs>
            {['#94a3b8', '#6366f1', '#f97316'].map((c) => (
              <marker key={c} id={`ga${c.slice(1)}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))}
          </defs>
          {visual.edges.map(([a, b]) => {
            const k = key(a, b);
            const c = hot.has(k) ? '#f97316' : tree.has(k) ? '#6366f1' : '#94a3b8';
            const [x1, y1, x2, y2] = line(a, b);
            return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={hot.has(k) || tree.has(k) ? 3 : 1.75} markerEnd={visual.directed ? `url(#ga${c.slice(1)})` : undefined} />;
          })}
          {Object.entries(visual.nodes).map(([id, [x, y]]) => (
            <g key={id}>
              <circle cx={x} cy={y} r={R} strokeWidth={st.current === id || st.found === id ? 3 : 2} className={nodeStyle(id)} />
              <text x={x} y={y + 6} textAnchor="middle" fontSize="16" fontWeight="700" className={textStyle(id)}>{id}</text>
              {(st.labels || visual.labels)?.[id] && (
                <text x={x} y={y + R + 18} textAnchor="middle" fontSize="12" fontWeight="600"
                  className={/✗/.test((st.labels || visual.labels)[id]) ? 'fill-rose-700 dark:fill-rose-300' : 'fill-slate-600 dark:fill-slate-400'}>{(st.labels || visual.labels)[id]}</text>
              )}
            </g>
          ))}
        </svg>
      </div>
      {visual.matrix && (
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-0.5 font-mono text-sm" aria-label="isConnected matrix">
            <caption className="mb-1 text-left font-sans text-xs font-medium text-slate-600 dark:text-slate-400">isConnected</caption>
            <thead>
              <tr>
                <th className="w-7" />
                {visual.matrix.map((_, j) => <th key={j} scope="col" className="w-8 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">{j}</th>)}
              </tr>
            </thead>
            <tbody>
              {visual.matrix.map((row, r) => (
                <tr key={r}>
                  <th scope="row" className={`pr-1 text-right text-xs font-semibold ${st.row === r ? 'text-orange-700 dark:text-orange-300' : 'text-slate-500 dark:text-slate-400'}`}>{r}</th>
                  {row.map((v, c) => (
                    <td key={c} className={`h-8 w-8 rounded text-center ${
                      st.row === r ? (v ? 'bg-orange-500 font-bold text-white' : 'bg-orange-100 text-orange-900 dark:bg-orange-500/20 dark:text-orange-200')
                        : v ? 'bg-indigo-100 font-bold text-indigo-900 dark:bg-indigo-500/25 dark:text-indigo-100' : 'bg-white text-slate-400 dark:bg-slate-900 dark:text-slate-600'
                    }`}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>

      {st.stat && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
          {st.stat.label}: <span className={`ml-1 inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 font-mono text-base font-bold text-white ${st.stat.value === 'no' ? 'bg-rose-600' : (st.stat.value === '?' || st.stat.value === '-1') ? 'bg-slate-500' : 'bg-emerald-600'}`}>{st.stat.value}</span>
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm" aria-label={`${visual.listLabel || 'queue'} contents`}>
        <span className="w-20 shrink-0 font-medium text-slate-700 dark:text-slate-300">{visual.listLabel || 'queue'}</span>
        {list.length === 0 && <span className="text-slate-600 dark:text-slate-400">empty</span>}
        {list.map((id, k) => (
          <span key={`${id}-${k}`} className="relative">
            <span className={`flex h-8 min-w-8 items-center justify-center rounded-md border px-2 font-mono font-semibold ${
              k < front ? 'border-slate-200 text-slate-400 line-through dark:border-slate-800 dark:text-slate-600' : 'border-indigo-300 bg-white text-slate-900 dark:border-indigo-500/50 dark:bg-slate-900 dark:text-white'
            }`}>{id}</span>
            {marker && !isStack && k === front && front < list.length && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-orange-700 dark:text-orange-300">front</span>}
            {marker && isStack && k === list.length - 1 && <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-orange-700 dark:text-orange-300">top</span>}
          </span>
        ))}
      </div>

      {st.result && (
        <div className="mt-6 flex flex-wrap items-center gap-2 text-sm" aria-label="result so far">
          <span className="w-20 shrink-0 font-medium text-slate-700 dark:text-slate-300">result</span>
          {st.result.length === 0 && <span className="text-slate-600 dark:text-slate-400">[ ]</span>}
          {st.result.map((id, k) => (
            <span key={k} className="flex h-8 min-w-8 items-center justify-center rounded-md bg-indigo-600 px-2 font-mono font-semibold text-white dark:bg-indigo-500">{id}</span>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-slate-400 bg-white dark:bg-slate-900" /> not visited</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-indigo-500 bg-indigo-100" /> {visual.waitingLabel || 'visited, waiting'}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full bg-indigo-600" /> done</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-full border-2 border-orange-500 bg-orange-100" /> processing now</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 bg-indigo-500" /> edge that found a new node</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          <button aria-label="Previous step" onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }} disabled={i === 0}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-slate-700">◀</button>
          <button onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying((p) => !p); }} className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700">
            {playing ? '❚❚ Pause' : i >= steps.length - 1 ? '↺ Replay' : '▶ Play'}
          </button>
          <button aria-label="Next step" onClick={() => { setPlaying(false); setI((x) => Math.min(steps.length - 1, x + 1)); }} disabled={i === steps.length - 1}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-slate-700">▶</button>
        </div>
        <span className="text-xs tabular-nums text-slate-600 dark:text-slate-400">Step {i + 1} / {steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, k) => (
            <button key={k} onClick={() => { setPlaying(false); setI(k); }} aria-label={`Step ${k + 1}`}
              className={`h-2 w-2 rounded-full ${k === i ? 'bg-indigo-600' : k < i ? 'bg-indigo-300' : 'bg-slate-300 dark:bg-slate-700'}`} />
          ))}
        </div>
      </div>
      <div className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800/60" aria-live="polite">
        {st.code && <code className="mb-1 block font-mono text-[13px] font-semibold text-orange-700 dark:text-orange-300">{st.code}</code>}
        <span className="text-slate-700 dark:text-slate-300">{st.caption}</span>
      </div>
    </div>
  );
}
