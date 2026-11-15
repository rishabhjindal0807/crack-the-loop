export default {
  id: 'tries',
  title: 'Tries',
  icon: '🌲',
  source: 'curriculum',
  blurb: 'Prefix trees for autocomplete, word search and XOR maximisation.',
  concepts: `
    - A **trie** stores strings character by character; each node has children + an \`end\` flag.
    - insert / search / startsWith are **O(L)** — independent of how many words are stored.
    - Use cases: autocomplete (a UI favourite — debounce input, query a trie or backend prefix index), spell check, IP routing, Word Search II.
    - **Binary trie** over bits (MSB first) solves “maximum XOR of two numbers” in O(32·n).
    - Memory heavy: a node per character. Compress single-child chains (radix tree) if asked.
  `,
  questions: [
    {
      id: 'implement-trie',
      title: 'Implement Trie (Prefix Tree)',
      difficulty: 'Medium',
      lc: 'implement-trie-prefix-tree',
      tags: ['trie', 'design'],
      statement: 'Implement `insert`, `search` and `startsWith`.',
      approaches: [
        {
          name: 'Object children',
          time: 'O(L) per op',
          space: 'O(total chars)',
          code: `
            class Trie {
              constructor() { this.root = {}; }
              insert(word) {
                let node = this.root;
                for (const c of word) node = node[c] || (node[c] = {});
                node.end = true;
              }
              _walk(s) {
                let node = this.root;
                for (const c of s) {
                  node = node[c];
                  if (!node) return null;
                }
                return node;
              }
              search(word) { return Boolean(this._walk(word)?.end); }
              startsWith(prefix) { return this._walk(prefix) !== null; }
            }
          `,
        },
      ],
      kind: 'class',
      fn: 'Trie',
      tests: [
        {
          ops: ['Trie', 'insert', 'search', 'search', 'startsWith', 'insert', 'search'],
          args: [[], ['apple'], ['apple'], ['app'], ['app'], ['app'], ['app']],
          expected: [null, null, true, false, true, null, true],
        },
      ],
    },
    {
      id: 'autocomplete',
      title: 'Search Suggestions System (autocomplete)',
      difficulty: 'Medium',
      lc: 'search-suggestions-system',
      tags: ['trie', 'autocomplete'],
      statement: 'After each typed character of `searchWord`, return up to 3 lexicographically smallest products with that prefix.',
      approaches: [
        {
          name: 'Trie with top-3 per node',
          time: 'O(Σ len + L)',
          space: 'O(Σ len)',
          idea: 'Sort products first, then each trie node keeps the first 3 words that pass through it.',
          code: `
            function suggestedProducts(products, searchWord) {
              const root = { kids: {}, top: [] };
              for (const p of [...products].sort()) {
                let node = root;
                for (const c of p) {
                  node = node.kids[c] || (node.kids[c] = { kids: {}, top: [] });
                  if (node.top.length < 3) node.top.push(p);
                }
              }
              const out = [];
              let node = root;
              for (const c of searchWord) {
                node = node && node.kids[c];
                out.push(node ? node.top : []);
              }
              return out;
            }
          `,
        },
        {
          name: 'Sort + binary search',
          time: 'O(n log n + L log n)',
          space: 'O(1) extra',
          idea: 'In a sorted list, all words with a prefix are contiguous — lower-bound the prefix and take 3.',
          code: `
            function suggestedProducts(products, searchWord) {
              const a = [...products].sort(), out = [];
              let prefix = '';
              for (const c of searchWord) {
                prefix += c;
                let lo = 0, hi = a.length;
                while (lo < hi) {
                  const mid = (lo + hi) >> 1;
                  if (a[mid] < prefix) lo = mid + 1;
                  else hi = mid;
                }
                out.push(a.slice(lo, lo + 3).filter((w) => w.startsWith(prefix)));
              }
              return out;
            }
          `,
        },
      ],
      explanation: 'Natural follow-up for a frontend lead: how would you build the typeahead UI? (debounce, cancel stale requests with AbortController, cache prefixes, keyboard navigation + ARIA combobox). See the UI section.',
      fn: 'suggestedProducts',
      tests: [
        {
          args: [['mobile', 'mouse', 'moneypot', 'monitor', 'mousepad'], 'mouse'],
          expected: [['mobile', 'moneypot', 'monitor'], ['mobile', 'moneypot', 'monitor'], ['mouse', 'mousepad'], ['mouse', 'mousepad'], ['mouse', 'mousepad']],
        },
        { args: [['havana'], 'tatiana'], expected: [[], [], [], [], [], [], []] },
      ],
    },
    {
      id: 'word-search-ii',
      title: 'Word Search II',
      difficulty: 'Hard',
      lc: 'word-search-ii',
      tags: ['trie', 'backtracking'],
      statement: 'Return all words from `words` that can be formed on the board (adjacent cells, each used once per word).',
      approaches: [
        {
          name: 'Trie-guided DFS',
          time: 'O(m·n·4^L)',
          space: 'O(Σ len)',
          idea: 'Build a trie of the words; DFS the board following trie edges so impossible prefixes are pruned immediately. Store the word at its end node and null it after finding to avoid duplicates.',
          code: `
            function findWords(board, words) {
              const root = {};
              for (const w of words) {
                let n = root;
                for (const c of w) n = n[c] || (n[c] = {});
                n.word = w;
              }
              const m = board.length, n = board[0].length, out = [];
              const dfs = (r, c, node) => {
                const ch = board[r][c], next = node[ch];
                if (!next) return;
                if (next.word) { out.push(next.word); next.word = null; }
                board[r][c] = '#';
                for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
                  const x = r + dr, y = c + dc;
                  if (x >= 0 && y >= 0 && x < m && y < n && board[x][y] !== '#') dfs(x, y, next);
                }
                board[r][c] = ch;
              };
              for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) dfs(r, c, root);
              return out;
            }
          `,
        },
      ],
      fn: 'findWords',
      compare: 'unordered',
      tests: [
        { args: [[['o', 'a', 'a', 'n'], ['e', 't', 'a', 'e'], ['i', 'h', 'k', 'r'], ['i', 'f', 'l', 'v']], ['oath', 'pea', 'eat', 'rain']], expected: ['eat', 'oath'] },
        { args: [[['a', 'b'], ['c', 'd']], ['abcb']], expected: [] },
      ],
    },
    {
      id: 'max-xor',
      title: 'Maximum XOR of Two Numbers in an Array',
      difficulty: 'Medium',
      lc: 'maximum-xor-of-two-numbers-in-an-array',
      tags: ['binary-trie', 'bits'],
      statement: 'Return the maximum `nums[i] XOR nums[j]`.',
      approaches: [
        {
          name: 'Binary trie, greedy opposite bit',
          time: 'O(31·n)',
          space: 'O(31·n)',
          idea: 'Insert each number MSB→LSB. For each number, walk the trie preferring the **opposite** bit at each level — that sets the highest possible XOR bits.',
          code: `
            function findMaximumXOR(nums) {
              const root = {};
              let best = 0;
              for (const x of nums) {
                let node = root;
                for (let b = 30; b >= 0; b--) {
                  const bit = (x >> b) & 1;
                  node = node[bit] || (node[bit] = {});
                }
                node = root;
                let cur = 0;
                for (let b = 30; b >= 0; b--) {
                  const bit = (x >> b) & 1, want = bit ^ 1;
                  if (node[want]) { cur |= 1 << b; node = node[want]; }
                  else node = node[bit];
                }
                best = Math.max(best, cur);
              }
              return best;
            }
          `,
        },
      ],
      fn: 'findMaximumXOR',
      tests: [
        { args: [[3, 10, 5, 25, 2, 8]], expected: 28 },
        { args: [[14, 70, 53, 83, 49, 91, 36, 80, 92, 51, 66, 70]], expected: 127 },
      ],
    },
  ],
};
