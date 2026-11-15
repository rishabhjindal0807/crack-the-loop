export default {
  id: 'graphs',
  title: 'Graphs',
  icon: '🕸️',
  source: 'curriculum',
  blurb: 'BFS/DFS on grids and adjacency lists, topological sort, union-find, Dijkstra.',
  concepts: `
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
