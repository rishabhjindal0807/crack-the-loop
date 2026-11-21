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


// Find the Town Judge, n = 4, trust = [[1,3],[1,4],[2,3],[2,4],[4,3]]: each node with its score in − out.
function TownJudge() {
  const N = { 1: [90, 70], 2: [90, 250], 4: [240, 160], 3: [430, 160] };
  const R = 24;
  const edge = (a, b, bend = 0) => {
    const [x1, y1] = N[a], [x2, y2] = N[b];
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    const sx = x1 + (dx / len) * R, sy = y1 + (dy / len) * R;
    const ex = x2 - (dx / len) * (R + 6), ey = y2 - (dy / len) * (R + 6);
    if (!bend) return `M ${sx} ${sy} L ${ex} ${ey}`;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 + bend;
    const a1 = Math.atan2(my - y1, mx - x1), a2 = Math.atan2(y2 - my, x2 - mx);
    return `M ${x1 + Math.cos(a1) * R} ${y1 + Math.sin(a1) * R} Q ${mx} ${my} ${x2 - Math.cos(a2) * (R + 6)} ${y2 - Math.sin(a2) * (R + 6)}`;
  };
  const score = { 1: '−2', 2: '−2', 3: '+3', 4: '0' };
  const edges = [[1, 4, 0], [2, 4, 0], [4, 3, 0], [1, 3, -90], [2, 3, 90]];
  return (
    <svg viewBox="0 0 560 320" className="mx-auto w-full max-w-xl" role="img"
      aria-label="Four people. 1 trusts 3 and 4, 2 trusts 3 and 4, 4 trusts 3. Person 3 is trusted by everyone else and trusts nobody: score +3 = n − 1, the judge.">
      <defs>
        <marker id="tj-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
        </marker>
      </defs>
      {edges.map(([a, b, bend]) => <path key={`${a}${b}`} d={edge(a, b, bend)} fill="none" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#tj-arrow)" />)}
      {Object.entries(N).map(([v, [x, y]]) => {
        const judge = v === '3';
        return (
          <g key={v}>
            <circle cx={x} cy={y} r={R} strokeWidth={judge ? 3 : 2} className={judge ? 'fill-emerald-50 stroke-emerald-600 dark:fill-emerald-500/20' : 'fill-white stroke-slate-400 dark:fill-slate-900'} />
            <text x={x} y={y + 6} textAnchor="middle" fontSize="17" fontWeight="700" className="fill-slate-800 dark:fill-slate-100">{v}</text>
            <text x={x} y={v === '2' ? y + 46 : y - 34} textAnchor="middle" fontSize="13" fontWeight="600" className={judge ? 'fill-emerald-700 dark:fill-emerald-400' : 'fill-slate-600 dark:fill-slate-400'}>
              score {score[v]}
            </text>
          </g>
        );
      })}
      <text x={430} y={222} textAnchor="middle" fontSize="13" fontWeight="700" className="fill-emerald-700 dark:fill-emerald-400">judge: in 3, out 0</text>
      <text x={430} y={240} textAnchor="middle" fontSize="12" className="fill-slate-600 dark:fill-slate-400">score = n − 1 = 3</text>
    </svg>
  );
}

export const figures = { 'floyd-cycle': FloydCycle, 'town-judge': TownJudge };
