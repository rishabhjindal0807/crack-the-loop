export default {
  id: 'backtracking',
  title: 'Backtracking',
  icon: '♟️',
  source: 'notes',
  lecture: 'Lec 8',
  blurb: 'Choose → explore → un-choose. N-Queens, Rat in a Maze, combinations, Gray code, palindrome partitioning, parentheses.',
  concepts: `
    **Template**
    \`\`\`js
    function backtrack(state) {
      if (isComplete(state)) { record(state); return; }
      for (const choice of choices(state)) {
        if (!isValid(state, choice)) continue; // prune early
        make(choice);
        backtrack(state);
        undo(choice);                          // restore for the next sibling
      }
    }
    \`\`\`
    - **Pruning** is what makes backtracking fast in practice — check constraints *before* recursing.
    - Use **O(1) validity checks**: N-Queens keeps sets for columns, \`r − c\` diagonals and \`r + c\` anti-diagonals.
    - Mark visited cells on the way in and **unmark on the way out** (Rat in a Maze, Word Search).
    - Push copies (\`[...path]\`) into results — \`path\` keeps mutating.
    - Output-sensitive problems (all permutations, all partitions) are exponential by nature; say so up front.
  `,
  questions: [
    {
      id: 'n-queens',
      title: 'N-Queens',
      difficulty: 'Hard',
      lc: 'n-queens',
      from: 'Lec 8 – Backtracking',
      tags: ['backtracking'],
      statement: 'Return all distinct boards placing `n` queens so none attack each other. Each board is an array of strings using `Q` and `.`.',
      approaches: [
        {
          name: 'Row by row with column/diagonal sets',
          time: 'O(n!)',
          space: 'O(n)',
          idea: 'Place exactly one queen per row. A square (r, c) is safe iff column c, diagonal `r − c` and anti-diagonal `r + c` are unused.',
          code: `
            function solveNQueens(n) {
              const out = [], queens = [];
              const cols = new Set(), diag = new Set(), anti = new Set();
              const go = (r) => {
                if (r === n) {
                  out.push(queens.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(n - c - 1)));
                  return;
                }
                for (let c = 0; c < n; c++) {
                  if (cols.has(c) || diag.has(r - c) || anti.has(r + c)) continue;
                  cols.add(c); diag.add(r - c); anti.add(r + c); queens.push(c);
                  go(r + 1);
                  cols.delete(c); diag.delete(r - c); anti.delete(r + c); queens.pop();
                }
              };
              go(0);
              return out;
            }
          `,
        },
      ],
      explanation: 'Follow-up: N-Queens II asks only for the count — same code, increment a counter. With bitmasks instead of sets it becomes very fast.',
      fn: 'solveNQueens',
      compare: 'unordered',
      tests: [
        { args: [4], expected: [['.Q..', '...Q', 'Q...', '..Q.'], ['..Q.', 'Q...', '...Q', '.Q..']] },
        { args: [1], expected: [['Q']] },
        { args: [3], expected: [] },
      ],
    },
    {
      id: 'rat-in-maze',
      title: 'Rat in a Maze (all paths, U/D/L/R)',
      difficulty: 'Medium',
      lc: 'https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1',
      from: 'Lec 8 – Backtracking',
      tags: ['backtracking', 'grid'],
      statement: 'In an n×n grid (1 = open, 0 = blocked) find all paths from (0,0) to (n−1,n−1) moving U/D/L/R without revisiting a cell. Return them sorted.',
      approaches: [
        {
          name: 'DFS with visited marking',
          time: 'O(4^(n²)) worst',
          space: 'O(n²)',
          idea: 'Try directions in lexicographic order D, L, R, U so results come out sorted. Mark the cell on entry, unmark on exit.',
          code: `
            function findPaths(grid) {
              const n = grid.length, out = [];
              if (grid[0][0] === 0 || grid[n - 1][n - 1] === 0) return out;
              const dirs = [['D', 1, 0], ['L', 0, -1], ['R', 0, 1], ['U', -1, 0]];
              const seen = grid.map((row) => row.map(() => false));
              const go = (r, c, path) => {
                if (r === n - 1 && c === n - 1) return out.push(path);
                seen[r][c] = true;
                for (const [d, dr, dc] of dirs) {
                  const nr = r + dr, nc = c + dc;
                  if (nr >= 0 && nc >= 0 && nr < n && nc < n && grid[nr][nc] === 1 && !seen[nr][nc]) go(nr, nc, path + d);
                }
                seen[r][c] = false;
              };
              go(0, 0, '');
              return out;
            }
          `,
        },
      ],
      fn: 'findPaths',
      tests: [
        { args: [[[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]]], expected: ['DDRDRR', 'DRDDRR'] },
        { args: [[[1, 0], [1, 0]]], expected: [] },
      ],
    },
    {
      id: 'combinations',
      title: 'Combinations of r Elements (n choose r)',
      difficulty: 'Medium',
      lc: 'combinations',
      from: 'Lec 8 – Backtracking',
      tags: ['backtracking'],
      statement: 'Return all combinations of `k` numbers chosen from `1..n`.',
      approaches: [
        {
          name: 'Backtracking with pruning',
          time: 'O(k · C(n,k))',
          space: 'O(k)',
          idea: 'Stop the loop early when not enough numbers remain: `i ≤ n − (k − path.length) + 1`.',
          code: `
            function combine(n, k) {
              const out = [], path = [];
              const go = (start) => {
                if (path.length === k) return out.push([...path]);
                for (let i = start; i <= n - (k - path.length) + 1; i++) {
                  path.push(i);
                  go(i + 1);
                  path.pop();
                }
              };
              go(1);
              return out;
            }
          `,
        },
      ],
      fn: 'combine',
      compare: 'unordered',
      tests: [
        { args: [4, 2], expected: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]] },
        { args: [1, 1], expected: [[1]] },
      ],
    },
    {
      id: 'gray-code',
      title: 'Gray Code',
      difficulty: 'Medium',
      lc: 'gray-code',
      from: 'Lec 8 – Backtracking',
      tags: ['bits', 'recursion'],
      statement: 'Return any n-bit Gray code sequence starting at 0: 2ⁿ integers where consecutive values (and the last/first) differ in exactly one bit.',
      approaches: [
        {
          name: 'Reflect and prefix',
          time: 'O(2ⁿ)',
          space: 'O(2ⁿ)',
          idea: 'Gray(n) = Gray(n−1) followed by Gray(n−1) reversed with the top bit set.',
          code: `
            function grayCode(n) {
              let res = [0];
              for (let b = 0; b < n; b++) {
                const top = 1 << b;
                for (let i = res.length - 1; i >= 0; i--) res.push(res[i] | top);
              }
              return res;
            }
          `,
        },
        {
          name: 'Formula i ^ (i >> 1)',
          time: 'O(2ⁿ)',
          space: 'O(2ⁿ)',
          code: `
            function grayCode(n) {
              return Array.from({ length: 1 << n }, (_, i) => i ^ (i >> 1));
            }
          `,
        },
      ],
      fn: 'grayCode',
      check: (got, [n]) => {
        if (got.length !== 1 << n || got[0] !== 0 || new Set(got).size !== got.length) return false;
        const oneBit = (x) => x && (x & (x - 1)) === 0;
        return got.every((v, i) => (n === 0 ? true : oneBit(v ^ got[(i + 1) % got.length])));
      },
      tests: [{ args: [2] }, { args: [3] }, { args: [1] }],
    },
    {
      id: 'palindrome-partitioning',
      title: 'Palindrome Partitioning',
      difficulty: 'Medium',
      lc: 'palindrome-partitioning',
      from: 'Lec 8 – Backtracking',
      tags: ['backtracking', 'strings'],
      statement: 'Partition `s` so every substring is a palindrome. Return all possible partitions.',
      approaches: [
        {
          name: 'Cut at every palindromic prefix',
          time: 'O(n · 2ⁿ)',
          space: 'O(n)',
          code: `
            function partition(s) {
              const out = [], path = [];
              const isPal = (l, r) => {
                while (l < r) if (s[l++] !== s[r--]) return false;
                return true;
              };
              const go = (start) => {
                if (start === s.length) return out.push([...path]);
                for (let end = start; end < s.length; end++) {
                  if (!isPal(start, end)) continue;
                  path.push(s.slice(start, end + 1));
                  go(end + 1);
                  path.pop();
                }
              };
              go(0);
              return out;
            }
          `,
        },
      ],
      explanation: 'Optimisation: precompute `isPal[i][j]` with DP (`s[i] === s[j] && isPal[i+1][j-1]`) to make each check O(1).',
      fn: 'partition',
      compare: 'unordered',
      tests: [
        { args: ['aab'], expected: [['a', 'a', 'b'], ['aa', 'b']] },
        { args: ['a'], expected: [['a']] },
      ],
    },
    {
      id: 'generate-parentheses',
      title: 'Generate Parentheses',
      difficulty: 'Medium',
      lc: 'generate-parentheses',
      from: 'Lec 8 – Backtracking',
      tags: ['backtracking'],
      statement: 'Return all well-formed strings of `n` pairs of parentheses.',
      approaches: [
        {
          name: 'Track open / close counts',
          time: 'O(4ⁿ / √n)',
          space: 'O(n)',
          idea: 'Add `(` while `open < n`; add `)` only while `close < open` — invalid strings are never built.',
          code: `
            function generateParenthesis(n) {
              const out = [];
              const go = (s, open, close) => {
                if (s.length === 2 * n) return out.push(s);
                if (open < n) go(s + '(', open + 1, close);
                if (close < open) go(s + ')', open, close + 1);
              };
              go('', 0, 0);
              return out;
            }
          `,
        },
      ],
      explanation: 'The count is the n-th Catalan number: 1, 1, 2, 5, 14, 42…',
      fn: 'generateParenthesis',
      compare: 'unordered',
      tests: [
        { args: [3], expected: ['((()))', '(()())', '(())()', '()(())', '()()()'] },
        { args: [1], expected: ['()'] },
      ],
    },
    {
      id: 'word-search',
      title: 'Word Search',
      difficulty: 'Medium',
      lc: 'word-search',
      tags: ['backtracking', 'grid'],
      statement: 'Return true if `word` can be formed from sequentially adjacent (4-directional) cells, each used once.',
      approaches: [
        {
          name: 'DFS from each cell',
          time: 'O(m·n·4^L)',
          space: 'O(L)',
          idea: 'Temporarily overwrite the cell with `#` to mark it visited, restore after.',
          code: `
            function exist(board, word) {
              const m = board.length, n = board[0].length;
              const dfs = (r, c, k) => {
                if (k === word.length) return true;
                if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[k]) return false;
                const ch = board[r][c];
                board[r][c] = '#';
                const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);
                board[r][c] = ch;
                return found;
              };
              for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) if (dfs(r, c, 0)) return true;
              return false;
            }
          `,
        },
      ],
      fn: 'exist',
      tests: [
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCCED'], expected: true },
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'SEE'], expected: true },
        { args: [[['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']], 'ABCB'], expected: false },
      ],
    },
    {
      id: 'sudoku-solver',
      title: 'Sudoku Solver',
      difficulty: 'Hard',
      lc: 'sudoku-solver',
      tags: ['backtracking'],
      statement: 'Fill a 9×9 Sudoku board in place (`.` = empty). Return the solved board.',
      approaches: [
        {
          name: 'Backtracking with row/col/box bitmasks',
          time: 'O(9^empty) worst, fast in practice',
          space: 'O(81)',
          idea: 'Keep a 9-bit mask per row, column and 3×3 box. Box index = `⌊r/3⌋·3 + ⌊c/3⌋`.',
          code: `
            function solveSudoku(board) {
              const rows = new Array(9).fill(0), cols = new Array(9).fill(0), boxes = new Array(9).fill(0);
              const empty = [];
              for (let r = 0; r < 9; r++)
                for (let c = 0; c < 9; c++) {
                  if (board[r][c] === '.') { empty.push([r, c]); continue; }
                  const bit = 1 << (board[r][c] - 1), b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                  rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
                }
              const go = (k) => {
                if (k === empty.length) return true;
                const [r, c] = empty[k], b = Math.floor(r / 3) * 3 + Math.floor(c / 3);
                for (let d = 1; d <= 9; d++) {
                  const bit = 1 << (d - 1);
                  if ((rows[r] | cols[c] | boxes[b]) & bit) continue;
                  rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit; board[r][c] = String(d);
                  if (go(k + 1)) return true;
                  rows[r] ^= bit; cols[c] ^= bit; boxes[b] ^= bit; board[r][c] = '.';
                }
                return false;
              };
              go(0);
              return board;
            }
          `,
        },
      ],
      fn: 'solveSudoku',
      tests: [
        {
          args: [[
            ['5', '3', '.', '.', '7', '.', '.', '.', '.'], ['6', '.', '.', '1', '9', '5', '.', '.', '.'], ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
            ['8', '.', '.', '.', '6', '.', '.', '.', '3'], ['4', '.', '.', '8', '.', '3', '.', '.', '1'], ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
            ['.', '6', '.', '.', '.', '.', '2', '8', '.'], ['.', '.', '.', '4', '1', '9', '.', '.', '5'], ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
          ]],
          expected: [
            ['5', '3', '4', '6', '7', '8', '9', '1', '2'], ['6', '7', '2', '1', '9', '5', '3', '4', '8'], ['1', '9', '8', '3', '4', '2', '5', '6', '7'],
            ['8', '5', '9', '7', '6', '1', '4', '2', '3'], ['4', '2', '6', '8', '5', '3', '7', '9', '1'], ['7', '1', '3', '9', '2', '4', '8', '5', '6'],
            ['9', '6', '1', '5', '3', '7', '2', '8', '4'], ['2', '8', '7', '4', '1', '9', '6', '3', '5'], ['3', '4', '5', '2', '8', '6', '1', '7', '9'],
          ],
        },
      ],
    },
  ],
};
