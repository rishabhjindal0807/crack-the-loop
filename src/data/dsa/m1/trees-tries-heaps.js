// New problems from Lec 15 (Trees 1 & BST), Lec 16 (BBST & Trees 2), Lec 17 (Tries), Lec 18 (Heaps 1 & 2).

const tree = (a, H) => [H.tree(a[0]), ...a.slice(1)];
const level = (r, H) => H.level(r);

export const treesExtra = [
  {
    id: 'preorder-postorder',
    title: 'Binary Tree Preorder & Postorder Traversal',
    difficulty: 'Easy',
    lc: 'binary-tree-preorder-traversal',
    from: 'Lec 15 – Trees 1 & BST (class questions 1–3)',
    tags: ['dfs', 'traversal'],
    statement: 'Return `[preorder, postorder]` of a binary tree. (LC 144 and LC 145.)',
    approaches: [
      {
        name: 'Recursive',
        time: 'O(n)',
        space: 'O(h)',
        code: `
          function traversals(root) {
            const pre = [], post = [];
            const go = (n) => {
              if (!n) return;
              pre.push(n.val);   // Node, Left, Right
              go(n.left);
              go(n.right);
              post.push(n.val);  // Left, Right, Node
            };
            go(root);
            return [pre, post];
          }
        `,
      },
      {
        name: 'Iterative (one stack each)',
        time: 'O(n)',
        space: 'O(h)',
        idea: 'Preorder: pop, visit, push right then left. Postorder: do “Node, Right, Left” the same way and reverse the result.',
        code: `
          function traversals(root) {
            const pre = [], rev = [];
            if (root) {
              const st = [root];
              while (st.length) {
                const n = st.pop();
                pre.push(n.val);
                if (n.right) st.push(n.right);
                if (n.left) st.push(n.left);
              }
              const st2 = [root];
              while (st2.length) {
                const n = st2.pop();
                rev.push(n.val);
                if (n.left) st2.push(n.left);
                if (n.right) st2.push(n.right);
              }
            }
            return [pre, rev.reverse()];
          }
        `,
      },
    ],
    fn: 'traversals',
    input: tree,
    tests: [
      { args: [[1, null, 2, 3]], expected: [[1, 2, 3], [3, 2, 1]] },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1, 2, 4, 5, 3, 6, 7], [4, 5, 2, 6, 7, 3, 1]] },
      { args: [[]], expected: [[], []] },
    ],
  },
  {
    id: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    lc: 'same-tree',
    from: 'Lec 15 – Trees 1 & BST (class question 4)',
    tags: ['dfs'],
    statement: 'Return true if two binary trees are structurally identical with equal values.',
    approaches: [
      {
        name: 'Simultaneous DFS',
        time: 'O(n)',
        space: 'O(h)',
        code: `
          function isSameTree(p, q) {
            if (!p && !q) return true;
            if (!p || !q || p.val !== q.val) return false;
            return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
          }
        `,
      },
    ],
    explanation: 'Building block for Subtree of Another Tree and Symmetric Tree (compare left with mirrored right).',
    fn: 'isSameTree',
    input: (a, H) => [H.tree(a[0]), H.tree(a[1])],
    tests: [
      { args: [[1, 2, 3], [1, 2, 3]], expected: true },
      { args: [[1, 2], [1, null, 2]], expected: false },
      { args: [[], []], expected: true },
    ],
  },
  {
    id: 'max-depth',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    lc: 'maximum-depth-of-binary-tree',
    from: 'Lec 15 – Trees 1 (Bosscoder notes)',
    tags: ['dfs', 'bfs'],
    statement: 'Return the number of nodes on the longest root-to-leaf path.',
    approaches: [
      {
        name: 'Post-order recursion',
        time: 'O(n)',
        space: 'O(h)',
        code: `
          function maxDepth(root) {
            if (!root) return 0;
            return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
          }
        `,
      },
      {
        name: 'BFS level count',
        time: 'O(n)',
        space: 'O(w)',
        code: `
          function maxDepth(root) {
            let depth = 0, level = root ? [root] : [];
            while (level.length) {
              depth++;
              level = level.flatMap((n) => [n.left, n.right].filter(Boolean));
            }
            return depth;
          }
        `,
      },
    ],
    fn: 'maxDepth',
    input: tree,
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
      { args: [[1, null, 2]], expected: 2 },
      { args: [[]], expected: 0 },
    ],
  },
  {
    id: 'balanced-binary-tree',
    title: 'Balanced Binary Tree',
    difficulty: 'Easy',
    lc: 'balanced-binary-tree',
    from: 'Lec 15 – Trees 1 (Bosscoder notes)',
    tags: ['post-order'],
    statement: 'Return true if, for every node, the heights of the left and right subtrees differ by at most 1.',
    approaches: [
      {
        name: 'Height at every node',
        time: 'O(n²) worst (skewed tree)',
        space: 'O(h)',
        code: `
          function isBalanced(root) {
            const h = (n) => (n ? 1 + Math.max(h(n.left), h(n.right)) : 0);
            if (!root) return true;
            return Math.abs(h(root.left) - h(root.right)) <= 1 && isBalanced(root.left) && isBalanced(root.right);
          }
        `,
      },
      {
        name: 'Height with −1 sentinel',
        time: 'O(n)',
        space: 'O(h)',
        idea: 'Return the height, or −1 as soon as any subtree is unbalanced — one bottom-up pass.',
        code: `
          function isBalanced(root) {
            const h = (n) => {
              if (!n) return 0;
              const l = h(n.left);
              if (l === -1) return -1;
              const r = h(n.right);
              if (r === -1 || Math.abs(l - r) > 1) return -1;
              return 1 + Math.max(l, r);
            };
            return h(root) !== -1;
          }
        `,
      },
    ],
    explanation: 'Balanced (AVL-style) trees keep height O(log n), which is why BST operations stay O(log n) — see “BBST” in Trees 2.',
    fn: 'isBalanced',
    input: tree,
    tests: [
      { args: [[3, 9, 20, null, null, 15, 7]], expected: true },
      { args: [[1, 2, 2, 3, 3, null, null, 4, 4]], expected: false },
      { args: [[]], expected: true },
    ],
  },
  {
    id: 'count-complete-tree-nodes',
    title: 'Count Complete Tree Nodes',
    difficulty: 'Easy',
    lc: 'count-complete-tree-nodes',
    from: 'Lec 15 – Trees 1 (Bosscoder notes)',
    tags: ['binary-search', 'complete-tree'],
    statement: 'Count nodes of a **complete** binary tree in less than O(n).',
    approaches: [
      {
        name: 'Count every node',
        time: 'O(n)',
        space: 'O(h)',
        code: `
          function countNodes(root) {
            return root ? 1 + countNodes(root.left) + countNodes(root.right) : 0;
          }
        `,
      },
      {
        name: 'Perfect-subtree shortcut',
        time: 'O(log² n)',
        space: 'O(log n)',
        idea: 'If the leftmost and rightmost depths match, the subtree is perfect: `2^h − 1` nodes. Otherwise recurse — at most one side is not perfect at each level.',
        code: `
          function countNodes(root) {
            if (!root) return 0;
            let lh = 0, rh = 0;
            for (let n = root; n; n = n.left) lh++;
            for (let n = root; n; n = n.right) rh++;
            if (lh === rh) return 2 ** lh - 1;
            return 1 + countNodes(root.left) + countNodes(root.right);
          }
        `,
      },
    ],
    fn: 'countNodes',
    input: tree,
    tests: [
      { args: [[1, 2, 3, 4, 5, 6]], expected: 6 },
      { args: [[1, 2, 3, 4, 5, 6, 7]], expected: 7 },
      { args: [[]], expected: 0 },
    ],
  },
  {
    id: 'bst-search-insert',
    title: 'Search & Insert in a BST',
    difficulty: 'Easy',
    lc: 'insert-into-a-binary-search-tree',
    from: 'Lec 16 – BBST & Trees 2 (class questions 1–2)',
    tags: ['bst'],
    statement: 'Insert `val` into a BST and return the root (LC 701). Search (LC 700) is the same walk without creating a node.',
    approaches: [
      {
        name: 'Recursive',
        time: 'O(h) — O(log n) balanced, O(n) skewed',
        space: 'O(h)',
        idea: 'Go left if `val < root.val`, else right, until you hit null — that null is where the new node belongs.',
        code: `
          function searchBST(root, val) {
            if (!root || root.val === val) return root;
            return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);
          }
          function insertIntoBST(root, val) {
            if (!root) return new TreeNode(val);
            if (val < root.val) root.left = insertIntoBST(root.left, val);
            else root.right = insertIntoBST(root.right, val);
            return root;
          }
        `,
      },
    ],
    explanation: 'Inorder traversal of a BST is sorted — useful to sanity-check after insert/delete.',
    fn: 'insertIntoBST',
    input: tree,
    output: level,
    tests: [
      { args: [[4, 2, 7, 1, 3], 5], expected: [4, 2, 7, 1, 3, 5] },
      { args: [[], 5], expected: [5] },
    ],
  },
  {
    id: 'delete-node-bst',
    title: 'Delete Node in a BST',
    difficulty: 'Medium',
    lc: 'delete-node-in-a-bst',
    from: 'Lec 16 – BBST & Trees 2 (class question 3)',
    tags: ['bst'],
    statement: 'Delete the node with value `key` and return the root.',
    approaches: [
      {
        name: 'Three cases with inorder successor',
        time: 'O(h)',
        space: 'O(h)',
        idea: `
          1. **No child** → return null. 2. **One child** → return that child.
          3. **Two children** → copy the **inorder successor** (min of right subtree) into the node, then delete the successor from the right subtree. (The predecessor — max of left subtree — works too.)
        `,
        code: `
          function deleteNode(root, key) {
            if (!root) return null;
            if (key < root.val) root.left = deleteNode(root.left, key);
            else if (key > root.val) root.right = deleteNode(root.right, key);
            else {
              if (!root.left) return root.right;
              if (!root.right) return root.left;
              let succ = root.right;
              while (succ.left) succ = succ.left;
              root.val = succ.val;
              root.right = deleteNode(root.right, succ.val);
            }
            return root;
          }
        `,
      },
    ],
    fn: 'deleteNode',
    input: tree,
    output: level,
    tests: [
      { args: [[5, 3, 6, 2, 4, null, 7], 3], expected: [5, 4, 6, 2, null, null, 7] },
      { args: [[5, 3, 6, 2, 4, null, 7], 0], expected: [5, 3, 6, 2, 4, null, 7] },
      { args: [[5], 5], expected: [] },
    ],
  },
  {
    id: 'convert-bst-greater-tree',
    title: 'Convert BST to Greater Tree',
    difficulty: 'Medium',
    lc: 'convert-bst-to-greater-tree',
    from: 'Lec 16 – BBST & Trees 2 (class question 5)',
    tags: ['bst', 'reverse-inorder'],
    statement: 'Replace every key with itself plus the sum of all keys greater than it.',
    approaches: [
      {
        name: 'Reverse inorder (R, N, L) with running sum',
        time: 'O(n)',
        space: 'O(h)',
        idea: 'Reverse inorder visits keys in **descending** order, so a running sum is exactly “sum of keys ≥ current”.',
        code: `
          function convertBST(root) {
            let sum = 0;
            const go = (n) => {
              if (!n) return;
              go(n.right);
              sum += n.val;
              n.val = sum;
              go(n.left);
            };
            go(root);
            return root;
          }
        `,
      },
    ],
    fn: 'convertBST',
    input: tree,
    output: level,
    tests: [
      { args: [[4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8]], expected: [30, 36, 21, 36, 35, 26, 15, null, null, null, 33, null, null, null, 8] },
      { args: [[0, null, 1]], expected: [1, null, 1] },
    ],
  },
  {
    id: 'recover-bst',
    title: 'Recover Binary Search Tree (two swapped nodes)',
    difficulty: 'Medium',
    lc: 'recover-binary-search-tree',
    from: 'Lec 16 – BBST & Trees 2 (class question 6)',
    tags: ['bst', 'inorder'],
    statement: 'Exactly two nodes of a BST were swapped. Fix the tree without changing its structure.',
    approaches: [
      {
        name: 'Inorder with prev / first / second',
        time: 'O(n)',
        space: 'O(h)',
        idea: 'Inorder should be increasing. At the first drop (`prev > curr`) set `first = prev`; at every drop set `second = curr`. Handles adjacent swaps (one drop) and distant swaps (two drops). Swap their values.',
        code: `
          function recoverTree(root) {
            let prev = null, first = null, second = null;
            const inorder = (n) => {
              if (!n) return;
              inorder(n.left);
              if (prev && prev.val > n.val) {
                if (!first) first = prev;
                second = n;
              }
              prev = n;
              inorder(n.right);
            };
            inorder(root);
            [first.val, second.val] = [second.val, first.val];
            return root;
          }
        `,
      },
    ],
    explanation: 'Morris traversal makes this O(1) space — a good follow-up to mention.',
    fn: 'recoverTree',
    input: tree,
    output: level,
    tests: [
      { args: [[1, 3, null, null, 2]], expected: [3, 1, null, null, 2] },
      { args: [[3, 1, 4, null, null, 2]], expected: [2, 1, 4, null, null, 3] },
    ],
  },
];

