import { useEffect, useState } from 'react';

// Step-through diagram of linked-list pointer changes.
// visual = { title, groups?, steps: [{ order, edges, changed, pointers, code, caption }] }
// - order: ['D','1',…,'null'] for one row, or [[…top row…], […bottom row…]] for two rows.
//   '' leaves a slot empty; 'D' is a dummy node; ids starting with 'null' render as null;
//   a trailing ' becomes a prime (7' → 7′). Omit order to reuse the previous step's layout.
// - edges: [a, b] for next pointers, or [a, b, { random: true, side: 'above' | 'below', map: true }].
//   random = dashed pink random pointer, map = dotted original → copy link.
// - changed: [[a, b], …] edges drawn in orange this step.

const W = 96; // horizontal spacing
const BOX = { w: 52, h: 34 };
const ROW_GAP = 170;
const GREY = '#94a3b8';
const ORANGE = '#f97316';
const PINK = '#ec4899';
const MAPC = '#cbd5e1';
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
  secondlist: '#10b981',
  temp: '#64748b',
  next: '#94a3b8',
  copy: '#10b981',
};

const rowsOf = (order) => (Array.isArray(order[0]) ? order : [order]);
const isNull = (n) => n.startsWith('null');
const label = (n) => (n === 'D' ? 'dummy' : n.replace(/'$/, '′'));

function layout(order, maxCols = 0) {
  const rows = rowsOf(order);
  const multi = rows.length > 1;
  const y0 = multi ? 100 : 82;
  const cols = Math.max(...rows.map((row) => row.length));
  const off = maxCols > cols ? ((maxCols - cols) * W) / 2 : 0; // centre narrower layouts
  const pos = {};
  rows.forEach((row, r) => row.forEach((n, c) => { if (n) pos[n] = { x: 40 + off + c * W, y: y0 + r * ROW_GAP, r, c }; }));
  return { rows, multi, pos, height: multi ? y0 + (rows.length - 1) * ROW_GAP + 90 : 190 };
}

function edgeGeometry(pa, pb, opts, multi, depth) {
  const h = BOX.h / 2;
  if (pa === pb) {
    // self loop on the outer side
    const up = (opts.side || (pa.r > 0 ? 'below' : 'above')) === 'above';
    const s = up ? -1 : 1;
    const y = pa.y + s * h;
    return `M ${pa.x - 10} ${y} C ${pa.x - 30} ${y + s * 42}, ${pa.x + 30} ${y + s * 42}, ${pa.x + 12} ${y + s * 3}`;
  }
  if (pa.r !== pb.r) {
    const s = pb.r > pa.r ? 1 : -1;
    const sy = pa.y + s * h, ey = pb.y - s * (h + 4);
    const my = (sy + ey) / 2;
    return pa.x === pb.x ? `M ${pa.x} ${sy} L ${pb.x} ${ey}` : `M ${pa.x} ${sy} C ${pa.x} ${my}, ${pb.x} ${my}, ${pb.x} ${ey}`;
  }
  const dc = pb.c - pa.c;
  if (!opts.random && !opts.side && dc === 1) return { straight: true };
  const side = opts.side || (multi ? (pa.r === 0 ? 'above' : 'below') : dc > 0 ? 'above' : 'below');
  const above = side === 'above';
  const dir = Math.sign(dc);
  const sx = pa.x + 8 * dir, ex = pb.x - 8 * dir;
  const sy = pa.y + (above ? -h : h);
  const ey = sy + (above ? -3 : 3);
  const lift = (above ? Math.min(70, 26 + Math.abs(pb.x - pa.x) * 0.18) : depth) * (above ? -1 : 1);
  return `M ${sx} ${sy} C ${sx} ${sy + lift}, ${ex} ${ey + lift}, ${ex} ${ey}`;
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

  // Across all steps: backward arcs (below) vs forward skips (above), widest layout, random/map links.
  // With only backward arcs, pointer labels go above the nodes so the arcs stay visible.
  let lay = steps[0].order, hasBack = false, hasFwd = false, maxPills = 1, maxCols = 1, hasRandom = false, hasMap = false;
  for (const st of steps) {
    if (st.order) lay = st.order;
    const L = layout(lay);
    maxCols = Math.max(maxCols, ...L.rows.map((r) => r.length));
    for (const [a, b, o = {}] of st.edges) {
      if (o.random) hasRandom = true;
      if (o.map) hasMap = true;
      const pa = L.pos[a], pb = L.pos[b];
      if (o.random || o.map || o.side || !pa || !pb || pa.r !== pb.r) continue;
      if (pb.c < pa.c) hasBack = true;
      if (pb.c - pa.c > 1) hasFwd = true;
    }
    const per = {};
    for (const n of Object.values(st.pointers || {})) per[n] = (per[n] || 0) + 1;
    maxPills = Math.max(maxPills, ...Object.values(per), 1);
  }
  const pillsAbove = visual.pillsAbove ?? (hasBack && !hasFwd);
  const backDepth = pillsAbove ? 64 : Math.max(64, (maxPills * 20 + 22) / 0.75);

  // carry forward the last specified layout
  let order = steps[0].order;
  for (let k = 0; k <= i; k++) if (steps[k].order) order = steps[k].order;
  const step = steps[i];
  const { multi, pos, height } = layout(order, maxCols);
  const width = 40 + (maxCols - 1) * W + 50;
  const isChanged = (a, b) => (step.changed || []).some(([x, z]) => x === a && z === b);
  const id = uid.replace(/[^a-z0-9]/gi, '');

  // optional colour groups, e.g. the odd chain and the even chain
  const groups = visual.groups || [];
  const groupOf = (n) => groups.find((g) => g.nodes.includes(n));
  const edgeColor = (a, b, o) => {
    if (isChanged(a, b)) return ORANGE;
    if (o.random) return PINK;
    if (o.map) return MAPC;
    const g = groupOf(a);
    return g && (isNull(b) || groupOf(b) === g) ? g.color : GREY;
  };

  // group pointer labels by node
  const labels = {};
  for (const [name, node] of Object.entries(step.pointers || {})) (labels[node] ||= []).push(name);
  const marker = (c) => `url(#m${c.slice(1)}-${id})`;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[560px]" role="img" aria-label={step.caption}>
          <defs>
            {[...new Set([GREY, ORANGE, PINK, MAPC, ...groups.map((g) => g.color)])].map((c) => (
              <marker key={c} id={`m${c.slice(1)}-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))}
          </defs>

          {step.edges.map(([a, b, o = {}]) => {
            const pa = pos[a], pb = pos[b];
            if (!pa || !pb) return null;
            const color = edgeColor(a, b, o);
            const sw = isChanged(a, b) ? 2.5 : o.map ? 1.4 : 1.6;
            const dash = o.random ? '5 4' : o.map ? '2 4' : undefined;
            const g = edgeGeometry(pa, pb, o, multi, backDepth);
            const key = `${a}-${b}-${o.random ? 'r' : o.map ? 'm' : 'n'}`;
            if (g.straight) {
              return <line key={key} x1={pa.x + BOX.w / 2} y1={pa.y} x2={pb.x - BOX.w / 2 - 4} y2={pb.y} stroke={color} strokeWidth={sw} markerEnd={marker(color)} />;
            }
            return <path key={key} d={g} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={dash} markerEnd={marker(color)} />;
          })}

          {Object.entries(pos).map(([n, p]) => (
            <g key={n} transform={`translate(${p.x}, ${p.y})`}>
              {isNull(n) ? (
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
                    {label(n)}
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

      {(groups.length > 0 || hasRandom || hasMap) && (
        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
          {groups.map((g) => (
            <span key={g.label} className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-5 rounded" style={{ background: g.color }} /> {g.label}
            </span>
          ))}
          {hasRandom && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dashed" style={{ borderColor: PINK }} /> random pointer
            </span>
          )}
          {hasMap && (
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-5 border-t-2 border-dotted border-slate-300" /> map: original → copy
            </span>
          )}
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
