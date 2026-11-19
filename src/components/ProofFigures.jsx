// Static figures used by the "Mathematical proof" card (q.math.figure).

const P = (cx, cy, r, t) => [cx + r * Math.cos(t), cy + r * Math.sin(t)];

// The "ρ" shape of a list with a cycle: tail of length a, cycle of length L, meeting point b into the cycle.
// Drawn with the 1 → 2 → 3 → 4 → 5 → 6 (6 → 3) example: a = 2, L = 4, b = 2.
function FloydCycle() {
  const cx = 380, cy = 168, r = 92, nr = 17;
  const S = Math.PI; // cycle start sits on the left of the circle
  const node = (t) => P(cx, cy, r, t);
  const cyc = [
    ['3', S], ['4', S + Math.PI / 2], ['5', S + Math.PI], ['6', S + 1.5 * Math.PI],
  ];
  const gap = 0.24; // radians kept clear around each node
  const arc = (t1, t2, cls, id) => {
    const [x1, y1] = node(t1 + gap);
    const [x2, y2] = node(t2 - gap);
    return <path key={id} d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`} fill="none" strokeWidth="3" className={cls} markerEnd={`url(#fc-${id.split('-')[0]})`} />;
  };
  const tail = [['1', 90], ['2', 190]];
  const [sx] = node(S);

  return (
    <svg viewBox="0 0 560 330" className="mx-auto w-full max-w-xl" role="img"
      aria-label="Linked list shaped like the letter rho: a tail of a nodes leads into a cycle of length L; slow and fast meet b steps into the cycle.">
      <defs>
        {[['a', '#64748b'], ['b', '#6366f1'], ['r', '#f97316']].map(([k, c]) => (
          <marker key={k} id={`fc-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
          </marker>
        ))}
      </defs>

      {/* tail: head → cycle start, length a */}
      <line x1={tail[0][1] + nr} y1={cy} x2={tail[1][1] - nr - 4} y2={cy} stroke="#64748b" strokeWidth="3" markerEnd="url(#fc-a)" />
      <line x1={tail[1][1] + nr} y1={cy} x2={sx - nr - 4} y2={cy} stroke="#64748b" strokeWidth="3" markerEnd="url(#fc-a)" />
      <path d={`M ${tail[0][1]} ${cy + 34} v 8 H ${sx} v -8`} fill="none" stroke="#64748b" strokeWidth="1.5" />
      <text x={(tail[0][1] + sx) / 2} y={cy + 62} textAnchor="middle" fontSize="15" fontWeight="700" fill="#475569">a = 2</text>
      <text x={(tail[0][1] + sx) / 2} y={cy + 80} textAnchor="middle" fontSize="11" fill="#64748b">head → cycle start</text>

      {/* cycle: S → M is b (indigo), M → S is L − b (orange) */}
      {arc(S, S + Math.PI / 2, 'stroke-indigo-500', 'b-1')}
      {arc(S + Math.PI / 2, S + Math.PI, 'stroke-indigo-500', 'b-2')}
      {arc(S + Math.PI, S + 1.5 * Math.PI, 'stroke-orange-500', 'r-1')}
      {arc(S + 1.5 * Math.PI, S + 2 * Math.PI, 'stroke-orange-500', 'r-2')}
      <text x={cx} y={cy - r - 44} textAnchor="middle" fontSize="15" fontWeight="700" fill="#6366f1">b = 2</text>
      <text x={cx} y={cy - r - 28} textAnchor="middle" fontSize="11" fill="#6366f1">start → meeting point</text>
      <text x={cx} y={cy + r + 34} textAnchor="middle" fontSize="15" fontWeight="700" fill="#f97316">L − b = 2</text>
      <text x={cx} y={cy + r + 50} textAnchor="middle" fontSize="11" fill="#f97316">meeting point → start</text>
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="600" className="fill-slate-500">cycle</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fontSize="13" className="fill-slate-500">L = 4</text>

      {/* nodes */}
      {[...tail.map(([v, x]) => [v, x, cy]), ...cyc.map(([v, t]) => [v, ...node(t)])].map(([v, x, y]) => (
        <g key={v}>
          <circle cx={x} cy={y} r={nr} strokeWidth="2"
            className={v === '3' ? 'fill-emerald-50 stroke-emerald-500 dark:fill-emerald-500/20' : v === '5' ? 'fill-indigo-50 stroke-indigo-500 dark:fill-indigo-500/20' : 'fill-white stroke-slate-400 dark:fill-slate-900'} />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" className="fill-slate-700 dark:fill-slate-200">{v}</text>
        </g>
      ))}
      <text x={tail[0][1]} y={cy - 28} textAnchor="middle" fontSize="12" fontWeight="600" className="fill-slate-500">head</text>
      <text x={sx - 6} y={cy - 28} textAnchor="end" fontSize="12" fontWeight="700" fill="#10b981">S (start)</text>
      <text x={cx + r + 26} y={cy + 5} fontSize="12" fontWeight="700" fill="#6366f1">M (meet)</text>
    </svg>
  );
}

export const figures = { 'floyd-cycle': FloydCycle };
