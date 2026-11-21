export default {
  id: 'graphs',
  title: 'Graphs',
  icon: '🕸️',
  source: 'notes',
  blurb: 'BFS/DFS on grids and adjacency lists, topological sort, union-find, Dijkstra.',
  concepts: `
    - **Degree:** in-degree = edges coming **into** a node, out-degree = edges going **out**. Many problems need only these counts, not the full graph: town judge / celebrity, sources and sinks, and the start of topological sort (nodes with in-degree 0).
    - **Representations:** adjacency list (\`Map\`/array of arrays) for sparse graphs; matrix for dense or grids.
    - **BFS** → shortest path in unweighted graphs, level-by-level spreading (rotting oranges). **DFS** → connectivity, cycle detection, flood fill.
    - **Topological sort** (DAG): Kahn's algorithm (BFS on in-degree 0) — if not all nodes are output, there is a cycle.
    - **Union-Find** with path compression + union by rank ≈ O(α(n)) per op — connected components, redundant edge, Kruskal.
    - **Dijkstra** (non-negative weights): min-heap of (dist, node), O((V + E) log V). Negative weights → Bellman-Ford.
    - Grid neighbours: \`[[1,0],[-1,0],[0,1],[0,-1]]\`; mark visited **when you enqueue**, not when you dequeue.
    - Real-world tie-in: Temporal workflows / taskbooks in OptimaAI are DAGs of activities — topological order is exactly how dependent steps get scheduled.
  `,
  questions: [
    {
      id: 'find-the-town-judge',
      title: 'Find the Town Judge',
      difficulty: 'Easy',
      lc: 'find-the-town-judge',
      from: 'Lec 21 – Graph',
      tags: ['in-degree', 'out-degree', 'directed-graph'],
      statement: 'There are `n` people labelled `1` to `n`. `trust[i] = [a, b]` means person `a` trusts person `b`. The **town judge** trusts nobody, is trusted by everybody else, and there is exactly one such person. Return the judge\'s label, or `-1` if there is none.\n\n**Think of it as a directed graph:** people are nodes and "a trusts b" is an edge a → b. The judge is the node with **in-degree n − 1** and **out-degree 0**.\n\n**Examples:** `n = 2, trust = [[1,2]]` → `2` · `n = 3, trust = [[1,3],[2,3]]` → `3` · `n = 3, trust = [[1,3],[2,3],[3,1]]` → `-1`',
      approaches: [
        {
          name: 'In-degree and out-degree arrays',
          time: 'O(n + T)',
          space: 'O(n)',
          idea: 'Count, for every person, how many people trust them (in-degree) and how many people they trust (out-degree). The judge is the one with `in = n − 1` and `out = 0`.',
          code: `
            function findJudge(n, trust) {
              const indeg = new Array(n + 1).fill(0);
              const outdeg = new Array(n + 1).fill(0);
              for (const [a, b] of trust) {
                outdeg[a]++;
                indeg[b]++;
              }
              for (let p = 1; p <= n; p++) {
                if (indeg[p] === n - 1 && outdeg[p] === 0) return p;
              }
              return -1;
            }
          `,
        },
        {
          name: 'Your accepted solution (one score array, LeetCode)',
          time: 'O(n + T)',
          space: 'O(n)',
          idea: `
            Use **one** array: \`+1\` for each person who trusts you, \`−1\` for each person you trust. Only the judge can reach
            \`n − 1\` (see *Why it works*). The picture above shows the scores for a small example.
          `,
          code: `
            var findJudge = function (n, trust) {
              if (trust.length == 0 && n == 1) return n;
              let graph = new Array(n + 1).fill(0);

              for (let i = 0; i < trust.length; i++) {
                let u = trust[i][0];
                let v = trust[i][1];
                graph[u]--;
                graph[v]++;
              }
              for (let i = 0; i <= n; i++) {
                if (graph[i] == n - 1) return i;
              }
              return -1;
            };
          `,
        },
      ],
      math: {
        figure: 'town-judge',
        body: `
Give every person a **trust score**: $\\text{score}(p) = \\text{in}(p) - \\text{out}(p)$, where $\\text{in}(p)$ is how many people trust $p$ and $\\text{out}(p)$ is how many people $p$ trusts. Your loop computes exactly this: \`graph[v]++\` for the person trusted, \`graph[u]--\` for the person trusting.

#### Why score $= n - 1$ means "judge"

LeetCode guarantees no one trusts themselves and no pair repeats, so:

$$0 \\le \\text{in}(p) \\le n - 1 \\qquad\\text{and}\\qquad \\text{out}(p) \\ge 0$$

The score can only reach $n - 1$ when **both** limits are hit at once:

$$\\text{score}(p) = n - 1 \\iff \\text{in}(p) = n - 1 \\;\\text{ and }\\; \\text{out}(p) = 0$$

That is word for word the definition: everybody else trusts $p$, and $p$ trusts nobody.

#### Why there can't be two judges

Suppose $A$ and $B$ both had score $n - 1$. Then $B$ is trusted by everyone else, including $A$, so $\\text{out}(A) \\ge 1$. That contradicts $\\text{out}(A) = 0$. So the first person you find with score $n - 1$ is the only answer.

#### The example in the picture ($n = 4$)

| person | trusted by (in) | trusts (out) | score |
|:-:|:-:|:-:|:-:|
| 1 | 0 | 2 | −2 |
| 2 | 0 | 2 | −2 |
| 3 | 3 | 0 | **3 = n − 1** |
| 4 | 1 | 1 | 0 |

#### Edge case: $n = 1$, no trust pairs

Person 1 has score $0 = n - 1$, so person 1 is the judge. Your early \`return n\` handles this, because your second loop starts at index \`0\` (which always has score 0 and would wrongly match when $n = 1$). If the loop starts at \`1\`, the special case isn't needed at all.

#### Complexity

One pass over the $T$ trust pairs and one pass over the $n$ people: $O(n + T)$ time and $O(n)$ space.
`,
      },
      explanation: `
        **The graph idea to remember from this class:** you don't always need to build an adjacency list. Many graph questions only
        need each node's **in-degree** and **out-degree**: judge / celebrity problems, finding sources and sinks, and the first step of
        topological sort (Kahn's algorithm starts from nodes with in-degree 0).

        **Small improvement to your code:** start the last loop at \`i = 1\`, since labels go from 1 to n. Then the special case
        \`if (trust.length == 0 && n == 1)\` is no longer needed.

        **Follow-up interviewers ask:** *Find the Celebrity* (LC 277). You can't see the edges, only call \`knows(a, b)\`.
        Keep one candidate: if the candidate knows \`i\`, the candidate can't be the celebrity, so \`i\` becomes the candidate.
        Then verify the final candidate in one more pass. That's O(n) calls instead of O(n²).
      `,
      fn: 'findJudge',
      tests: [
        { args: [2, [[1, 2]]], expected: 2 },
        { args: [3, [[1, 3], [2, 3]]], expected: 3 },
        { args: [3, [[1, 3], [2, 3], [3, 1]]], expected: -1, label: 'the candidate trusts someone' },
        { args: [4, [[1, 3], [1, 4], [2, 3], [2, 4], [4, 3]]], expected: 3, label: 'the example in the picture' },
        { args: [3, [[1, 2], [2, 3]]], expected: -1, label: 'nobody is trusted by everyone' },
        { args: [1, []], expected: 1, label: 'one person, no trust pairs' },
      ],
    },
    {
      id: 'number-of-islands',
      title: 'Number of Islands',
      difficulty: 'Medium',
      lc: 'number-of-islands',
      tags: ['dfs', 'grid'],
      statement: 'Count islands of `"1"` cells connected 4-directionally.',
      approaches: [
        {
          name: 'Flood fill (iterative DFS)',
          time: 'O(m·n)',
          space: 'O(m·n)',
          code: `
            function numIslands(grid) {
              const m = grid.length, n = grid[0].length;
              let count = 0;
              for (let r = 0; r < m; r++)
                for (let c = 0; c < n; c++) {
                  if (grid[r][c] !== '1') continue;
                  count++;
                  const stack = [[r, c]];
                  grid[r][c] = '0';
                  while (stack.length) {
                    const [i, j] = stack.pop();
                    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                      const x = i + di, y = j + dj;
                      if (x >= 0 && y >= 0 && x < m && y < n && grid[x][y] === '1') {
                        grid[x][y] = '0';
                        stack.push([x, y]);
                      }
                    }
                  }
                }
              return count;
            }
          `,
        },
      ],
      fn: 'numIslands',
      tests: [
        { args: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 },
        { args: [[['1', '1', '1'], ['0', '1', '0'], ['1', '1', '1']]], expected: 1 },
      ],
    },
    {
      id: 'rotting-oranges',
      title: 'Rotting Oranges (multi-source BFS)',
      difficulty: 'Medium',
      lc: 'rotting-oranges',
      tags: ['bfs', 'grid'],
      statement: 'Each minute rotten oranges (2) rot fresh neighbours (1). Minutes until none fresh, or -1.',
      approaches: [
        {
          name: 'BFS from all rotten oranges at once',
          time: 'O(m·n)',
          space: 'O(m·n)',
          code: `
            function orangesRotting(grid) {
              const m = grid.length, n = grid[0].length;
              let queue = [], fresh = 0, minutes = 0;
              for (let r = 0; r < m; r++)
                for (let c = 0; c < n; c++) {
                  if (grid[r][c] === 2) queue.push([r, c]);
                  else if (grid[r][c] === 1) fresh++;
                }
              while (queue.length && fresh) {
                const next = [];
                for (const [i, j] of queue)
                  for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                    const x = i + di, y = j + dj;
                    if (x >= 0 && y >= 0 && x < m && y < n && grid[x][y] === 1) {
                      grid[x][y] = 2;
                      fresh--;
                      next.push([x, y]);
                    }
                  }
                queue = next;
                minutes++;
              }
              return fresh ? -1 : minutes;
            }
          `,
        },
      ],
      fn: 'orangesRotting',
      tests: [
        { args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
        { args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1 },
        { args: [[[0, 2]]], expected: 0 },
      ],
    },
    {
      id: 'course-schedule',
      title: 'Course Schedule II (topological sort)',
      difficulty: 'Medium',
      lc: 'course-schedule-ii',
      tags: ['topological-sort', 'kahn'],
      statement: 'Return a valid order to take `n` courses given `[course, prereq]` pairs, or `[]` if impossible.',
      approaches: [
        {
          name: "Kahn's algorithm",
          time: 'O(V + E)',
          space: 'O(V + E)',
          code: `
            function findOrder(n, prerequisites) {
              const adj = Array.from({ length: n }, () => []), indeg = new Array(n).fill(0);
              for (const [c, p] of prerequisites) { adj[p].push(c); indeg[c]++; }
              const queue = [];
              for (let i = 0; i < n; i++) if (indeg[i] === 0) queue.push(i);
              const order = [];
              for (let h = 0; h < queue.length; h++) {
                const u = queue[h];
                order.push(u);
                for (const v of adj[u]) if (--indeg[v] === 0) queue.push(v);
              }
              return order.length === n ? order : [];
            }
          `,
        },
      ],
      fn: 'findOrder',
      check: (got, [n, pre], t) => {
        if (t.impossible) return Array.isArray(got) && got.length === 0;
        if (got.length !== n) return false;
        const pos = new Map(got.map((c, i) => [c, i]));
        return pre.every(([c, p]) => pos.get(p) < pos.get(c));
      },
      tests: [
        { args: [2, [[1, 0]]] },
        { args: [4, [[1, 0], [2, 0], [3, 1], [3, 2]]] },
        { args: [2, [[1, 0], [0, 1]]], impossible: true },
      ],
    },
    {
      id: 'clone-graph',
      title: 'Clone Graph',
      difficulty: 'Medium',
      lc: 'clone-graph',
      tags: ['bfs', 'hash-map'],
      statement: 'Deep-copy a connected undirected graph. (Test input: adjacency list, 1-indexed; output is the cloned graph’s adjacency list.)',
      approaches: [
        {
          name: 'DFS with old → new map',
          time: 'O(V + E)',
          space: 'O(V)',
          code: `
            function cloneGraph(node) {
              if (!node) return null;
              const map = new Map();
              const go = (n) => {
                if (map.has(n)) return map.get(n);
                const copy = { val: n.val, neighbors: [] };
                map.set(n, copy);
                for (const nb of n.neighbors) copy.neighbors.push(go(nb));
                return copy;
              };
              return go(node);
            }
          `,
        },
      ],
      fn: 'cloneGraph',
      input: ([adj]) => {
        const nodes = adj.map((_, i) => ({ val: i + 1, neighbors: [] }));
        adj.forEach((nbs, i) => (nodes[i].neighbors = nbs.map((v) => nodes[v - 1])));
        return [nodes[0] || null, nodes];
      },
      output: (r, _H, args) => {
        if (!r) return [];
        const seen = new Map();
        const q = [r];
        seen.set(r.val, r);
        while (q.length) for (const nb of q.shift().neighbors) if (!seen.has(nb.val)) { seen.set(nb.val, nb); q.push(nb); }
        const isCopy = [...seen.values()].every((n) => !args[1].includes(n));
        return isCopy ? [...seen.keys()].sort((a, b) => a - b).map((v) => seen.get(v).neighbors.map((n) => n.val)) : 'not a deep copy';
      },
      tests: [{ args: [[[2, 4], [1, 3], [2, 4], [1, 3]]], expected: [[2, 4], [1, 3], [2, 4], [1, 3]] }],
    },
    {
      id: 'redundant-connection',
      title: 'Redundant Connection (Union-Find)',
      difficulty: 'Medium',
      lc: 'redundant-connection',
      tags: ['union-find'],
      statement: 'A tree with one extra edge — return the edge that creates the cycle (last one in input order).',
      approaches: [
        {
          name: 'Union-Find with path compression',
          time: 'O(n α(n))',
          space: 'O(n)',
          code: `
            function findRedundantConnection(edges) {
              const parent = Array.from({ length: edges.length + 1 }, (_, i) => i);
              const rank = new Array(edges.length + 1).fill(0);
              const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
              for (const [a, b] of edges) {
                let ra = find(a), rb = find(b);
                if (ra === rb) return [a, b];
                if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
                parent[rb] = ra;
                if (rank[ra] === rank[rb]) rank[ra]++;
              }
              return [];
            }
          `,
        },
      ],
      fn: 'findRedundantConnection',
      tests: [
        { args: [[[1, 2], [1, 3], [2, 3]]], expected: [2, 3] },
        { args: [[[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]], expected: [1, 4] },
      ],
    },
    {
      id: 'network-delay',
      title: 'Network Delay Time (Dijkstra)',
      difficulty: 'Medium',
      lc: 'network-delay-time',
      tags: ['dijkstra', 'shortest-path'],
      statement: 'Signal starts at node `k`; edges `[u, v, w]`. Time for all `n` nodes to receive it, or -1.',
      approaches: [
        {
          name: 'Dijkstra with a binary heap',
          time: 'O(E log V)',
          space: 'O(V + E)',
          code: `
            function networkDelayTime(times, n, k) {
              const adj = Array.from({ length: n + 1 }, () => []);
              for (const [u, v, w] of times) adj[u].push([v, w]);
              const dist = new Array(n + 1).fill(Infinity);
              const heap = [[0, k]]; // [dist, node]
              const push = (x) => { heap.push(x); let i = heap.length - 1; while (i && heap[(i - 1) >> 1][0] > heap[i][0]) { [heap[i], heap[(i - 1) >> 1]] = [heap[(i - 1) >> 1], heap[i]]; i = (i - 1) >> 1; } };
              const pop = () => {
                const top = heap[0], last = heap.pop();
                if (heap.length) {
                  heap[0] = last;
                  for (let i = 0; ; ) {
                    let m = i; const l = 2 * i + 1, r = l + 1;
                    if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
                    if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
                    if (m === i) break;
                    [heap[i], heap[m]] = [heap[m], heap[i]]; i = m;
                  }
                }
                return top;
              };
              while (heap.length) {
                const [d, u] = pop();
                if (d >= dist[u]) continue; // stale entry
                dist[u] = d;
                for (const [v, w] of adj[u]) if (d + w < dist[v]) push([d + w, v]);
              }
              const ans = Math.max(...dist.slice(1));
              return ans === Infinity ? -1 : ans;
            }
          `,
        },
      ],
      fn: 'networkDelayTime',
      tests: [
        { args: [[[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2], expected: 2 },
        { args: [[[1, 2, 1]], 2, 1], expected: 1 },
        { args: [[[1, 2, 1]], 2, 2], expected: -1 },
      ],
    },
    {
      id: 'word-ladder',
      title: 'Word Ladder',
      difficulty: 'Hard',
      lc: 'word-ladder',
      tags: ['bfs', 'shortest-path'],
      statement: 'Shortest transformation sequence length from `begin` to `end`, changing one letter at a time, each intermediate word in `wordList`.',
      approaches: [
        {
          name: 'BFS over words',
          time: 'O(N · L · 26)',
          space: 'O(N)',
          code: `
            function ladderLength(begin, end, wordList) {
              const words = new Set(wordList);
              if (!words.has(end)) return 0;
              let level = [begin], steps = 1;
              words.delete(begin);
              while (level.length) {
                const next = [];
                for (const w of level) {
                  if (w === end) return steps;
                  for (let i = 0; i < w.length; i++)
                    for (let c = 97; c <= 122; c++) {
                      const cand = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1);
                      if (words.has(cand)) { words.delete(cand); next.push(cand); }
                    }
                }
                level = next;
                steps++;
              }
              return 0;
            }
          `,
        },
      ],
      fn: 'ladderLength',
      tests: [
        { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']], expected: 5 },
        { args: ['hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']], expected: 0 },
      ],
    },
  ],
};
