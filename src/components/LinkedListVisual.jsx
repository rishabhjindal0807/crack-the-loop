import { useEffect, useState } from 'react';

// Step-through diagram of linked-list pointer changes.
// visual = { title, steps: [{ order: ['D','1',…,'null'], edges: [['D','1'], …], changed: [['1','3']],
//            pointers: { prev: 'D', first: '1' }, code: 'first.next = second.next', caption: '…' }] }
// `order` may be omitted to reuse the previous step's layout.

const W = 96; // horizontal spacing
const BOX = { w: 52, h: 34 };
const PTR_COLORS = {
  prev: '#6366f1',
  first: '#f97316',
  second: '#10b981',
  slow: '#6366f1',
  fast: '#f97316',
  curr: '#f97316',
  head: '#64748b',
  ptr1: '#0ea5e9',
  ptr2: '#10b981',
  odd: '#6366f1',
  even: '#10b981',
  evenHead: '#64748b',
};

function Arrow({ x1, x2, y, kind, highlight, id, depth = 64, color = highlight ? '#f97316' : '#94a3b8' }) {
  const marker = `url(#m${color.slice(1)}-${id})`;
  const sw = highlight ? 2.5 : 1.6;
  if (kind === 'straight') {
    return <line x1={x1 + BOX.w / 2} y1={y} x2={x2 - BOX.w / 2 - 4} y2={y} stroke={color} strokeWidth={sw} markerEnd={marker} />;
  }
  // forward skip → arc above; backward → arc below
  const above = kind === 'forward';
  const sx = x1 + (above ? 8 : -8);
  const ex = x2 + (above ? -8 : 8);
  const sy = y + (above ? -BOX.h / 2 : BOX.h / 2);
  const ey = sy + (above ? -3 : 3);
  const lift = (above ? Math.min(70, 26 + Math.abs(x2 - x1) * 0.18) : depth) * (above ? -1 : 1);
  const d = `M ${sx} ${sy} C ${sx} ${sy + lift}, ${ex} ${ey + lift}, ${ex} ${ey}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={sw} markerEnd={marker} />;
}

export default function LinkedListVisual({ visual, uid }) {
  const steps = visual.steps;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setI((x) => x + 1), 1600);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  // Across all steps: are there backward arcs (drawn below) / forward skips (drawn above)?
  // With only backward arcs, pointer labels go above the nodes so the arcs stay visible.
  let lay = steps[0].order, hasBack = false, hasFwd = false, maxPills = 1;
  for (const st of steps) {
    if (st.order) lay = st.order;
    const ix = Object.fromEntries(lay.map((n, k) => [n, k]));
    for (const [a, b] of st.edges) { const d = ix[b] - ix[a]; if (d < 0) hasBack = true; if (d > 1) hasFwd = true; }
    const per = {}; for (const n of Object.values(st.pointers || {})) per[n] = (per[n] || 0) + 1;
    maxPills = Math.max(maxPills, ...Object.values(per), 1);
  }
  const pillsAbove = hasBack && !hasFwd;
  const backDepth = pillsAbove ? 64 : Math.max(64, (maxPills * 20 + 22) / 0.75);

  // carry forward the last specified layout
  let order = steps[0].order;
  for (let k = 0; k <= i; k++) if (steps[k].order) order = steps[k].order;
  const step = steps[i];
  const pos = Object.fromEntries(order.map((n, k) => [n, 40 + k * W]));
  const idx = Object.fromEntries(order.map((n, k) => [n, k]));
  const y = 82;
  const width = 40 + (order.length - 1) * W + 50;
  const isChanged = (a, b) => (step.changed || []).some(([x, z]) => x === a && z === b);
  const id = uid.replace(/[^a-z0-9]/gi, '');

  // optional colour groups, e.g. the odd chain and the even chain
  const groups = visual.groups || [];
  const groupOf = (n) => groups.find((g) => g.nodes.includes(n));
  const edgeColor = (a, b) => {
    if (isChanged(a, b)) return '#f97316';
    const g = groupOf(a);
    return g && (b === 'null' || groupOf(b) === g) ? g.color : '#94a3b8';
  };

  // group pointer labels by node
  const labels = {};
  for (const [name, node] of Object.entries(step.pointers || {})) (labels[node] ||= []).push(name);

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox={`0 0 ${width} 190`} className="min-w-[560px]" role="img" aria-label={step.caption}>
          <defs>
            {['#94a3b8', '#f97316', ...groups.map((g) => g.color)].map((c) => (
              <marker key={c} id={`m${c.slice(1)}-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))}
          </defs>

          {step.edges.map(([a, b]) => {
            const d = idx[b] - idx[a];
            const kind = d === 1 ? 'straight' : d > 1 ? 'forward' : 'backward';
            return <Arrow key={`${a}-${b}`} x1={pos[a]} x2={pos[b]} y={y} kind={kind} highlight={isChanged(a, b)} color={edgeColor(a, b)} id={id} depth={backDepth} />;
          })}

          {order.map((n) => (
            <g key={n} transform={`translate(${pos[n]}, ${y})`}>
              {n === 'null' ? (
                <text textAnchor="middle" dy="5" className="fill-slate-400" fontSize="14" fontFamily="ui-monospace, monospace">
                  null
                </text>
              ) : (
                <>
                  <rect
                    x={-BOX.w / 2}
                    y={-BOX.h / 2}
                    width={BOX.w}
                    height={BOX.h}
                    rx="8"
                    className={n === 'D' ? 'fill-slate-200 stroke-slate-400 dark:fill-slate-800' : 'fill-white stroke-indigo-400 dark:fill-slate-900'}
                    strokeWidth={groupOf(n) ? 2.4 : 1.6}
                    style={groupOf(n) ? { stroke: groupOf(n).color } : undefined}
                    strokeDasharray={n === 'D' ? '4 3' : undefined}
                  />
                  <text textAnchor="middle" dy={n === 'D' ? 4 : 5} fontSize={n === 'D' ? 11 : 15} fontWeight="600" className="fill-slate-700 dark:fill-slate-200">
                    {n === 'D' ? 'dummy' : n}
                  </text>
                </>
              )}
              {(labels[n] || []).map((name, k) => (
                <g key={name} transform={`translate(0, ${pillsAbove ? -(BOX.h / 2 + 14 + k * 20) : BOX.h / 2 + 18 + k * 20})`}>
                  <rect x={-30} y={-11} width={60} height={18} rx="9" fill={PTR_COLORS[name] || '#64748b'} />
                  <text textAnchor="middle" dy="2" fontSize="11" fontWeight="600" fill="white">
                    {name}
                  </text>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {groups.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          {groups.map((g) => (
            <span key={g.label} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 rounded" style={{ background: g.color }} /> {g.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-5 rounded bg-orange-500" /> link changed in this step</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <div className="flex gap-1.5">
          <button aria-label="Previous step" onClick={() => { setPlaying(false); setI((x) => Math.max(0, x - 1)); }} disabled={i === 0}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-slate-700">◀</button>
          <button
            onClick={() => { if (i >= steps.length - 1) setI(0); setPlaying((p) => !p); }}
            className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {playing ? '❚❚ Pause' : i >= steps.length - 1 ? '↺ Replay' : '▶ Play'}
          </button>
          <button aria-label="Next step" onClick={() => { setPlaying(false); setI((x) => Math.min(steps.length - 1, x + 1)); }} disabled={i === steps.length - 1}
            className="rounded-lg border border-slate-200 px-2.5 py-1 text-sm disabled:opacity-40 dark:border-slate-700">▶</button>
        </div>
        <span className="text-xs tabular-nums text-slate-500">
          Step {i + 1} / {steps.length}
        </span>
        <div className="flex gap-1">
          {steps.map((_, k) => (
            <button key={k} onClick={() => { setPlaying(false); setI(k); }} aria-label={`Step ${k + 1}`}
              className={`h-2 w-2 rounded-full ${k === i ? 'bg-indigo-600' : k < i ? 'bg-indigo-300' : 'bg-slate-300 dark:bg-slate-700'}`} />
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800/60" aria-live="polite">
        {step.code && <code className="mb-1 block font-mono text-[13px] font-semibold text-orange-600 dark:text-orange-400">{step.code}</code>}
        <span className="text-slate-700 dark:text-slate-300">{step.caption}</span>
      </div>
    </div>
  );
}
