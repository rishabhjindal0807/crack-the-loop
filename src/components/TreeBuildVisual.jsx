import { useEffect, useState } from 'react';

// Step-through for "build a tree from preorder + inorder".
// visual = { type: 'tree-build', preorder, inorder, parent: { [val]: parentVal | null }, depth: { [val]: n },
//   steps: [{ root, pre: [a, b], ins: [a, b], idx, built: [vals], code, caption }] }
// The tree is drawn so each node sits right above its position in the inorder array.

const CELL = 64;
const LEFT = 120; // x of inorder index 0

function Row({ label, values, range, rootAt, leftRange, rightRange }) {
  return (
    <div className="flex items-center">
      <span className="w-[120px] shrink-0 pr-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      {values.map((v, i) => {
        const inRange = range && i >= range[0] && i <= range[1];
        const cls =
          i === rootAt ? 'bg-orange-500 text-white border-orange-500'
          : leftRange && i >= leftRange[0] && i <= leftRange[1] ? 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-500/25 dark:text-indigo-100 dark:border-indigo-500/50'
          : rightRange && i >= rightRange[0] && i <= rightRange[1] ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-500/25 dark:text-emerald-100 dark:border-emerald-500/50'
          : inRange ? 'bg-white text-slate-900 border-slate-300 dark:bg-slate-900 dark:text-white dark:border-slate-600'
          : 'bg-transparent text-slate-400 border-slate-200 dark:text-slate-600 dark:border-slate-800';
        return (
          <span key={i} style={{ width: CELL - 6, marginRight: 6 }} className={`flex h-10 shrink-0 items-center justify-center rounded-md border font-mono text-[15px] font-semibold ${cls}`}>
            {v}
          </span>
        );
      })}
    </div>
  );
}

export default function TreeBuildVisual({ visual }) {
  const { preorder, inorder, parent, depth, steps } = visual;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return undefined;
    if (i >= steps.length - 1) {
      setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setI((x) => x + 1), 1900);
    return () => clearTimeout(t);
  }, [playing, i, steps.length]);

  const st = steps[i];
  const built = new Set(st.built);
  const n = inorder.length;
  const W = LEFT + n * CELL;
  const maxDepth = Math.max(...Object.values(depth));
  const H = 40 + (maxDepth + 1) * 70;
  const pos = (v) => [LEFT + inorder.indexOf(v) * CELL + (CELL - 6) / 2, 34 + depth[v] * 70];
  const hasRoot = st.idx !== undefined && st.idx !== null;
  const leftIn = hasRoot ? [st.ins[0], st.idx - 1] : null;
  const rightIn = hasRoot ? [st.idx + 1, st.ins[1]] : null;
  const count = hasRoot ? st.idx - st.ins[0] : 0;
  const leftPre = hasRoot ? [st.pre[0] + 1, st.pre[0] + count] : null;
  const rightPre = hasRoot ? [st.pre[0] + count + 1, st.pre[1]] : null;

  return (
    <div>
      <p className="mb-2 text-xs text-slate-600 sm:hidden dark:text-slate-400">Swipe the diagram sideways to see both arrays.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950" tabIndex={0} aria-label="Diagram, scrollable">
        <div style={{ width: W }}>
          <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={st.caption}>
            {inorder.map((v) => {
              const p = parent[v];
              if (p === null || p === undefined || !built.has(v) || !built.has(p)) return null;
              const [x1, y1] = pos(p), [x2, y2] = pos(v);
              return <line key={`e${v}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94a3b8" strokeWidth="2" />;
            })}
            {inorder.map((v) => {
              if (!built.has(v)) return null;
              const [x, y] = pos(v);
              const cur = v === st.root;
              return (
                <g key={`n${v}`}>
                  <circle cx={x} cy={y} r={20} strokeWidth={cur ? 3 : 2}
                    className={cur ? 'fill-orange-100 stroke-orange-500 dark:fill-orange-500/25' : 'fill-white stroke-indigo-500 dark:fill-slate-900 dark:stroke-indigo-400'} />
                  <text x={x} y={y + 5} textAnchor="middle" fontSize="15" fontWeight="700" className="fill-slate-800 dark:fill-slate-100">{v}</text>
                </g>
              );
            })}
          </svg>
          <div className="mt-2 space-y-2">
            <Row label="preorder" values={preorder} range={st.pre} rootAt={hasRoot ? st.pre[0] : -1} leftRange={leftPre} rightRange={rightPre} />
            <Row label="inorder" values={inorder} range={st.ins} rootAt={hasRoot ? st.idx : -1} leftRange={leftIn} rightRange={rightIn} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded bg-orange-500" /> root of this call</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded border border-indigo-300 bg-indigo-100" /> goes to the left subtree</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded border border-emerald-300 bg-emerald-100" /> goes to the right subtree</span>
        <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded border border-slate-200" /> not part of this call</span>
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
