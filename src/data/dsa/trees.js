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
