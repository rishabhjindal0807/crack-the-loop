const tree = (a, H) => [H.tree(a[0]), ...a.slice(1)];

export default {
  id: 'trees',
  title: 'Binary Trees & BST',
  icon: '🌳',
  source: 'curriculum',
  blurb: 'Traversals, BFS by level, height/diameter, LCA, BST validation, serialisation.',
  concepts: `
    \`\`\`js
    class TreeNode { constructor(val = 0, left = null, right = null) { ... } }
    \`\`\`
    - **DFS orders:** pre (node, L, R), in (L, node, R — sorted for a BST), post (L, R, node — compute from children).
    - **BFS** with a queue gives level order; snapshot \`queue.length\` to process one level at a time.
    - Most tree problems are **post-order**: “ask each child for an answer, combine at the node”. Return what the parent needs, update a global for what the problem asks (diameter, max path sum).
    - **BST:** left < node < right for *every* ancestor — validate with \`(low, high)\` bounds, not just the parent.
    - Height-balanced recursion depth is O(log n); a skewed tree is O(n) — mention stack depth.
    - *Tests use LeetCode level-order arrays like \`[3,9,20,null,null,15,7]\`; \`TreeNode\` is pre-defined.*
  `,
  questions: [
    {
      id: 'inorder-traversal',
      title: 'Binary Tree Inorder Traversal (iterative)',
      difficulty: 'Easy',
      lc: 'binary-tree-inorder-traversal',
      tags: ['dfs', 'stack'],
      statement: 'Return the inorder traversal of a binary tree.',
      approaches: [
        {
          name: 'Recursive',
          time: 'O(n)',
          space: 'O(h)',
          code: `
            function inorderTraversal(root) {
              const out = [];
              const go = (n) => { if (!n) return; go(n.left); out.push(n.val); go(n.right); };
              go(root);
              return out;
            }
          `,
        },
        {
          name: 'Iterative with stack',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'Go left as far as possible pushing nodes; pop, visit, then switch to the right subtree.',
          code: `
            function inorderTraversal(root) {
              const out = [], st = [];
              let cur = root;
              while (cur || st.length) {
                while (cur) { st.push(cur); cur = cur.left; }
                cur = st.pop();
                out.push(cur.val);
                cur = cur.right;
              }
              return out;
            }
          `,
        },
      ],
      fn: 'inorderTraversal',
      input: tree,
      tests: [
        { args: [[1, null, 2, 3]], expected: [1, 3, 2] },
        { args: [[]], expected: [] },
        { args: [[4, 2, 6, 1, 3, 5, 7]], expected: [1, 2, 3, 4, 5, 6, 7] },
      ],
    },
    {
      id: 'level-order',
      title: 'Binary Tree Level Order Traversal',
      difficulty: 'Medium',
      lc: 'binary-tree-level-order-traversal',
      tags: ['bfs'],
      statement: 'Return node values level by level.',
      approaches: [
        {
          name: 'BFS, one level per iteration',
          time: 'O(n)',
          space: 'O(w) — max width',
          code: `
            function levelOrder(root) {
              if (!root) return [];
              const out = [];
              let level = [root];
              while (level.length) {
                out.push(level.map((n) => n.val));
                const next = [];
                for (const n of level) {
                  if (n.left) next.push(n.left);
                  if (n.right) next.push(n.right);
                }
                level = next;
              }
              return out;
            }
          `,
        },
      ],
      explanation: 'Variants with the same skeleton: zigzag order, right side view (last of each level), average of levels, max width.',
      fn: 'levelOrder',
      input: tree,
      tests: [
        { args: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
        { args: [[]], expected: [] },
      ],
    },
    {
      id: 'right-side-view',
      title: 'Binary Tree Right Side View',
      difficulty: 'Medium',
      lc: 'binary-tree-right-side-view',
      from: 'IL10 – Trees 1 & BST',
      tags: ['dfs', 'bfs', 'level-order', 'views'],
      statement: 'Imagine standing on the **right side** of a binary tree. Return the values of the nodes you can see, **top to bottom**: the **last** node of every level.\n\n**Example:** `[1,2,3,null,5,null,4]` → `[1, 3, 4]`',
      visual: { type: 'tree-views', view: 'right', title: 'Same tree, four views: switch between them' },
      approaches: [
        {
          name: 'BFS, level by level',
          time: 'O(n)',
          space: 'O(w), w = widest level',
          idea: `Go level by level with a queue. The **last** node of each level is the one you see from the right.`,
          code: `
            function rightSideView(root) {
              if (!root) return [];
              const result = [];
              const queue = [root];
              let front = 0;
              while (front < queue.length) {
                const size = queue.length - front; // nodes in this level
                for (let i = 0; i < size; i++) {
                  const node = queue[front++];
                  if (i === size - 1) result.push(node.val); // last in the level
                  if (node.left) queue.push(node.left);
                  if (node.right) queue.push(node.right);
                }
              }
              return result;
            }
          `,
        },
        {
          name: 'Your accepted solution (DFS, right child first, LeetCode)',
          time: 'O(n)',
          space: 'O(h), h = height',
          idea: `
            DFS that visits the **right child before the left**. The first node you reach on a new level is the right-most one,
            and \`level === result.length\` is true exactly once per level, the first time you get there.
          `,
          code: `
            var rightSideView = function (root) {
              let result = [];

              function DFS(root, level) {
                if (root == null) return;
                if (level === result.length) {
                  result.push(root.val);
                }
                DFS(root.right, level + 1);
                DFS(root.left, level + 1);
              }

              DFS(root, 0);
              return result;
            };
          `,
        }
      ],
      explanation: `
        **The trick in your code: \`level === result.length\`.** \`result\` has one value per level already seen, so its length is
        the next new level. When you reach a level for the first time, the two are equal, so you push the value. Going **right
        first** makes that first node the right-most one.

        **Swap two lines and you get the left view:** call \`DFS(root.left)\` before \`DFS(root.right)\`.

        **A common mistake:** "just keep going right". In \`[1,2,3,4]\`, node 4 hangs under 2 on the **left**, but it is still the
        only node on its level, so you see it from the right. The level-based rule handles this; following only right children doesn't.
      `,
      fn: 'rightSideView',
      input: tree,
      tests: [
        { args: [[1, 2, 3, 4, 5, null, 6, null, null, null, 7]], expected: [1, 3, 6, 7], label: 'the tree in the picture' },
        { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] },
        { args: [[1, 2, 3, 4, null, null, null, 5]], expected: [1, 3, 4, 5], label: 'a left-side node is seen on its own level' },
        { args: [[1, null, 3]], expected: [1, 3] },
        { args: [[]], expected: [], label: 'empty tree' },
      ],
    },
    {
      id: 'left-view',
      title: 'Left View of a Binary Tree',
      difficulty: 'Easy',
      lc: 'https://www.geeksforgeeks.org/problems/left-view-of-binary-tree/1',
      from: 'IL10 – Trees 1 & BST (related)',
      tags: ['dfs', 'bfs', 'level-order', 'views'],
      statement: 'Return the nodes you see when standing on the **left side** of a binary tree, top to bottom: the **first** node of every level.\n\n**Example:** `[1,2,3,4,5,null,6,null,null,null,7]` → `[1, 2, 4, 7]`',
      visual: { type: 'tree-views', view: 'left', title: 'Same tree, four views: switch between them' },
      approaches: [
        {
          name: 'BFS, level by level',
          time: 'O(n)',
          space: 'O(w)',
          idea: `Same as the right view, but keep the **first** node of each level (\`i === 0\`).`,
          code: `
            function leftView(root) {
              if (!root) return [];
              const result = [];
              const queue = [root];
              let front = 0;
              while (front < queue.length) {
                const size = queue.length - front;
                for (let i = 0; i < size; i++) {
                  const node = queue[front++];
                  if (i === 0) result.push(node.val); // first in the level
                  if (node.left) queue.push(node.left);
                  if (node.right) queue.push(node.right);
                }
              }
              return result;
            }
          `,
        },
        {
          name: 'DFS, left child first',
          time: 'O(n)',
          space: 'O(h)',
          idea: `Your right-view code with the two calls swapped: go **left first**, and push when \`level === result.length\`.`,
          code: `
            function leftView(root) {
              const result = [];
              function dfs(node, level) {
                if (!node) return;
                if (level === result.length) result.push(node.val);
                dfs(node.left, level + 1);
                dfs(node.right, level + 1);
              }
              dfs(root, 0);
              return result;
            }
          `,
        }
      ],
      explanation: `
        **Left and right views are about levels (rows).** One node per level: the first (left view) or the last (right view).
        Switch between the views in the picture to see the difference.

        **Edge case:** a node on the right can still be in the left view if nothing is to its left on that level, e.g. 3 in \`[1,null,3]\`.
      `,
      fn: 'leftView',
      input: tree,
      tests: [
        { args: [[1, 2, 3, 4, 5, null, 6, null, null, null, 7]], expected: [1, 2, 4, 7], label: 'the tree in the picture' },
        { args: [[1, 2, 3, null, 5, null, 4]], expected: [1, 2, 5] },
        { args: [[1, null, 3]], expected: [1, 3], label: 'a right child seen from the left' },
        { args: [[]], expected: [], label: 'empty tree' },
      ],
    },
    {
      id: 'top-view',
      title: 'Top View of a Binary Tree',
      difficulty: 'Medium',
      lc: 'https://www.geeksforgeeks.org/problems/top-view-of-binary-tree/1',
      from: 'IL10 – Trees 1 & BST (related)',
      tags: ['bfs', 'horizontal-distance', 'hash-map', 'views'],
      statement: 'Return the nodes you see when looking at a binary tree **from above**, from the left-most column to the right-most.\n\nGive every node a **horizontal distance** (column): root `0`, left child `column − 1`, right child `column + 1`. The top view is the **highest** node (closest to the root) in each column.\n\n**Example:** `[1,2,3,4,5,null,6,null,null,null,7]` → `[4, 2, 1, 3, 6]`',
      visual: { type: 'tree-views', view: 'top', title: 'Same tree, four views: switch between them' },
      approaches: [
        {
          name: 'BFS with column numbers',
          time: 'O(n)',
          space: 'O(n)',
          idea: `BFS visits nodes top to bottom, so the **first** node you meet in a column is the highest one. Remember it and never overwrite.`,
          code: `
            function topView(root) {
              if (!root) return [];
              const first = new Map(); // column -> value of the first (highest) node
              const queue = [[root, 0]];
              let minCol = 0, maxCol = 0;
              for (let front = 0; front < queue.length; front++) {
                const [node, col] = queue[front];
                if (!first.has(col)) first.set(col, node.val);
                minCol = Math.min(minCol, col);
                maxCol = Math.max(maxCol, col);
                if (node.left) queue.push([node.left, col - 1]);
                if (node.right) queue.push([node.right, col + 1]);
              }
              const result = [];
              for (let col = minCol; col <= maxCol; col++) result.push(first.get(col));
              return result;
            }
          `,
        },
        {
          name: 'DFS, keeping the highest level per column',
          time: 'O(n)',
          space: 'O(n)',
          idea: `DFS doesn't go top to bottom, so store \`[level, value]\` per column and only **replace** it with a node on a **smaller** level.`,
          code: `
            function topView(root) {
              const best = new Map(); // column -> [level, value]
              function dfs(node, col, level) {
                if (!node) return;
                const cur = best.get(col);
                if (!cur || level < cur[0]) best.set(col, [level, node.val]);
                dfs(node.left, col - 1, level + 1);
                dfs(node.right, col + 1, level + 1);
              }
              dfs(root, 0, 0);
              return [...best.keys()].sort((a, b) => a - b).map((c) => best.get(c)[1]);
            }
          `,
        }
      ],
      explanation: `
        **Top and bottom views are about columns, not levels.** Number the columns: root 0, go left −1, go right +1. Nodes in the
        same column hide each other from above: in the picture, 3 hides 7 and 1 hides 5.

        **Why BFS is the natural fit:** it visits nodes in order of level, so the first node you see in each column is automatically
        the highest. With DFS you have to compare levels yourself.

        **Columns always form one unbroken range** (each child is exactly one column away from its parent), so you can loop from
        the smallest to the largest column instead of sorting.
      `,
      fn: 'topView',
      input: tree,
      tests: [
        { args: [[1, 2, 3, 4, 5, null, 6, null, null, null, 7]], expected: [4, 2, 1, 3, 6], label: 'the tree in the picture' },
        { args: [[10, 20, 30, 40, 60, 90, 100]], expected: [40, 20, 10, 30, 100] },
        { args: [[1, 2, 3, null, 4, null, null, null, 5, null, 6]], expected: [2, 1, 3, 6], label: 'a long right-going branch' },
        { args: [[1, 2, 3]], expected: [2, 1, 3] },
        { args: [[]], expected: [], label: 'empty tree' },
      ],
    },
    {
      id: 'bottom-view',
      title: 'Bottom View of a Binary Tree',
      difficulty: 'Medium',
      lc: 'https://www.geeksforgeeks.org/problems/bottom-view-of-binary-tree/1',
      from: 'IL10 – Trees 1 & BST (related)',
      tags: ['bfs', 'horizontal-distance', 'hash-map', 'views'],
      statement: 'Return the nodes you see when looking at a binary tree **from below**, from the left-most column to the right-most: the **lowest** node in each column (root `0`, left `− 1`, right `+ 1`). If two nodes share the same column and level, take the one that comes **later** in level order.\n\n**Example:** `[1,2,3,4,5,null,6,null,null,null,7]` → `[4, 2, 5, 7, 6]`',
      visual: { type: 'tree-views', view: 'bottom', title: 'Same tree, four views: switch between them' },
      approaches: [
        {
          name: 'BFS with column numbers (overwrite)',
          time: 'O(n)',
          space: 'O(n)',
          idea: `Same as the top view, but **always overwrite**: the last node BFS meets in a column is the lowest (and, on a tie, the later one).`,
          code: `
            function bottomView(root) {
              if (!root) return [];
              const last = new Map(); // column -> value of the last (lowest) node
              const queue = [[root, 0]];
              let minCol = 0, maxCol = 0;
              for (let front = 0; front < queue.length; front++) {
                const [node, col] = queue[front];
                last.set(col, node.val); // overwrite
                minCol = Math.min(minCol, col);
                maxCol = Math.max(maxCol, col);
                if (node.left) queue.push([node.left, col - 1]);
                if (node.right) queue.push([node.right, col + 1]);
              }
              const result = [];
              for (let col = minCol; col <= maxCol; col++) result.push(last.get(col));
              return result;
            }
          `,
        },
        {
          name: 'DFS, keeping the lowest level per column',
          time: 'O(n)',
          space: 'O(n)',
          idea: `Store \`[level, value]\` per column and replace when the new node's level is **greater or equal** (equal: a later node on the same level wins, like BFS).`,
          code: `
            function bottomView(root) {
              const best = new Map(); // column -> [level, value]
              function dfs(node, col, level) {
                if (!node) return;
                const cur = best.get(col);
                if (!cur || level >= cur[0]) best.set(col, [level, node.val]);
                dfs(node.left, col - 1, level + 1);
                dfs(node.right, col + 1, level + 1);
              }
              dfs(root, 0, 0);
              return [...best.keys()].sort((a, b) => a - b).map((c) => best.get(c)[1]);
            }
          `,
        }
      ],
      explanation: `
        **Top view keeps the first node in each column; bottom view keeps the last.** That is the whole difference in code:
        \`if (!first.has(col))\` versus always \`last.set(col, ...)\`.

        **Ties:** in \`[10,20,30,40,60,90,100]\`, nodes 60 and 90 are both in column 0 on the same level. The bottom view takes
        90, the later one in level order. BFS does that naturally by overwriting; in DFS you need \`>=\` (not \`>\`).

        **Interview pairing:** these four views are often asked together. Remember: left / right = one node per **level**,
        top / bottom = one node per **column**.
      `,
      fn: 'bottomView',
      input: tree,
      tests: [
        { args: [[1, 2, 3, 4, 5, null, 6, null, null, null, 7]], expected: [4, 2, 5, 7, 6], label: 'the tree in the picture' },
        { args: [[20, 8, 22, 5, 3, null, 25, null, null, 10, 14]], expected: [5, 10, 3, 14, 25] },
        { args: [[10, 20, 30, 40, 60, 90, 100]], expected: [40, 20, 90, 30, 100], label: 'a tie in column 0: the later node wins' },
        { args: [[1, 2, 3]], expected: [2, 1, 3] },
        { args: [[]], expected: [], label: 'empty tree' },
      ],
    },
    {
      id: 'diameter',
      title: 'Diameter of Binary Tree',
      difficulty: 'Easy',
      lc: 'diameter-of-binary-tree',
      tags: ['post-order'],
      statement: 'Length (in edges) of the longest path between any two nodes.',
      approaches: [
        {
          name: 'Height with global best',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'At each node the longest path through it = `height(left) + height(right)`. Return height to the parent, track the best path globally.',
          code: `
            function diameterOfBinaryTree(root) {
              let best = 0;
              const height = (n) => {
                if (!n) return 0;
                const l = height(n.left), r = height(n.right);
                best = Math.max(best, l + r);
                return 1 + Math.max(l, r);
              };
              height(root);
              return best;
            }
          `,
        },
      ],
      fn: 'diameterOfBinaryTree',
      input: tree,
      tests: [
        { args: [[1, 2, 3, 4, 5]], expected: 3 },
        { args: [[1, 2]], expected: 1 },
      ],
    },
    {
      id: 'lca',
      title: 'Lowest Common Ancestor of a Binary Tree',
      difficulty: 'Medium',
      lc: 'lowest-common-ancestor-of-a-binary-tree',
      tags: ['post-order'],
      statement: 'Return the LCA of nodes p and q. (Tests pass values; the adapter finds the nodes.)',
      approaches: [
        {
          name: 'Bubble up found nodes',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'If a node is p or q, return it. If both subtrees return non-null, this node is the split point = LCA.',
          code: `
            function lowestCommonAncestor(root, p, q) {
              if (!root || root === p || root === q) return root;
              const l = lowestCommonAncestor(root.left, p, q);
              const r = lowestCommonAncestor(root.right, p, q);
              return l && r ? root : l || r;
            }
          `,
        },
      ],
      explanation: 'For a **BST** it is simpler: walk down from the root — go left if both are smaller, right if both are larger, else you are at the LCA.',
      fn: 'lowestCommonAncestor',
      input: ([arr, p, q], H) => {
        const root = H.tree(arr);
        return [root, H.find(root, p), H.find(root, q)];
      },
      output: (r) => r && r.val,
      tests: [
        { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 1], expected: 3 },
        { args: [[3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], 5, 4], expected: 5 },
      ],
    },
    {
      id: 'validate-bst',
      title: 'Validate Binary Search Tree',
      difficulty: 'Medium',
      lc: 'validate-binary-search-tree',
      tags: ['bst', 'bounds'],
      statement: 'Return true if the tree is a valid BST (strictly increasing inorder).',
      approaches: [
        {
          name: 'Min/max bounds',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'Each node must lie in `(low, high)` inherited from **all** ancestors.',
          code: `
            function isValidBST(root, low = -Infinity, high = Infinity) {
              if (!root) return true;
              if (root.val <= low || root.val >= high) return false;
              return isValidBST(root.left, low, root.val) && isValidBST(root.right, root.val, high);
            }
          `,
        },
      ],
      explanation: 'Classic trap: `[5,4,6,null,null,3,7]` — 3 is a valid child of 6 but violates the root bound.',
      fn: 'isValidBST',
      input: tree,
      tests: [
        { args: [[2, 1, 3]], expected: true },
        { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
        { args: [[5, 4, 6, null, null, 3, 7]], expected: false },
      ],
    },
    {
      id: 'kth-smallest-bst',
      title: 'Kth Smallest Element in a BST',
      difficulty: 'Medium',
      lc: 'kth-smallest-element-in-a-bst',
      tags: ['bst', 'inorder'],
      statement: 'Return the k-th smallest value (1-indexed).',
      approaches: [
        {
          name: 'Iterative inorder, stop at k',
          time: 'O(h + k)',
          space: 'O(h)',
          code: `
            function kthSmallest(root, k) {
              const st = [];
              let cur = root;
              while (true) {
                while (cur) { st.push(cur); cur = cur.left; }
                cur = st.pop();
                if (--k === 0) return cur.val;
                cur = cur.right;
              }
            }
          `,
        },
      ],
      fn: 'kthSmallest',
      input: tree,
      tests: [
        { args: [[3, 1, 4, null, 2], 1], expected: 1 },
        { args: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      ],
    },
    {
      id: 'max-path-sum',
      title: 'Binary Tree Maximum Path Sum',
      difficulty: 'Hard',
      lc: 'binary-tree-maximum-path-sum',
      tags: ['post-order'],
      statement: 'Maximum sum of any path (node sequence, each node once, need not pass through root).',
      approaches: [
        {
          name: 'Best downward gain per node',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'gain(n) = n.val + max(0, gain(left), gain(right)) — negative branches are dropped. The path *through* n uses both gains.',
          code: `
            function maxPathSum(root) {
              let best = -Infinity;
              const gain = (n) => {
                if (!n) return 0;
                const l = Math.max(0, gain(n.left)), r = Math.max(0, gain(n.right));
                best = Math.max(best, n.val + l + r);
                return n.val + Math.max(l, r);
              };
              gain(root);
              return best;
            }
          `,
        },
      ],
      fn: 'maxPathSum',
      input: tree,
      tests: [
        { args: [[1, 2, 3]], expected: 6 },
        { args: [[-10, 9, 20, null, null, 15, 7]], expected: 42 },
        { args: [[-3]], expected: -3 },
      ],
    },
    {
      id: 'serialize-tree',
      title: 'Serialize and Deserialize Binary Tree',
      difficulty: 'Hard',
      lc: 'serialize-and-deserialize-binary-tree',
      tags: ['design', 'pre-order'],
      statement: 'Design `serialize(root) → string` and `deserialize(string) → root`. The test round-trips a tree.',
      approaches: [
        {
          name: 'Pre-order with null markers',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function serialize(root) {
              const out = [];
              const go = (n) => {
                if (!n) return out.push('#');
                out.push(n.val);
                go(n.left);
                go(n.right);
              };
              go(root);
              return out.join(',');
            }
            function deserialize(data) {
              const tokens = data.split(',');
              let i = 0;
              const go = () => {
                const t = tokens[i++];
                if (t === '#') return null;
                const n = new TreeNode(Number(t));
                n.left = go();
                n.right = go();
                return n;
              };
              return go();
            }
            function roundTrip(root) {
              return deserialize(serialize(root));
            }
          `,
        },
      ],
      fn: 'roundTrip',
      input: tree,
      output: (r, H) => H.level(r),
      tests: [
        { args: [[1, 2, 3, null, null, 4, 5]], expected: [1, 2, 3, null, null, 4, 5] },
        { args: [[]], expected: [] },
      ],
    },
  ],
};