export const triesExtra = [
  {
    id: 'counting-words-prefix',
    title: 'Counting Words With a Given Prefix',
    difficulty: 'Easy',
    lc: 'counting-words-with-a-given-prefix',
    from: 'Lec 17 – Tries (class question 2)',
    tags: ['trie', 'prefix-count'],
    statement: 'Return how many words in `words` start with `pref`.',
    approaches: [
      {
        name: 'startsWith on each word',
        time: 'O(n · |pref|)',
        space: 'O(1)',
        code: `
          function prefixCount(words, pref) {
            return words.filter((w) => w.startsWith(pref)).length;
          }
        `,
      },
      {
        name: 'Trie with count per node',
        time: 'O(N·L) build, O(|pref|) per query',
        space: 'O(N·L)',
        idea: 'Increment `count` on every node a word passes through; the answer is the count at the prefix’s last node. Pays off when you answer many prefix queries.',
        code: `
          function prefixCount(words, pref) {
            const root = { children: {}, count: 0 };
            for (const w of words) {
              let curr = root;
              for (const ch of w) {
                curr = curr.children[ch] || (curr.children[ch] = { children: {}, count: 0 });
                curr.count++;
              }
            }
            let curr = root;
            for (const ch of pref) {
              curr = curr.children[ch];
              if (!curr) return 0;
            }
            return curr.count;
          }
        `,
      },
    ],
    fn: 'prefixCount',
    tests: [
      { args: [['pay', 'attention', 'practice', 'attend'], 'at'], expected: 2 },
      { args: [['leetcode', 'win', 'loops', 'success'], 'code'], expected: 0 },
    ],
  },
  {
    id: 'add-search-words',
    title: 'Design Add and Search Words (with `.` wildcard)',
    difficulty: 'Medium',
    lc: 'design-add-and-search-words-data-structure',
    from: 'Lec 17 – Tries (class question 3)',
    tags: ['trie', 'dfs', 'design'],
    statement: '`addWord(word)` and `search(word)` where `.` matches any single letter.',
    approaches: [
      {
        name: 'Trie + DFS on wildcard',
        time: 'add O(L); search O(L) without dots, O(26^dots · L) worst',
        space: 'O(total chars)',
        idea: 'Normal letters follow one child; `.` tries every child (the instructor’s DFS(prefix, index, node)).',
        code: `
          class WordDictionary {
            constructor() { this.root = { kids: {}, end: false }; }
            addWord(word) {
              let n = this.root;
              for (const ch of word) n = n.kids[ch] || (n.kids[ch] = { kids: {}, end: false });
              n.end = true;
            }
            search(word) {
              const dfs = (i, node) => {
                if (i === word.length) return node.end;
                const ch = word[i];
                if (ch !== '.') return !!node.kids[ch] && dfs(i + 1, node.kids[ch]);
                return Object.values(node.kids).some((child) => dfs(i + 1, child));
              };
              return dfs(0, this.root);
            }
          }
        `,
      },
    ],
    kind: 'class',
    fn: 'WordDictionary',
    tests: [
      {
        ops: ['WordDictionary', 'addWord', 'addWord', 'addWord', 'search', 'search', 'search', 'search'],
        args: [[], ['bad'], ['dad'], ['mad'], ['pad'], ['bad'], ['.ad'], ['b..']],
        expected: [null, null, null, null, false, true, true, true],
      },
    ],
  },
  {
    id: 'replace-words',
    title: 'Replace Words (shortest root)',
    difficulty: 'Medium',
    lc: 'replace-words',
    from: 'Lec 17 – Tries (class question 4)',
    tags: ['trie'],
    statement: 'Replace every word in `sentence` with the shortest dictionary root that is its prefix.\n\n**Example:** `["cat","bat","rat"]`, `"the cattle was rattled by the battery"` → `"the cat was rat by the bat"`',
    approaches: [
      {
        name: 'Trie of roots, stop at first end',
        time: 'O(Σ roots + Σ sentence)',
        space: 'O(Σ roots)',
        code: `
          function replaceWords(dictionary, sentence) {
            const root = {};
            for (const w of dictionary) {
              let n = root;
              for (const ch of w) n = n[ch] || (n[ch] = {});
              n.end = true;
            }
            const findRoot = (word) => {
              let n = root;
              for (let i = 0; i < word.length; i++) {
                n = n[word[i]];
                if (!n) return word;
                if (n.end) return word.slice(0, i + 1);
              }
              return word;
            };
            return sentence.split(' ').map(findRoot).join(' ');
          }
        `,
      },
    ],
    fn: 'replaceWords',
    tests: [
      { args: [['cat', 'bat', 'rat'], 'the cattle was rattled by the battery'], expected: 'the cat was rat by the bat' },
      { args: [['a', 'b', 'c'], 'aadsfasf absbs bbab cadsfafs'], expected: 'a a b c' },
    ],
  },
];

