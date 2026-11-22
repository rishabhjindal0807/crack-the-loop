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
      id: 'build-tree-preorder-inorder',
      title: 'Construct Binary Tree from Preorder and Inorder Traversal',
      difficulty: 'Medium',
      lc: 'construct-binary-tree-from-preorder-and-inorder-traversal',
      from: 'IL10 – Trees 1 & BST',
      tags: ['recursion', 'divide-and-conquer', 'hash-map', 'traversals'],
      statement: 'Given `preorder` and `inorder` traversals of the same binary tree (all values are unique), rebuild the tree and return its root.\n\n**Example:** `preorder = [3,9,20,15,7]`, `inorder = [9,3,15,20,7]` → `[3,9,20,null,null,15,7]`',
      visual: {"type": "tree-build", "title": "Build the tree: preorder gives the root, inorder gives the split", "preorder": [3, 9, 1, 2, 20, 15, 7], "inorder": [1, 9, 2, 3, 15, 20, 7], "parent": {"3": null, "9": 3, "1": 9, "2": 9, "20": 3, "15": 20, "7": 20}, "depth": {"3": 0, "9": 1, "1": 2, "2": 2, "20": 1, "15": 2, "7": 2}, "steps": [{"built": [], "pre": [0, 6], "ins": [0, 6], "code": "buildTree(preorder, inorder)", "caption": "Two facts do all the work. Preorder is root, then left subtree, then right subtree, so its FIRST value is always the root. Inorder is left subtree, then root, then right subtree, so the root SPLITS it into the two sides."}, {"root": 3, "pre": [0, 6], "ins": [0, 6], "idx": 3, "built": [3], "code": "root = 3;  index = inorder.indexOf(3)  // 3;  count = 3 − 0 = 3", "caption": "The first value in this preorder part is 3, so 3 is the root. Find 3 in inorder (index 3): [1, 9, 2] on its left goes to the left subtree, [15, 20, 7] on its right goes to the right subtree. The left side has count = 3 nodes, so in preorder the next 3 values [9, 1, 2] belong to the left subtree and [20, 15, 7] to the right."}, {"root": 9, "pre": [1, 3], "ins": [0, 2], "idx": 1, "built": [3, 9], "code": "root = 9;  index = inorder.indexOf(9)  // 1;  count = 1 − 0 = 1", "caption": "The first value in this preorder part is 9, so 9 is the root. Find 9 in inorder (index 1): [1] on its left goes to the left subtree, [2] on its right goes to the right subtree. The left side has count = 1 node, so in preorder the next 1 value [1] belong to the left subtree and [2] to the right."}, {"root": 1, "pre": [2, 2], "ins": [0, 0], "idx": 0, "built": [3, 9, 1], "code": "root = 1;  index = inorder.indexOf(1)  // 0;  count = 0 − 0 = 0", "caption": "The first value in this preorder part is 1, so 1 is the root here. In inorder it has nothing on either side, so it is a leaf: both calls below get an empty range and return null."}, {"root": 2, "pre": [3, 3], "ins": [2, 2], "idx": 2, "built": [3, 9, 1, 2], "code": "root = 2;  index = inorder.indexOf(2)  // 2;  count = 2 − 2 = 0", "caption": "The first value in this preorder part is 2, so 2 is the root here. In inorder it has nothing on either side, so it is a leaf: both calls below get an empty range and return null."}, {"root": 20, "pre": [4, 6], "ins": [4, 6], "idx": 5, "built": [3, 9, 1, 2, 20], "code": "root = 20;  index = inorder.indexOf(20)  // 5;  count = 5 − 4 = 1", "caption": "The first value in this preorder part is 20, so 20 is the root. Find 20 in inorder (index 5): [15] on its left goes to the left subtree, [7] on its right goes to the right subtree. The left side has count = 1 node, so in preorder the next 1 value [15] belong to the left subtree and [7] to the right."}, {"root": 15, "pre": [5, 5], "ins": [4, 4], "idx": 4, "built": [3, 9, 1, 2, 20, 15], "code": "root = 15;  index = inorder.indexOf(15)  // 4;  count = 4 − 4 = 0", "caption": "The first value in this preorder part is 15, so 15 is the root here. In inorder it has nothing on either side, so it is a leaf: both calls below get an empty range and return null."}, {"root": 7, "pre": [6, 6], "ins": [6, 6], "idx": 6, "built": [3, 9, 1, 2, 20, 15, 7], "code": "root = 7;  index = inorder.indexOf(7)  // 6;  count = 6 − 6 = 0", "caption": "The first value in this preorder part is 7, so 7 is the root here. In inorder it has nothing on either side, so it is a leaf: both calls below get an empty range and return null."}, {"built": [3, 9, 1, 2, 20, 15, 7], "pre": [0, 6], "ins": [0, 6], "code": "return root  // [3, 9, 20, 1, 2, 15, 7]", "caption": "Every value became a node exactly once. Notice each node sits right above its place in the inorder array: reading the tree left to right gives the inorder order back."}]},
      approaches: [
        {
          name: 'Hash map for the inorder index (O(n))',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Same split, but look up the root\'s inorder index in a **Map** built once, instead of `indexOf` every time. A single `preIndex` pointer walks through preorder, because preorder visits roots in exactly the order the recursion needs them (root, then the whole left side, then the right side).',
          code: `
            function buildTree(preorder, inorder) {
              const where = new Map(inorder.map((v, i) => [v, i])); // value -> inorder index
              let preIndex = 0;
              function build(inStart, inEnd) {
                if (inStart > inEnd) return null;
                const rootVal = preorder[preIndex++];
                const root = new TreeNode(rootVal);
                const mid = where.get(rootVal);
                root.left = build(inStart, mid - 1);  // must build left first: preorder is root, left, right
                root.right = build(mid + 1, inEnd);
                return root;
              }
              return build(0, inorder.length - 1);
            }
          `,
        },
        {
          name: 'Your accepted solution (LeetCode)',
          time: 'O(n²) worst case (indexOf)',
          space: 'O(n)',
          idea: `
            The first value of the current preorder range is the root. Find it in inorder: the \`count = index − inStart\` values on
            its left form the left subtree, so in preorder the left subtree is the next \`count\` values and the right subtree is
            everything after. Recurse on both sides. Step through the visual above.
          `,
          code: `
            var buildTree = function (preorder, inorder) {

              function helper(preorder, inorder, inStart, inEnd, preStart, preEnd) {

                if (inStart > inEnd || preStart > preEnd) return null;

                let index = inorder.indexOf(preorder[preStart]);
                let root = new TreeNode(preorder[preStart]);
                let count = index - inStart;
                root.left = helper(preorder, inorder, inStart, index - 1, preStart + 1, preEnd + count);
                root.right = helper(preorder, inorder, index + 1, inEnd, preStart + count + 1, preEnd);
                return root;

              }
              return helper(preorder, inorder, 0, inorder.length - 1, 0, preorder.length - 1);
            };
          `,
        },
      ],
      explanation: `
        **One small fix to your code.** In the left call, the preorder range should end at \`preStart + count\`, not \`preEnd + count\`.
        The left subtree is exactly the \`count\` values right after the root. Your version still passes because the inorder check
        \`inStart > inEnd\` is what really stops the recursion, and only \`preStart\` is ever read, so the wrong end is never used.
        It's worth fixing anyway: an interviewer reading it will ask.

        **Make it O(n):** \`inorder.indexOf\` scans the array on every call, so a skewed tree (like a linked list) costs O(n²).
        Build a \`Map\` from value to index once (first approach above). You can also drop the preorder range completely and use
        one moving \`preIndex\`.

        **Why it needs unique values:** the split depends on finding the root's exact position in inorder. With duplicates, the
        position is ambiguous and the tree can't be rebuilt reliably.

        **Related questions:**
        - **Inorder + postorder (LC 106):** the root is the **last** value of postorder. Build the **right** subtree first when walking postorder backwards.
        - **Preorder + postorder (LC 889):** not enough on its own to pin down a unique tree, unless every node has 0 or 2 children.
        - **Preorder of a BST alone (LC 1008):** enough, because the BST order gives you the inorder for free.
      `,
      fn: 'buildTree',
      output: (r, H) => H.level(r),
      tests: [
        { args: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
        { args: [[-1], [-1]], expected: [-1], label: 'one node' },
        { args: [[3, 9, 1, 2, 20, 15, 7], [1, 9, 2, 3, 15, 20, 7]], expected: [3, 9, 20, 1, 2, 15, 7], label: 'the tree in the visual' },
        { args: [[1, 2, 3, 4], [4, 3, 2, 1]], expected: [1, 2, null, 3, null, 4], label: 'only left children (worst case for indexOf)' },
        { args: [[1, 2, 3], [1, 2, 3]], expected: [1, null, 2, null, 3], label: 'only right children' },
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
      id: 'lca-bst',
      title: 'Lowest Common Ancestor of a Binary Search Tree',
      difficulty: 'Medium',
      lc: 'lowest-common-ancestor-of-a-binary-search-tree',
      from: 'IL10 – Trees 1 & BST',
      tags: ['bst', 'lca', 'recursion'],
      statement: 'Given a **BST** and two nodes `p` and `q` in it, return their **lowest common ancestor**: the lowest node that has both `p` and `q` as descendants (a node counts as a descendant of itself).\n\n**Examples** (tree `[6,2,8,0,4,7,9,null,null,3,5]`): `p = 2, q = 8` → `6` · `p = 2, q = 4` → `2`\n\n*(Tests pass the values of p and q; the test adapter finds the nodes.)*',
      visual: {"type": "graph", "title": "Walk down from the root until p and q split", "height": 330, "nodes": {"6": [280, 40], "2": [150, 120], "8": [410, 120], "0": [85, 205], "4": [215, 205], "7": [345, 205], "9": [475, 205], "3": [165, 290], "5": [265, 290]}, "edges": [["6", "2"], ["6", "8"], ["2", "0"], ["2", "4"], ["8", "7"], ["8", "9"], ["4", "3"], ["4", "5"]], "listLabel": "call stack", "waitingLabel": "on the path", "steps": [{"seen": [], "done": [], "list": [], "tree": [], "labels": {"3": "p = 3", "5": "q = 5"}, "code": "lowestCommonAncestor(root, p = 3, q = 5)", "caption": "In a BST, everything left of a node is smaller and everything right is bigger. So comparing p and q with the current node tells you exactly which side both of them are on, with no searching."}, {"seen": ["6"], "done": [], "current": "6", "list": ["6"], "tree": [], "hot": [["6", "2"]], "labels": {"3": "p = 3", "5": "q = 5"}, "code": "p.val (3) < 6 && q.val (5) < 6  →  go left", "caption": "Both 3 and 5 are smaller than 6, so both are in 6's LEFT subtree. A lower common ancestor must be down there too. The whole right side (8, 7, 9) is never looked at."}, {"seen": ["6", "2"], "done": ["6"], "current": "2", "list": ["6", "2"], "tree": [["6", "2"]], "hot": [["2", "4"]], "labels": {"3": "p = 3", "5": "q = 5"}, "code": "p.val (3) > 2 && q.val (5) > 2  →  go right", "caption": "Both are bigger than 2, so both are in 2's RIGHT subtree. Skip 0 and go right."}, {"seen": ["6", "2", "4"], "done": ["6", "2"], "current": "4", "found": "4", "list": ["6", "2", "4"], "tree": [["6", "2"], ["2", "4"]], "labels": {"3": "p = 3", "5": "q = 5"}, "code": "3 < 4 < 5  →  neither if matches: return root (4)", "caption": "Now p is on the left of 4 and q is on the right: they split here. Any node lower down would contain only one of them, so 4 is the LOWEST common ancestor."}, {"seen": ["6", "2", "4"], "done": ["6", "2", "4"], "found": "4", "list": [], "tree": [["6", "2"], ["2", "4"]], "labels": {"3": "p = 3", "5": "q = 5"}, "code": "return 4  // visited 3 nodes = the height, not the whole tree", "caption": "Other cases reach the same last line. p = 2, q = 8: they split at the root, so the answer is 6. p = 2, q = 4: 2 equals p, so 2 is the answer (a node counts as its own ancestor)."}]},
      approaches: [
        {
          name: 'Iterative walk (O(1) extra space)',
          time: 'O(h)',
          space: 'O(1)',
          idea: 'Your recursion only ever makes one call, the last thing it does, so it turns into a loop with no call stack: move left or right until p and q split.',
          code: `
            function lowestCommonAncestor(root, p, q) {
              let node = root;
              while (node) {
                if (p.val < node.val && q.val < node.val) node = node.left;
                else if (p.val > node.val && q.val > node.val) node = node.right;
                else return node; // they split here, or one of them IS this node
              }
              return null;
            }
          `,
        },
        {
          name: 'Your accepted solution (recursive, LeetCode)',
          time: 'O(h)',
          space: 'O(h) recursion',
          idea: `
            If both values are smaller than the root, the answer is in the left subtree; if both are bigger, it's in the right
            subtree. Otherwise they split at this node (or one of them is this node), so this node is the answer. Step through
            the visual above. Each \`if\` returns, so no \`else\` is needed: reaching the last line already means "not both
            left, not both right".
          `,
          code: `
            var lowestCommonAncestor = function (root, p, q) {
              if (root == null) return null;
              if (p.val < root.val && q.val < root.val) {
                return lowestCommonAncestor(root.left, p, q);
              }
              if (p.val > root.val && q.val > root.val) {
                return lowestCommonAncestor(root.right, p, q);
              }
              return root;
            };
          `,
        },
      ],
      explanation: `
        **Why the final \`return root\` is the answer:** if the values are not both smaller and not both bigger, then either
        \`p < root < q\` (they are on different sides), or one of them **equals** the root. In both cases no node lower down
        contains both, so this is the lowest common ancestor.

        **BST vs. normal binary tree (LC 236, also on this page):** in a normal tree you can't tell which side a node is on, so
        you search both subtrees, O(n). Here the BST ordering points the way, so you follow **one path**: O(h), which is
        O(log n) for a balanced tree. If an interviewer gives you a BST and you use the LC 236 solution, mention that you are
        not using the BST property, then improve it.

        **Space:** your recursion makes at most one call per level, and the call is the last thing it does (a tail call). That
        makes the loop version a direct rewrite with O(1) space.

        **Edge cases:** p is an ancestor of q (return p); p and q are the same node; the tree has two nodes. The tests cover them.
      `,
      fn: 'lowestCommonAncestor',
      input: ([arr, p, q], H) => {
        const root = H.tree(arr);
        return [root, H.find(root, p), H.find(root, q)];
      },
      output: (r) => (r ? r.val : null),
      tests: [
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 8], expected: 6, label: 'split at the root' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 2, 4], expected: 2, label: 'p is an ancestor of q' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 3, 5], expected: 4, label: 'the walk in the visual' },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 7, 9], expected: 8 },
        { args: [[6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], 0, 5], expected: 2 },
        { args: [[2, 1], 2, 1], expected: 2, label: 'two nodes' },
        { args: [[2, 1], 1, 1], expected: 1, label: 'p and q are the same node' },
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
      from: 'IL10 – Trees 1 & BST',
      tags: ['bst', 'bounds', 'inorder', 'recursion'],
      statement: 'Return `true` if the tree is a valid **binary search tree**: every node in the left subtree is **strictly less** than the node, every node in the right subtree is **strictly greater**, and both subtrees are BSTs too.\n\n**Examples:** `[2,1,3]` → `true` · `[5,1,4,null,null,3,6]` → `false` (4 is in 5\'s right subtree but smaller than 5)',
      visual: {"type": "graph", "title": "Each node must fit in the range set by ALL its ancestors", "nodes": {"5": [280, 55], "4": [150, 145], "6": [410, 145], "3": [330, 240], "7": [490, 240]}, "edges": [["5", "4"], ["5", "6"], ["6", "3"], ["6", "7"]], "listLabel": "call stack", "waitingLabel": "checked, children still to check", "steps": [{"seen": [], "done": [], "list": [], "tree": [], "stat": {"label": "valid BST", "value": "?"}, "code": "isValidBST(root)  // [5, 4, 6, null, null, 3, 7]", "caption": "Check each node only against its own children and this looks fine: 4 < 5 < 6, and 3 < 6 < 7. But 3 is in the RIGHT subtree of 5, so it must be greater than 5. A node must respect ALL its ancestors, not just its parent."}, {"seen": ["5"], "done": [], "current": "5", "list": ["5"], "tree": [], "labels": {"5": "(−∞, ∞)"}, "stat": {"label": "valid BST", "value": "?"}, "code": "BSTUtil(5, -Infinity, Infinity)  // -∞ < 5 < ∞ ✓", "caption": "The root can be anything: its range is (−∞, ∞). 5 is inside, so check its children. Left child gets max = 5, right child gets min = 5."}, {"seen": ["5", "4"], "done": [], "current": "4", "list": ["5", "4"], "tree": [["5", "4"]], "hot": [["5", "4"]], "labels": {"5": "(−∞, ∞)", "4": "(−∞, 5)"}, "stat": {"label": "valid BST", "value": "?"}, "code": "BSTUtil(4, -Infinity, 5)  // -∞ < 4 < 5 ✓", "caption": "Going LEFT from 5, everything must be less than 5: range (−∞, 5). 4 is inside. Its children are null, so this side returns true."}, {"seen": ["5", "4", "6"], "done": ["4"], "current": "6", "list": ["5", "6"], "tree": [["5", "4"], ["5", "6"]], "hot": [["5", "6"]], "labels": {"5": "(−∞, ∞)", "4": "(−∞, 5)", "6": "(5, ∞)"}, "stat": {"label": "valid BST", "value": "?"}, "code": "BSTUtil(6, 5, Infinity)  // 5 < 6 < ∞ ✓", "caption": "Going RIGHT from 5, everything must be greater than 5: range (5, ∞). 6 is inside. Its left child gets max = 6, but the min stays 5."}, {"seen": ["5", "4", "6", "3"], "done": ["4"], "current": "3", "list": ["5", "6", "3"], "tree": [["5", "4"], ["5", "6"], ["6", "3"]], "hot": [["6", "3"]], "labels": {"5": "(−∞, ∞)", "4": "(−∞, 5)", "6": "(5, ∞)", "3": "(5, 6) ✗"}, "stat": {"label": "valid BST", "value": "no"}, "code": "BSTUtil(3, 5, 6)  // 3 <= min (5) → return false", "caption": "3 inherits BOTH limits: greater than 5 (from the root) and less than 6 (from its parent). 3 is not greater than 5, so this is not a BST. The min of 5 is exactly what catches the trap."}, {"seen": ["5", "4", "6", "3"], "done": ["4", "3"], "list": [], "tree": [["5", "4"], ["5", "6"], ["6", "3"]], "labels": {"5": "(−∞, ∞)", "4": "(−∞, 5)", "6": "(5, ∞)", "3": "(5, 6) ✗"}, "stat": {"label": "valid BST", "value": "no"}, "code": "return false  // && stops early: 7 is never checked", "caption": "false travels back up through the && in each call, so 7 is never visited. Fix the tree by changing 3 to something between 5 and 6, and every check passes."}]},
      approaches: [
        {
          name: 'Inorder must be strictly increasing',
          time: 'O(n)',
          space: 'O(h)',
          idea: 'An inorder walk of a BST visits values in **sorted order**. Walk the tree inorder, remember the previous value, and fail as soon as a value is not greater than the one before it.',
          code: `
            function isValidBST(root) {
              let prev = -Infinity;
              function inorder(node) {
                if (!node) return true;
                if (!inorder(node.left)) return false;
                if (node.val <= prev) return false; // must be strictly increasing
                prev = node.val;
                return inorder(node.right);
              }
              return inorder(root);
            }
          `,
        },
        {
          name: 'Your accepted solution (min/max range, LeetCode)',
          time: 'O(n)',
          space: 'O(h) recursion',
          idea: `
            Pass down the **range** each node must fit in. Going left, the current value becomes the new **max**; going right, it
            becomes the new **min**. Each node is checked against limits from **all** its ancestors, not just its parent. Step
            through the visual above to see the trap it catches.
          `,
          code: `
            var isValidBST = function (root) {

              function BSTUtil(root, min, max) {
                if (root == null) return true;
                let val = root.val;
                if (val <= min || val >= max) return false;
                return BSTUtil(root.left, min, val) && BSTUtil(root.right, val, max);
              }

              return BSTUtil(root, -Infinity, Infinity);
            };
          `,
        },
      ],
      explanation: `
        **The trap interviewers use:** checking only \`node.left.val < node.val < node.right.val\` is **wrong**. In
        \`[5,4,6,null,null,3,7]\` every parent–child pair passes, but 3 sits in 5's right subtree. Your range method catches it
        because 3 inherits min = 5 from the root.

        **Why \`-Infinity\` / \`Infinity\` and not \`Number.MIN_SAFE_INTEGER\` / \`MAX\`:** node values can be as large as
        2³¹ − 1, and a "sentinel" like \`2147483647\` would wrongly reject a real node with that value. Infinity can never equal a
        real value. (In Java or C++, people use \`long\` or \`null\` for the same reason.)

        **Strictly less / greater:** \`<=\` and \`>=\` in your check mean duplicates make it invalid. \`[2,2,2]\` returns false.
        Some interviewers allow duplicates on one side, so ask.

        **Which approach to say:** both are O(n). The range method explains the rule directly; the inorder one uses a fact worth
        remembering: **a tree is a BST exactly when its inorder traversal is strictly increasing**. That same fact solves Kth
        Smallest in a BST and Recover BST on this page.
      `,
      fn: 'isValidBST',
      input: tree,
      tests: [
        { args: [[2, 1, 3]], expected: true },
        { args: [[5, 1, 4, null, null, 3, 6]], expected: false },
        { args: [[5, 4, 6, null, null, 3, 7]], expected: false, label: 'the trap in the visual: valid parent–child pairs, invalid tree' },
        { args: [[2, 2, 2]], expected: false, label: 'duplicates are not allowed' },
        { args: [[2147483647]], expected: true, label: 'the largest possible value' },
        { args: [[-2147483648, null, 2147483647]], expected: true, label: 'both extremes' },
        { args: [[3, 1, 5, 0, 2, 4, 6]], expected: true, label: 'a full valid BST' },
        { args: [[1]], expected: true, label: 'one node' },
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
