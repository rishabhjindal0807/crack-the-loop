export default {
  id: 'stack-queue',
  title: 'Stack & Queue',
  icon: '📚',
  source: 'curriculum',
  blurb: 'Matching brackets, monotonic stacks (next greater, histogram), min stack, queue via stacks.',
  concepts: `
    - **Stack (LIFO):** JS array \`push\`/\`pop\` are O(1). Use for nesting, undo, DFS, “most recent unmatched”.
    - **Queue (FIFO):** \`shift()\` is O(n) in JS — use a head index or two stacks for O(1) amortised.
    - **Monotonic stack:** keep the stack increasing/decreasing; each element is pushed and popped once ⇒ O(n). Solves *next greater element*, *daily temperatures*, *largest rectangle in histogram*, *stock span*.
    - **Expression evaluation:** stack of operands/operators, or RPN.
  `,
  questions: [
    {
      id: 'valid-parentheses',
      title: 'Valid Parentheses',
      difficulty: 'Easy',
      lc: 'valid-parentheses',
      tags: ['stack'],
      statement: 'Return true if every bracket in `s` (`()[]{}`) is closed in the right order.',
      approaches: [
        {
          name: 'Stack of expected closers',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function isValid(s) {
              const pair = { ')': '(', ']': '[', '}': '{' };
              const stack = [];
              for (const c of s) {
                if (c in pair) {
                  if (stack.pop() !== pair[c]) return false;
                } else stack.push(c);
              }
              return stack.length === 0;
            }
          `,
        },
      ],
      fn: 'isValid',
      tests: [
        { args: ['()[]{}'], expected: true },
        { args: ['(]'], expected: false },
        { args: ['([)]'], expected: false },
        { args: ['{[]}'], expected: true },
        { args: ['('], expected: false },
      ],
    },
    {
      id: 'min-stack',
      title: 'Min Stack',
      difficulty: 'Medium',
      lc: 'min-stack',
      tags: ['design', 'stack'],
      statement: 'Design a stack with `push`, `pop`, `top` and `getMin` — all O(1).',
      approaches: [
        {
          name: 'Store running min with each entry',
          time: 'O(1) per op',
          space: 'O(n)',
          code: `
            class MinStack {
              constructor() { this.s = []; }
              push(val) {
                const min = this.s.length ? Math.min(val, this.s[this.s.length - 1][1]) : val;
                this.s.push([val, min]);
              }
              pop() { this.s.pop(); }
              top() { return this.s[this.s.length - 1][0]; }
              getMin() { return this.s[this.s.length - 1][1]; }
            }
          `,
        },
      ],
      kind: 'class',
      fn: 'MinStack',
      tests: [
        {
          ops: ['MinStack', 'push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
          args: [[], [-2], [0], [-3], [], [], [], []],
          expected: [null, null, null, null, -3, null, 0, -2],
        },
      ],
    },
    {
      id: 'daily-temperatures',
      title: 'Daily Temperatures (next greater element)',
      difficulty: 'Medium',
      lc: 'daily-temperatures',
      tags: ['monotonic-stack'],
      statement: 'For each day, how many days until a warmer temperature? 0 if never.',
      approaches: [
        {
          name: 'Decreasing stack of indices',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'When today is warmer than the day on top of the stack, today is that day’s answer — pop and record.',
          code: `
            function dailyTemperatures(t) {
              const ans = new Array(t.length).fill(0), stack = [];
              for (let i = 0; i < t.length; i++) {
                while (stack.length && t[stack[stack.length - 1]] < t[i]) {
                  const j = stack.pop();
                  ans[j] = i - j;
                }
                stack.push(i);
              }
              return ans;
            }
          `,
        },
      ],
      fn: 'dailyTemperatures',
      tests: [
        { args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
        { args: [[30, 60, 90]], expected: [1, 1, 0] },
      ],
    },
    {
      id: 'largest-rectangle-histogram',
      title: 'Largest Rectangle in Histogram',
      difficulty: 'Hard',
      lc: 'largest-rectangle-in-histogram',
      tags: ['monotonic-stack'],
      statement: 'Return the area of the largest rectangle in a histogram.',
      approaches: [
        {
          name: 'Increasing stack',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'When a bar is popped, the current index is its first smaller bar on the right and the new stack top is the first smaller on the left — so its max width is known.',
          code: `
            function largestRectangleArea(heights) {
              const stack = [];
              let best = 0;
              for (let i = 0; i <= heights.length; i++) {
                const h = i === heights.length ? 0 : heights[i]; // sentinel flushes the stack
                while (stack.length && heights[stack[stack.length - 1]] >= h) {
                  const height = heights[stack.pop()];
                  const left = stack.length ? stack[stack.length - 1] : -1;
                  best = Math.max(best, height * (i - left - 1));
                }
                stack.push(i);
              }
              return best;
            }
          `,
        },
      ],
      fn: 'largestRectangleArea',
      tests: [
        { args: [[2, 1, 5, 6, 2, 3]], expected: 10 },
        { args: [[2, 4]], expected: 4 },
        { args: [[1, 1, 1, 1]], expected: 4 },
      ],
    },
    {
      id: 'queue-using-stacks',
      title: 'Implement Queue using Stacks',
      difficulty: 'Easy',
      lc: 'implement-queue-using-stacks',
      tags: ['design', 'amortised'],
      statement: 'Implement a FIFO queue with two stacks: `push`, `pop`, `peek`, `empty`.',
      approaches: [
        {
          name: 'In-stack / out-stack',
          time: 'O(1) amortised',
          space: 'O(n)',
          idea: 'Only move elements from `in` to `out` when `out` is empty — each element moves at most once.',
          code: `
            class MyQueue {
              constructor() { this.in = []; this.out = []; }
              push(x) { this.in.push(x); }
              _shift() { if (!this.out.length) while (this.in.length) this.out.push(this.in.pop()); }
              pop() { this._shift(); return this.out.pop(); }
              peek() { this._shift(); return this.out[this.out.length - 1]; }
              empty() { return !this.in.length && !this.out.length; }
            }
          `,
        },
      ],
      kind: 'class',
      fn: 'MyQueue',
      tests: [
        { ops: ['MyQueue', 'push', 'push', 'peek', 'pop', 'empty'], args: [[], [1], [2], [], [], []], expected: [null, null, null, 1, 1, false] },
      ],
    },
    {
      id: 'eval-rpn',
      title: 'Evaluate Reverse Polish Notation',
      difficulty: 'Medium',
      lc: 'evaluate-reverse-polish-notation',
      tags: ['stack'],
      statement: 'Evaluate an RPN expression. Division truncates toward zero.',
      approaches: [
        {
          name: 'Operand stack',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function evalRPN(tokens) {
              const st = [];
              const ops = {
                '+': (a, b) => a + b,
                '-': (a, b) => a - b,
                '*': (a, b) => a * b,
                '/': (a, b) => Math.trunc(a / b),
              };
              for (const t of tokens) {
                if (t in ops) {
                  const b = st.pop(), a = st.pop();
                  st.push(ops[t](a, b));
                } else st.push(Number(t));
              }
              return st[0];
            }
          `,
        },
      ],
      fn: 'evalRPN',
      tests: [
        { args: [['2', '1', '+', '3', '*']], expected: 9 },
        { args: [['4', '13', '5', '/', '+']], expected: 6 },
        { args: [['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']], expected: 22 },
      ],
    },
  ],
};