export const heapsExtra = [
  {
    id: 'implement-max-heap',
    title: 'Implement a Max-Heap (insert, extractMax, build in O(n))',
    difficulty: 'Medium',
    from: 'Lec 18 – Heaps 1 & 2',
    tags: ['heap', 'design'],
    statement: 'Build a max-heap over an array with `insert(x)`, `extractMax()`, `peek()`, `size()`, and a constructor that heapifies an initial array in O(n) (Floyd’s algorithm).',
    approaches: [
      {
        name: 'Array-backed binary heap',
        time: 'insert / extractMax O(log n), build O(n)',
        space: 'O(n)',
        idea: `
          Complete binary tree in an array: children of i are \`2i+1\`, \`2i+2\`, parent is \`⌊(i−1)/2⌋\`.
          **insert**: append, then *heapify up* (swap with parent while bigger).
          **extractMax**: take root, move the last element to the root, *heapify down* (swap with the larger child).
          **Floyd’s build**: heapify-down every internal node from \`n/2 − 1\` down to 0 — O(n) because most nodes are near the leaves.
        `,
        code: `
          class MaxHeap {
            constructor(input = []) {
              this.h = [...input];
              for (let i = (this.h.length >> 1) - 1; i >= 0; i--) this._down(i);
            }
            size() { return this.h.length; }
            peek() { return this.h.length ? this.h[0] : -1; }
            insert(x) {
              const h = this.h;
              h.push(x);
              let i = h.length - 1;
              while (i > 0) {
                const p = (i - 1) >> 1;
                if (h[p] >= h[i]) break;
                [h[p], h[i]] = [h[i], h[p]];
                i = p;
              }
            }
            extractMax() {
              const h = this.h;
              if (!h.length) return -1;
              const max = h[0], last = h.pop();
              if (h.length) { h[0] = last; this._down(0); }
              return max;
            }
            _down(i) {
              const h = this.h;
              while (true) {
                const l = 2 * i + 1, r = l + 1;
                let big = i;
                if (l < h.length && h[l] > h[big]) big = l;
                if (r < h.length && h[r] > h[big]) big = r;
                if (big === i) return;
                [h[i], h[big]] = [h[big], h[i]];
                i = big;
              }
            }
          }
        `,
      },
    ],
    explanation: 'Java has `PriorityQueue`, Python `heapq`, C++ `priority_queue` — JavaScript has none, which is exactly why this class came up. Heap sort = build max-heap, then repeatedly swap the root to the end and heapify-down the shrunken heap (see Sorting → Radix & Heap Sort).',
    kind: 'class',
    fn: 'MaxHeap',
    tests: [
      {
        ops: ['MaxHeap', 'insert', 'insert', 'peek', 'extractMax', 'extractMax', 'extractMax', 'extractMax', 'size'],
        args: [[[1, 7, 9, 2, 8, 3]], [10], [4], [], [], [], [], [], []],
        expected: [null, null, null, 10, 10, 9, 8, 7, 4],
      },
    ],
  },
  {
    id: 'last-stone-weight',
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    lc: 'last-stone-weight',
    from: 'Lec 18 – Heaps 1 & 2 (class question 1)',
    tags: ['heap', 'simulation'],
    statement: 'Repeatedly smash the two heaviest stones: equal → both destroyed, else the difference remains. Return the last weight (0 if none).',
    approaches: [
      {
        name: 'Sort every round',
        time: 'O(n² log n)',
        space: 'O(1)',
        code: `
          function lastStoneWeight(stones) {
            const s = [...stones];
            while (s.length > 1) {
              s.sort((a, b) => a - b);
              const y = s.pop(), x = s.pop();
              if (x !== y) s.push(y - x);
            }
            return s[0] || 0;
          }
        `,
      },
      {
        name: 'Max-heap',
        time: 'O(n log n)',
        space: 'O(n)',
        code: `
          function lastStoneWeight(stones) {
            const h = [];
            const push = (x) => { h.push(x); let i = h.length - 1; while (i && h[(i - 1) >> 1] < h[i]) { [h[i], h[(i - 1) >> 1]] = [h[(i - 1) >> 1], h[i]]; i = (i - 1) >> 1; } };
            const pop = () => {
              const top = h[0], last = h.pop();
              if (h.length) {
                h[0] = last;
                for (let i = 0; ; ) {
                  const l = 2 * i + 1, r = l + 1;
                  let m = i;
                  if (l < h.length && h[l] > h[m]) m = l;
                  if (r < h.length && h[r] > h[m]) m = r;
                  if (m === i) break;
                  [h[i], h[m]] = [h[m], h[i]];
                  i = m;
                }
              }
              return top;
            };
            stones.forEach(push);
            while (h.length > 1) {
              const y = pop(), x = pop();
              if (x !== y) push(y - x);
            }
            return h.length ? h[0] : 0;
          }
        `,
      },
    ],
    fn: 'lastStoneWeight',
    tests: [
      { args: [[2, 7, 4, 1, 8, 1]], expected: 1 },
      { args: [[1]], expected: 1 },
      { args: [[2, 2]], expected: 0 },
    ],
  },
];
