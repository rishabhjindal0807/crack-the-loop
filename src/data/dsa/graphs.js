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
      id: 'find-if-path-exists',
      title: 'Find if Path Exists in Graph',
      difficulty: 'Easy',
      lc: 'find-if-path-exists-in-graph',
      from: 'Lec 21 – Graph',
      tags: ['bfs', 'dfs', 'union-find', 'adjacency-list'],
      statement: 'A bi-directional graph has `n` vertices labelled `0` to `n − 1`. `edges[i] = [u, v]` is an edge between `u` and `v` (no duplicates, no self-loops). Return `true` if there is a path from `source` to `destination`.\n\n**Examples:** `n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2` → `true` · `n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5` → `false`',
      visual: {"type": "graph", "title": "BFS from 0, looking for 4", "nodes": {"0": [70, 150], "1": [185, 65], "2": [185, 235], "3": [300, 150], "4": [410, 150], "5": [505, 65], "6": [505, 235]}, "edges": [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"], ["3", "4"], ["5", "6"]], "labels": {"0": "source", "4": "destination"}, "listLabel": "queue", "steps": [{"seen": [], "done": [], "list": [], "front": 0, "tree": [], "code": "graph[u].push(v); graph[v].push(u)", "caption": "The graph as an adjacency list: 0→[1,2], 1→[0,3], 2→[0,3], 3→[1,2,4], 4→[3], 5→[6], 6→[5]. Each edge is stored both ways because the graph is bi-directional. Notice 5–6 is a separate piece."}, {"seen": ["0"], "done": [], "list": ["0"], "front": 0, "tree": [], "code": "queue.push(source); visited[source] = true", "caption": "Start at the source, 0. Mark it visited as soon as it goes into the queue."}, {"seen": ["0", "1", "2"], "done": [], "current": "0", "list": ["0", "1", "2"], "front": 1, "tree": [["0", "1"], ["0", "2"]], "hot": [["0", "1"], ["0", "2"]], "code": "node = queue[front++]  // 0", "caption": "Take 0 from the front of the queue. It is not the destination. Neighbours: add 1, 2 to the queue and mark them visited."}, {"seen": ["0", "1", "2", "3"], "done": ["0"], "current": "1", "list": ["0", "1", "2", "3"], "front": 2, "tree": [["0", "1"], ["0", "2"], ["1", "3"]], "hot": [["1", "0"], ["1", "3"]], "code": "node = queue[front++]  // 1", "caption": "Take 1 from the front of the queue. It is not the destination. Neighbours: add 3 to the queue and mark it visited; skip 0 (already visited)."}, {"seen": ["0", "1", "2", "3"], "done": ["0", "1"], "current": "2", "list": ["0", "1", "2", "3"], "front": 3, "tree": [["0", "1"], ["0", "2"], ["1", "3"]], "hot": [["2", "0"], ["2", "3"]], "code": "node = queue[front++]  // 2", "caption": "Take 2 from the front of the queue. It is not the destination. Neighbours: skip 0, 3 (already visited). 3 was marked visited when 1 added it, so it isn't added a second time. That is why we mark on push, not on pop."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["0", "1", "2"], "current": "3", "list": ["0", "1", "2", "3", "4"], "front": 4, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"]], "hot": [["3", "1"], ["3", "2"], ["3", "4"]], "code": "node = queue[front++]  // 3", "caption": "Take 3 from the front of the queue. It is not the destination. Neighbours: add 4 to the queue and mark it visited; skip 1, 2 (already visited)."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["0", "1", "2", "3"], "current": "4", "list": ["0", "1", "2", "3", "4"], "front": 5, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"]], "found": "4", "code": "node = queue[front++]  // 4;  node == destination → return true", "caption": "Took 4 from the queue, and it is the destination. Return true. BFS stopped early: 5 and 6 were never touched. (If the destination were 5, the queue would run empty and the answer would be false.)"}]},
      approaches: [
        {
          name: 'DFS with a stack',
          time: 'O(V + E)',
          space: 'O(V + E)',
          idea: 'Same idea as BFS, but take from the **end** of the list (a stack), so it goes deep first. For "is there a path?" the order doesn\'t matter; both work.',
          code: `
            function validPath(n, edges, source, destination) {
              const graph = Array.from({ length: n }, () => []);
              for (const [u, v] of edges) {
                graph[u].push(v);
                graph[v].push(u);
              }
              const visited = new Array(n).fill(false);
              const stack = [source];
              visited[source] = true;
              while (stack.length) {
                const node = stack.pop();
                if (node === destination) return true;
                for (const nb of graph[node]) {
                  if (!visited[nb]) {
                    visited[nb] = true;
                    stack.push(nb);
                  }
                }
              }
              return false;
            }
          `,
        },
        {
          name: 'Union-Find (no graph needed)',
          time: 'O((V + E) · α(V))',
          space: 'O(V)',
          idea: 'Put both ends of every edge in the same group. At the end, a path exists exactly when `source` and `destination` are in the same group. Best when you get many "is there a path?" questions on the same graph.',
          code: `
            function validPath(n, edges, source, destination) {
              const parent = Array.from({ length: n }, (_, i) => i);
              const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
              for (const [u, v] of edges) parent[find(u)] = find(v);
              return find(source) === find(destination);
            }
          `,
        },
        {
          name: 'Your accepted solution (BFS, LeetCode)',
          time: 'O(V + E)',
          space: 'O(V + E)',
          idea: `
            Build an adjacency list (both directions), then BFS from \`source\` with a \`visited\` array. You use an array plus a
            \`front\` index instead of \`queue.shift()\`: \`shift()\` moves every element, so it costs O(n) each time. Step through the
            visual above to watch the queue.
          `,
          code: `
            var validPath = function (n, edges, source, destination) {
              let graph = [];

              for (let i = 0; i < n; i++) {
                graph.push([]);
              }

              for (let i = 0; i < edges.length; i++) {
                let u = edges[i][0];
                let v = edges[i][1];
                graph[u].push(v);
                graph[v].push(u);
              }
              let visited = new Array(n).fill(false);
              let queue = [];
              let front = 0;

              queue.push(source);
              visited[source] = true;

              while (front < queue.length) {
                let node = queue[front++];
                if (node == destination) {
                  return true;
                }
                for (let neighbor of graph[node]) {
                  if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                  }
                }
              }

              return false;
            };
          `,
        },
      ],
      explanation: `
        **Three habits from this problem that you'll use in every graph question:**
        1. **Bi-directional means add the edge both ways:** \`graph[u].push(v)\` and \`graph[v].push(u)\`. Forgetting one is the most common bug.
        2. **Mark visited when you push, not when you pop.** Otherwise the same node can be added to the queue many times (see step 5 of the visual).
        3. **Use a \`front\` index instead of \`shift()\`.** \`shift()\` is O(n), which turns BFS into O(V²) on big graphs.

        **Which approach when?** BFS and DFS answer one question in O(V + E). Union-Find shines when edges keep arriving or there
        are many queries. BFS is also the one that gives the **shortest** path (fewest edges); DFS doesn't.

        **Small extra:** you could return \`true\` straight away when \`source === destination\`, but your loop already handles it on the first pop.
      `,
      fn: 'validPath',
      tests: [
        { args: [3, [[0, 1], [1, 2], [2, 0]], 0, 2], expected: true },
        { args: [6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5], expected: false, label: 'different pieces of the graph' },
        { args: [7, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [5, 6]], 0, 4], expected: true, label: 'the example in the visual' },
        { args: [7, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [5, 6]], 0, 6], expected: false },
        { args: [1, [], 0, 0], expected: true, label: 'source is the destination' },
        { args: [2, [], 0, 1], expected: false, label: 'no edges' },
      ],
    },
    {
      id: 'bfs-traversal',
      title: 'BFS Traversal of a Graph (all components)',
      difficulty: 'Easy',
      lc: 'https://www.geeksforgeeks.org/problems/bfs-traversal-of-graph/1',
      from: 'Lec 21 – Graph',
      tags: ['bfs', 'traversal', 'connected-components'],
      statement: 'Given a graph with `V` vertices (`0` to `V − 1`) as an adjacency list `graph`, return the **BFS order** of all vertices. Start from vertex 0, visit neighbours in the order they appear in the list, and if some vertices are not reachable, start a new BFS from the smallest unvisited vertex.\n\n**Example:** `graph = [[1,2],[0,3],[0,4],[1],[2]]` → `[0, 1, 2, 3, 4]`',
      visual: {"type": "graph", "title": "BFS over every piece of the graph", "nodes": {"0": [70, 150], "1": [185, 65], "2": [185, 235], "3": [300, 150], "4": [410, 150], "5": [505, 65], "6": [505, 235]}, "edges": [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"], ["3", "4"], ["5", "6"]], "labels": {}, "listLabel": "queue", "steps": [{"seen": [], "done": [], "list": [], "front": 0, "tree": [], "code": "bfsTraversal(graph, 7)", "caption": "The graph as an adjacency list: 0→[1,2], 1→[0,3], 2→[0,3], 3→[1,2,4], 4→[3], 5→[6], 6→[5]. It has two separate pieces, 0–4 and 5–6, so one BFS from 0 would miss 5 and 6.", "result": []}, {"seen": ["0"], "done": [], "list": ["0"], "front": 0, "tree": [], "code": "bfs(graph, 0, visited, result)", "caption": "i = 0 is not visited, so start a BFS from it. Mark 0 visited and put it in a new queue.", "result": []}, {"seen": ["0", "1", "2"], "done": [], "current": "0", "list": ["0", "1", "2"], "front": 1, "tree": [["0", "1"], ["0", "2"]], "hot": [["0", "1"], ["0", "2"]], "code": "node = queue[front++]  // 0;  result.push(node)", "caption": "Take 0 from the front of the queue and add it to the result. Neighbours: add 1, 2 to the queue and mark them visited.", "result": ["0"]}, {"seen": ["0", "1", "2", "3"], "done": ["0"], "current": "1", "list": ["0", "1", "2", "3"], "front": 2, "tree": [["0", "1"], ["0", "2"], ["1", "3"]], "hot": [["1", "0"], ["1", "3"]], "code": "node = queue[front++]  // 1;  result.push(node)", "caption": "Take 1 from the front of the queue and add it to the result. Neighbours: add 3 to the queue and mark it visited; skip 0 (already visited).", "result": ["0", "1"]}, {"seen": ["0", "1", "2", "3"], "done": ["0", "1"], "current": "2", "list": ["0", "1", "2", "3"], "front": 3, "tree": [["0", "1"], ["0", "2"], ["1", "3"]], "hot": [["2", "0"], ["2", "3"]], "code": "node = queue[front++]  // 2;  result.push(node)", "caption": "Take 2 from the front of the queue and add it to the result. Neighbours: skip 0, 3 (already visited). 3 was marked visited when 1 added it, so it isn't added a second time. That is why we mark on push, not on pop.", "result": ["0", "1", "2"]}, {"seen": ["0", "1", "2", "3", "4"], "done": ["0", "1", "2"], "current": "3", "list": ["0", "1", "2", "3", "4"], "front": 4, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"]], "hot": [["3", "1"], ["3", "2"], ["3", "4"]], "code": "node = queue[front++]  // 3;  result.push(node)", "caption": "Take 3 from the front of the queue and add it to the result. Neighbours: add 4 to the queue and mark it visited; skip 1, 2 (already visited).", "result": ["0", "1", "2", "3"]}, {"seen": ["0", "1", "2", "3", "4"], "done": ["0", "1", "2", "3"], "current": "4", "list": ["0", "1", "2", "3", "4"], "front": 5, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"]], "hot": [["4", "3"]], "code": "node = queue[front++]  // 4;  result.push(node)", "caption": "Take 4 from the front of the queue and add it to the result. Neighbours: skip 3 (already visited).", "result": ["0", "1", "2", "3", "4"]}, {"seen": ["0", "1", "2", "3", "4", "5"], "done": ["0", "1", "2", "3", "4"], "list": ["5"], "front": 0, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"]], "code": "bfs(graph, 5, visited, result)", "caption": "Back in bfsTraversal, the loop goes i = 1, 2, 3, 4 (all visited, skipped), then i = 5: not visited. A new piece of the graph, so call bfs again from 5, with a new queue. The visited array is shared, so nothing is visited twice.", "result": ["0", "1", "2", "3", "4"]}, {"seen": ["0", "1", "2", "3", "4", "5", "6"], "done": ["0", "1", "2", "3", "4"], "current": "5", "list": ["5", "6"], "front": 1, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"], ["5", "6"]], "hot": [["5", "6"]], "code": "node = queue[front++]  // 5;  result.push(node)", "caption": "Take 5 from the front of the queue and add it to the result. Neighbours: add 6 to the queue and mark it visited.", "result": ["0", "1", "2", "3", "4", "5"]}, {"seen": ["0", "1", "2", "3", "4", "5", "6"], "done": ["0", "1", "2", "3", "4", "5"], "current": "6", "list": ["5", "6"], "front": 2, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"], ["5", "6"]], "hot": [["6", "5"]], "code": "node = queue[front++]  // 6;  result.push(node)", "caption": "Take 6 from the front of the queue and add it to the result. Neighbours: skip 5 (already visited).", "result": ["0", "1", "2", "3", "4", "5", "6"]}, {"seen": ["0", "1", "2", "3", "4", "5", "6"], "done": ["0", "1", "2", "3", "4", "5", "6"], "list": ["5", "6"], "front": 2, "tree": [["0", "1"], ["0", "2"], ["1", "3"], ["3", "4"], ["5", "6"]], "code": "return result  // [0, 1, 2, 3, 4, 5, 6]", "caption": "Every node visited exactly once, piece by piece. Total work is O(V + E): each node enters a queue once, and each edge is checked from both ends.", "result": ["0", "1", "2", "3", "4", "5", "6"]}]},
      approaches: [
        {
          name: 'Simple version with queue.shift()',
          time: 'O(V² + E) worst case',
          space: 'O(V)',
          idea: 'The same BFS, but taking from the queue with `shift()`. Easy to read, but `shift()` moves every remaining element, so each removal costs O(V).',
          code: `
            function bfsTraversal(graph, V) {
              const visited = new Array(V).fill(false);
              const result = [];
              for (let i = 0; i < V; i++) {
                if (visited[i]) continue;
                const queue = [i];
                visited[i] = true;
                while (queue.length) {
                  const node = queue.shift();
                  result.push(node);
                  for (const nb of graph[node]) {
                    if (!visited[nb]) {
                      visited[nb] = true;
                      queue.push(nb);
                    }
                  }
                }
              }
              return result;
            }
          `,
        },
        {
          name: 'Your solution (front pointer, every component)',
          time: 'O(V + E)',
          space: 'O(V)',
          idea: `
            \`bfs()\` visits one connected piece of the graph using a queue and a \`front\` index (O(1) per removal).
            \`bfsTraversal()\` loops over every vertex and starts a new \`bfs()\` from any vertex that is still unvisited, so
            disconnected pieces are not missed. The \`visited\` array is shared between calls.
          `,
          code: `
            function bfs(graph, start, visited, result) {
              let queue = [start];
              let front = 0;

              visited[start] = true;

              while (front < queue.length) {
                let node = queue[front++];

                result.push(node);

                for (let neighbor of graph[node]) {
                  if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                  }
                }
              }
            }

            function bfsTraversal(graph, V) {
              let visited = new Array(V).fill(false);
              let result = [];

              for (let i = 0; i < V; i++) {
                if (!visited[i]) {
                  bfs(graph, i, visited, result);
                }
              }

              return result;
            }
          `,
        },
      ],
      explanation: `
        **This is the template for most graph problems.** Change what you do when you pop a node, and you get:
        - **Count connected components:** count how many times \`bfsTraversal\` calls \`bfs\` (LC 547 Number of Provinces).
        - **Number of Islands:** the same loop over every cell of a grid.
        - **Shortest path in an unweighted graph:** BFS visits nodes level by level, so the first time you reach a node is the shortest way there.

        **Why O(V + E):** every vertex goes into a queue once, and each edge is looked at once from each end. The outer loop adds
        O(V) checks, but never repeats work, because \`visited\` is shared.

        **Why visit neighbours in list order matters:** the BFS order depends on how the adjacency list is ordered. Two correct
        programs can print different orders if they build the list differently, so interviewers usually accept any valid BFS order.
      `,
      fn: 'bfsTraversal',
      tests: [
        { args: [[[1, 2], [0, 3], [0, 4], [1], [2]], 5], expected: [0, 1, 2, 3, 4] },
        { args: [[[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], [6], [5]], 7], expected: [0, 1, 2, 3, 4, 5, 6], label: 'the example in the visual (two pieces)' },
        { args: [[[2, 1], [2], [0, 1, 3], [2]], 4], expected: [0, 2, 1, 3], label: 'neighbour order decides the BFS order' },
        { args: [[[1], [0], [3], [2], []], 5], expected: [0, 1, 2, 3, 4], label: 'three pieces, one node alone' },
        { args: [[[]], 1], expected: [0] },
      ],
    },
    {
      id: 'dfs-traversal',
      title: 'DFS Traversal of a Graph (all components)',
      difficulty: 'Easy',
      lc: 'https://www.geeksforgeeks.org/problems/depth-first-traversal-for-a-graph/1',
      from: 'Lec 21 – Graph',
      tags: ['dfs', 'recursion', 'traversal', 'connected-components'],
      statement: 'Given a graph with `V` vertices (`0` to `V − 1`) as an adjacency list `graph`, return the **DFS order** of all vertices. Start from vertex 0, follow neighbours in the order they appear in the list, go as deep as possible before backtracking, and if some vertices are not reachable, start again from the smallest unvisited vertex.\n\n**Example:** `graph = [[1,2],[0,3],[0,4],[1],[2]]` → `[0, 1, 3, 2, 4]` (BFS on the same graph gives `[0, 1, 2, 3, 4]`)',
      visual: {"type": "graph", "title": "Recursive DFS over every piece of the graph", "nodes": {"0": [70, 150], "1": [185, 65], "2": [185, 235], "3": [300, 150], "4": [410, 150], "5": [505, 65], "6": [505, 235]}, "edges": [["0", "1"], ["0", "2"], ["1", "3"], ["2", "3"], ["3", "4"], ["5", "6"]], "listLabel": "call stack", "waitingLabel": "visited, still on the call stack", "steps": [{"seen": [], "done": [], "list": [], "tree": [], "result": [], "code": "dfsTraversal(graph, 7)", "caption": "Same graph as the BFS problem: 0→[1,2], 1→[0,3], 2→[0,3], 3→[1,2,4], 4→[3], 5→[6], 6→[5]. DFS goes as deep as it can along one path before coming back."}, {"seen": ["0"], "done": [], "list": ["0"], "tree": [], "result": ["0"], "current": "0", "code": "dfs(graph, 0, visited, result)  // visited[0] = true; result.push(0)", "caption": "i = 0 is not visited: call dfs(0). Mark 0 visited and add it to the result. The call stack now holds dfs(0)."}, {"seen": ["0", "1"], "done": [], "list": ["0", "1"], "tree": [["0", "1"]], "result": ["0", "1"], "current": "1", "hot": [["0", "1"]], "code": "dfs(graph, 1, visited, result)  // visited[1] = true; result.push(1)", "caption": "In dfs(0): 1 is not visited, so go deeper: call dfs(1). Mark 1 visited and add it to the result. dfs(0) waits on the call stack until dfs(1) returns."}, {"seen": ["0", "1", "3"], "done": [], "list": ["0", "1", "3"], "tree": [["0", "1"], ["1", "3"]], "result": ["0", "1", "3"], "current": "3", "hot": [["1", "3"]], "code": "dfs(graph, 3, visited, result)  // visited[3] = true; result.push(3)", "caption": "In dfs(1): skip 0 (visited), then 3 is not visited, so go deeper: call dfs(3). Mark 3 visited and add it to the result. dfs(1) waits on the call stack until dfs(3) returns."}, {"seen": ["0", "1", "3", "2"], "done": [], "list": ["0", "1", "3", "2"], "tree": [["0", "1"], ["1", "3"], ["3", "2"]], "result": ["0", "1", "3", "2"], "current": "2", "hot": [["3", "2"]], "code": "dfs(graph, 2, visited, result)  // visited[2] = true; result.push(2)", "caption": "In dfs(3): skip 1 (visited), then 2 is not visited, so go deeper: call dfs(2). Mark 2 visited and add it to the result. dfs(3) waits on the call stack until dfs(2) returns."}, {"seen": ["0", "1", "3", "2"], "done": ["2"], "list": ["0", "1", "3"], "tree": [["0", "1"], ["1", "3"], ["3", "2"]], "result": ["0", "1", "3", "2"], "current": "3", "code": "return from dfs(2)", "caption": "dfs(2) has looked at all its neighbours (0, 3); every one is visited now. It returns to dfs(3). The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4"], "done": ["2"], "list": ["0", "1", "3", "4"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4"], "current": "4", "hot": [["3", "4"]], "code": "dfs(graph, 4, visited, result)  // visited[4] = true; result.push(4)", "caption": "In dfs(3): 4 is not visited, so go deeper: call dfs(4). Mark 4 visited and add it to the result. dfs(3) waits on the call stack until dfs(4) returns."}, {"seen": ["0", "1", "3", "2", "4"], "done": ["2", "4"], "list": ["0", "1", "3"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4"], "current": "3", "code": "return from dfs(4)", "caption": "dfs(4) has looked at all its neighbours (3); every one is visited now. It returns to dfs(3). The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4"], "done": ["2", "4", "3"], "list": ["0", "1"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4"], "current": "1", "code": "return from dfs(3)", "caption": "dfs(3) has looked at all its neighbours (1, 2, 4); every one is visited now. It returns to dfs(1). The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4"], "done": ["2", "4", "3", "1"], "list": ["0"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4"], "current": "0", "code": "return from dfs(1)", "caption": "dfs(1) has looked at all its neighbours (0, 3); every one is visited now. It returns to dfs(0). The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4"], "done": ["2", "4", "3", "1", "0"], "list": [], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4"], "code": "return from dfs(0)", "caption": "Back in dfs(0), its next neighbour is 2, but DFS already reached 2 deep down through 1 → 3, so it is skipped. dfs(0) returns to dfsTraversal and the call stack is empty."}, {"seen": ["0", "1", "3", "2", "4", "5"], "done": ["2", "4", "3", "1", "0"], "list": ["5"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"]], "result": ["0", "1", "3", "2", "4", "5"], "current": "5", "code": "dfs(graph, 5, visited, result)  // visited[5] = true; result.push(5)", "caption": "Back in dfsTraversal: i = 1, 2, 3, 4 are visited, so skip them. i = 5 is not: call dfs(5). A new piece of the graph."}, {"seen": ["0", "1", "3", "2", "4", "5", "6"], "done": ["2", "4", "3", "1", "0"], "list": ["5", "6"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"], ["5", "6"]], "result": ["0", "1", "3", "2", "4", "5", "6"], "current": "6", "hot": [["5", "6"]], "code": "dfs(graph, 6, visited, result)  // visited[6] = true; result.push(6)", "caption": "In dfs(5): 6 is not visited, so go deeper: call dfs(6). Mark 6 visited and add it to the result. dfs(5) waits on the call stack until dfs(6) returns."}, {"seen": ["0", "1", "3", "2", "4", "5", "6"], "done": ["2", "4", "3", "1", "0", "6"], "list": ["5"], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"], ["5", "6"]], "result": ["0", "1", "3", "2", "4", "5", "6"], "current": "5", "code": "return from dfs(6)", "caption": "dfs(6) has looked at all its neighbours (5); every one is visited now. It returns to dfs(5). The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4", "5", "6"], "done": ["2", "4", "3", "1", "0", "6", "5"], "list": [], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"], ["5", "6"]], "result": ["0", "1", "3", "2", "4", "5", "6"], "code": "return from dfs(5)", "caption": "dfs(5) has looked at all its neighbours (6); every one is visited now. It returns to dfsTraversal. The call stack shrinks."}, {"seen": ["0", "1", "3", "2", "4", "5", "6"], "done": ["2", "4", "3", "1", "0", "6", "5"], "list": [], "tree": [["0", "1"], ["1", "3"], ["3", "2"], ["3", "4"], ["5", "6"]], "result": ["0", "1", "3", "2", "4", "5", "6"], "code": "return result  // [0, 1, 3, 2, 4, 5, 6]", "caption": "Done: [0, 1, 3, 2, 4, 5, 6]. Compare with BFS on the same graph: [0, 1, 2, 3, 4, 5, 6]. DFS went 0 → 1 → 3 → 2 (deep first) before coming back; BFS visited 1 and 2 (one step from 0) before 3."}]},
      approaches: [
        {
          name: 'Iterative DFS with your own stack',
          time: 'O(V + E)',
          space: 'O(V)',
          idea: 'The same order without recursion: keep your own stack. Mark a node when you **pop** it (skip it if already visited), and push its unvisited neighbours in **reverse** order, so the first neighbour is on top and is explored first, just like the recursive version. Use this when the graph can be very deep: recursion in JavaScript fails at around 10,000 levels ("Maximum call stack size exceeded").',
          code: `
            function dfsTraversal(graph, V) {
              const visited = new Array(V).fill(false);
              const result = [];
              for (let i = 0; i < V; i++) {
                if (visited[i]) continue;
                const stack = [i];
                while (stack.length) {
                  const node = stack.pop();
                  if (visited[node]) continue;
                  visited[node] = true;
                  result.push(node);
                  for (let k = graph[node].length - 1; k >= 0; k--) {
                    const nb = graph[node][k];
                    if (!visited[nb]) stack.push(nb);
                  }
                }
              }
              return result;
            }
          `,
        },
        {
          name: 'Your solution (recursive DFS, every component)',
          time: 'O(V + E)',
          space: 'O(V) for visited + recursion depth',
          idea: `
            \`dfs()\` marks the node, adds it to the result, and calls itself on each unvisited neighbour. The **call stack**
            remembers where to come back to, so you don't need your own stack. \`dfsTraversal()\` starts a new \`dfs()\` from every
            vertex that is still unvisited, so separate pieces of the graph are covered. Step through the visual above.
          `,
          code: `
            function dfs(graph, node, visited, result) {
              visited[node] = true;

              result.push(node);

              for (let neighbor of graph[node]) {
                if (!visited[neighbor]) {
                  dfs(graph, neighbor, visited, result);
                }
              }
            }

            function dfsTraversal(graph, V) {
              let visited = new Array(V).fill(false);
              let result = [];

              for (let i = 0; i < V; i++) {
                if (!visited[i]) {
                  dfs(graph, i, visited, result);
                }
              }

              return result;
            }
          `,
        },
      ],
      explanation: `
        **BFS vs DFS, side by side:**

        | | BFS | DFS |
        |---|---|---|
        | Data structure | queue (first in, first out) | stack: the call stack, or your own |
        | Order | level by level, nearest first | one path as deep as possible, then back up |
        | Order on the example graph | 0, 1, 2, 3, 4, 5, 6 | 0, 1, 3, 2, 4, 5, 6 |
        | Shortest path (unweighted) | **yes**: the first visit is the shortest | no |
        | Typical uses | shortest path, spreading by levels (rotting oranges) | cycle detection, topological sort, connected pieces, backtracking |
        | Time / space | O(V + E) / O(V) | O(V + E) / O(V) |

        **Note on your snippet:** \`console.log(dfsTraversal(graph, 6))\` needs a \`graph\` variable defined first, for example
        \`const graph = [[1, 2], [0, 3], [0, 4], [1], [2], []];\`. The tests here call \`dfsTraversal\` directly, so that line isn't included.

        **Why mark visited at the start of \`dfs()\`:** a node can be reached from two parents (3 from both 1 and 2 in the visual).
        Marking it first means the second parent sees it as visited and doesn't explore it again. That is what keeps the whole traversal O(V + E).
      `,
      fn: 'dfsTraversal',
      tests: [
        { args: [[[1, 2], [0, 3], [0, 4], [1], [2]], 5], expected: [0, 1, 3, 2, 4] },
        { args: [[[1, 2], [0, 3], [0, 3], [1, 2, 4], [3], [6], [5]], 7], expected: [0, 1, 3, 2, 4, 5, 6], label: 'the example in the visual (two pieces)' },
        { args: [[[2, 1], [2], [0, 1, 3], [2]], 4], expected: [0, 2, 1, 3], label: 'neighbour order decides the DFS order' },
        { args: [[[1, 2], [0, 3], [0, 4], [1], [2], []], 6], expected: [0, 1, 3, 2, 4, 5], label: 'your console.log example, with node 5 alone' },
        { args: [[[1], [0], [3], [2], []], 5], expected: [0, 1, 2, 3, 4], label: 'three pieces, one node alone' },
        { args: [[[]], 1], expected: [0] },
      ],
    },
    {
      id: 'number-of-provinces',
      title: 'Number of Provinces',
      difficulty: 'Medium',
      lc: 'number-of-provinces',
      from: 'Lec 21 – Graph',
      tags: ['dfs', 'bfs', 'union-find', 'adjacency-matrix', 'connected-components'],
      statement: 'There are `n` cities. `isConnected[i][j] = 1` if city `i` and city `j` are directly connected, else `0`. Cities connected directly or through other cities form a **province**. Return the number of provinces.\n\nIn graph words: count the **connected components** of a graph given as an **adjacency matrix**.\n\n**Examples:** `[[1,1,0],[1,1,0],[0,0,1]]` → `2` · `[[1,0,0],[0,1,0],[0,0,1]]` → `3`',
      visual: {"type": "graph", "title": "DFS over the matrix, one province at a time", "nodes": {"0": [70, 105], "1": [185, 55], "2": [185, 215], "3": [330, 85], "4": [330, 225], "5": [480, 150]}, "edges": [["0", "1"], ["1", "2"], ["3", "4"]], "matrix": [[1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 1]], "listLabel": "call stack", "waitingLabel": "visited, still on the call stack", "steps": [{"seen": [], "done": [], "list": [], "tree": [], "stat": {"label": "provinces found", "value": 0}, "code": "findCircleNum(isConnected)", "caption": "6 cities. isConnected[i][j] = 1 means cities i and j are directly connected (the matrix is symmetric, and the diagonal is always 1). Each group of connected cities is one province."}, {"seen": [], "done": [], "list": [], "tree": [], "stat": {"label": "provinces found", "value": 1}, "code": "i = 0: !visited[0] → count++  // count = 1", "caption": "City 0 is not visited, so it starts a new province: count becomes 1. Now visit every city reachable from 0."}, {"seen": ["0"], "done": [], "list": ["0"], "tree": [], "stat": {"label": "provinces found", "value": 1}, "current": "0", "row": 0, "hot": [["0", "1"]], "code": "DFS(n, isConnected, 0, visited)  // visited[0] = true; scan row 0", "caption": "Mark 0 visited and scan row 0: it has 1s in columns 0, 1. Not visited yet: 1, so visit it next."}, {"seen": ["0", "1"], "done": [], "list": ["0", "1"], "tree": [["0", "1"]], "stat": {"label": "provinces found", "value": 1}, "current": "1", "row": 1, "hot": [["1", "0"], ["1", "2"]], "code": "DFS(n, isConnected, 1, visited)  // visited[1] = true; scan row 1", "caption": "Inside the DFS from 0: city 1 is connected and not visited, so DFS(1). Mark 1 visited and scan row 1: it has 1s in columns 0, 1, 2. Not visited yet: 2, so visit it next."}, {"seen": ["0", "1", "2"], "done": [], "list": ["0", "1", "2"], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 1}, "current": "2", "row": 2, "hot": [["2", "1"]], "code": "DFS(n, isConnected, 2, visited)  // visited[2] = true; scan row 2", "caption": "Inside the DFS from 1: city 2 is connected and not visited, so DFS(2). Mark 2 visited and scan row 2: it has 1s in columns 1 and 2. Both are visited already (column 2 is the city itself)."}, {"seen": ["0", "1", "2"], "done": ["2"], "list": ["0", "1"], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 1}, "current": "1", "row": 1, "code": "return  // DFS(2) finished", "caption": "Every city connected to 2 is visited, so DFS(2) returns to DFS(1)."}, {"seen": ["0", "1", "2"], "done": ["2", "1"], "list": ["0"], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 1}, "current": "0", "row": 0, "code": "return  // DFS(1) finished", "caption": "Every city connected to 1 is visited, so DFS(1) returns to DFS(0)."}, {"seen": ["0", "1", "2"], "done": ["2", "1", "0"], "list": [], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 1}, "code": "return  // DFS(0) finished", "caption": "Every city connected to 0 is visited, so DFS(0) returns. This whole province is done."}, {"seen": ["0", "1", "2"], "done": ["2", "1", "0"], "list": [], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 2}, "code": "i = 3: !visited[3] → count++  // count = 2", "caption": "Back in the main loop: cities before 3 are visited. City 3 is not, so it can't be reachable from any province found so far. New province: count becomes 2."}, {"seen": ["0", "1", "2", "3"], "done": ["2", "1", "0"], "list": ["3"], "tree": [["0", "1"], ["1", "2"]], "stat": {"label": "provinces found", "value": 2}, "current": "3", "row": 3, "hot": [["3", "4"]], "code": "DFS(n, isConnected, 3, visited)  // visited[3] = true; scan row 3", "caption": "Mark 3 visited and scan row 3: it has 1s in columns 3, 4. Not visited yet: 4, so visit it next."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["2", "1", "0"], "list": ["3", "4"], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 2}, "current": "4", "row": 4, "hot": [["4", "3"]], "code": "DFS(n, isConnected, 4, visited)  // visited[4] = true; scan row 4", "caption": "Inside the DFS from 3: city 4 is connected and not visited, so DFS(4). Mark 4 visited and scan row 4: it has 1s in columns 3 and 4. Both are visited already (column 4 is the city itself)."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["2", "1", "0", "4"], "list": ["3"], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 2}, "current": "3", "row": 3, "code": "return  // DFS(4) finished", "caption": "Every city connected to 4 is visited, so DFS(4) returns to DFS(3)."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["2", "1", "0", "4", "3"], "list": [], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 2}, "code": "return  // DFS(3) finished", "caption": "Every city connected to 3 is visited, so DFS(3) returns. This whole province is done."}, {"seen": ["0", "1", "2", "3", "4"], "done": ["2", "1", "0", "4", "3"], "list": [], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 3}, "code": "i = 5: !visited[5] → count++  // count = 3", "caption": "Back in the main loop: cities before 5 are visited. City 5 is not, so it can't be reachable from any province found so far. New province: count becomes 3."}, {"seen": ["0", "1", "2", "3", "4", "5"], "done": ["2", "1", "0", "4", "3"], "list": ["5"], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 3}, "current": "5", "row": 5, "code": "DFS(n, isConnected, 5, visited)  // visited[5] = true; scan row 5", "caption": "Mark 5 visited and scan row 5: its only 1 is in column 5, the city itself. Nothing else to visit."}, {"seen": ["0", "1", "2", "3", "4", "5"], "done": ["2", "1", "0", "4", "3", "5"], "list": [], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 3}, "code": "return  // DFS(5) finished", "caption": "Every city connected to 5 is visited, so DFS(5) returns. This whole province is done."}, {"seen": ["0", "1", "2", "3", "4", "5"], "done": ["2", "1", "0", "4", "3", "5"], "list": [], "tree": [["0", "1"], ["1", "2"], ["3", "4"]], "stat": {"label": "provinces found", "value": 3}, "code": "return count  // 3", "caption": "Every city is visited. The DFS started 3 times, so there are 3 provinces: {0, 1, 2}, {3, 4} and {5}. City 5 is connected only to itself; that is still a province."}]},
      approaches: [
        {
          name: 'BFS for each province',
          time: 'O(n²)',
          space: 'O(n)',
          idea: 'Same counting idea with a queue instead of recursion: every time you find an unvisited city, count a new province and BFS through its row-by-row neighbours.',
          code: `
            function findCircleNum(isConnected) {
              const n = isConnected.length;
              const visited = new Array(n).fill(false);
              let count = 0;
              for (let i = 0; i < n; i++) {
                if (visited[i]) continue;
                count++;
                const queue = [i];
                visited[i] = true;
                for (let front = 0; front < queue.length; front++) {
                  const city = queue[front];
                  for (let j = 0; j < n; j++) {
                    if (isConnected[city][j] === 1 && !visited[j]) {
                      visited[j] = true;
                      queue.push(j);
                    }
                  }
                }
              }
              return count;
            }
          `,
        },
        {
          name: 'Union-Find',
          time: 'O(n² · α(n))',
          space: 'O(n)',
          idea: 'Start with `n` separate provinces. For every connection `i–j` (only `j > i` is needed, because the matrix is symmetric), merge their groups. Each merge of two **different** groups removes one province.',
          code: `
            function findCircleNum(isConnected) {
              const n = isConnected.length;
              const parent = Array.from({ length: n }, (_, i) => i);
              const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
              let provinces = n;
              for (let i = 0; i < n; i++) {
                for (let j = i + 1; j < n; j++) {
                  if (isConnected[i][j] !== 1) continue;
                  const a = find(i), b = find(j);
                  if (a !== b) {
                    parent[a] = b;
                    provinces--;
                  }
                }
              }
              return provinces;
            }
          `,
        },
        {
          name: 'Your accepted solution (DFS, LeetCode)',
          time: 'O(n²)',
          space: 'O(n)',
          idea: `
            Loop over every city; each unvisited city starts a **new province** (\`count++\`), and \`DFS\` marks every city reachable
            from it. A city's neighbours are the 1s in its **row** of the matrix. Step through the visual above to watch the rows being scanned.
          `,
          code: `
            var findCircleNum = function (isConnected) {
              let n = isConnected.length;
              let visited = new Array(n).fill(false);
              let count = 0;

              function DFS(n, isConnected, source, visited) {
                visited[source] = true;
                for (let i = 0; i < n; i++) {
                  if (isConnected[source][i] == 1) {
                    if (!visited[i]) {
                      DFS(n, isConnected, i, visited);
                    }
                  }
                }
              }

              for (let i = 0; i < n; i++) {
                if (!visited[i]) {
                  count++;
                  DFS(n, isConnected, i, visited);
                }
              }
              return count;
            };
          `,
        },
      ],
      explanation: `
        **This is your DFS traversal with one extra line.** \`dfsTraversal\` already starts a new DFS for each separate piece of
        the graph. Count how many times it starts (\`count++\`), and you have the number of connected components.

        **Matrix vs adjacency list:** here the neighbours of city \`i\` are the 1s in row \`i\`, so finding them always scans all
        \`n\` columns. That is why the time is **O(n²)** even when there are few connections. With an adjacency list it would be
        O(V + E). The matrix is symmetric (\`[i][j] === [j][i]\`) and the diagonal is always 1 (a city is connected to itself),
        which your \`visited\` check skips naturally.

        **Small cleanup:** \`DFS\` is defined inside \`findCircleNum\`, so it can use \`n\`, \`isConnected\` and \`visited\` directly.
        It only needs one parameter: \`function DFS(source)\`.

        **Same pattern, other problems:** Number of Islands (a grid instead of a matrix of cities), Number of Connected Components
        (LC 323, an edge list), and Redundant Connection (Union-Find), all on this topic page.
      `,
      fn: 'findCircleNum',
      tests: [
        { args: [[[1, 1, 0], [1, 1, 0], [0, 0, 1]]], expected: 2 },
        { args: [[[1, 0, 0], [0, 1, 0], [0, 0, 1]]], expected: 3, label: 'no connections' },
        { args: [[[1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0], [0, 0, 0, 1, 1, 0], [0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 1]]], expected: 3, label: 'the example in the visual' },
        { args: [[[1, 1, 0, 0], [1, 1, 1, 0], [0, 1, 1, 1], [0, 0, 1, 1]]], expected: 1, label: 'a chain: connected through other cities' },
        { args: [[[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]], expected: 1 },
        { args: [[[1]]], expected: 1, label: 'one city' },
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
