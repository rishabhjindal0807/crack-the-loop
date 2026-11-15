export default {
  id: 'greedy',
  title: 'Greedy',
  icon: '🎯',
  source: 'curriculum',
  blurb: 'Local choice that is provably safe: intervals, jumps, gas station, candies.',
  concepts: `
    - Greedy = make the locally best choice and never revisit it. It is only correct when you can argue an **exchange argument** (“any optimal solution can be transformed to include my choice”).
    - **Interval scheduling:** sort by **end** time to maximise non-overlapping intervals.
    - **Reachability:** track the farthest index reachable so far (Jump Game).
    - **Two-pass greedy:** satisfy left-neighbour constraints, then right-neighbour (Candy).
    - If you can't prove greedy, fall back to DP — and say so.
  `,
  questions: [
    {
      id: 'jump-game',
      title: 'Jump Game',
      difficulty: 'Medium',
      lc: 'jump-game',
      tags: ['greedy', 'reachability'],
      statement: '`nums[i]` is the max jump from i. Can you reach the last index?',
      approaches: [
        {
          name: 'Farthest reach',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function canJump(nums) {
              let far = 0;
              for (let i = 0; i < nums.length; i++) {
                if (i > far) return false;
                far = Math.max(far, i + nums[i]);
              }
              return true;
            }
          `,
        },
      ],
      fn: 'canJump',
      tests: [
        { args: [[2, 3, 1, 1, 4]], expected: true },
        { args: [[3, 2, 1, 0, 4]], expected: false },
      ],
    },
    {
      id: 'jump-game-ii',
      title: 'Jump Game II (minimum jumps)',
      difficulty: 'Medium',
      lc: 'jump-game-ii',
      tags: ['greedy', 'bfs-levels'],
      statement: 'Return the minimum number of jumps to reach the last index (always reachable).',
      approaches: [
        {
          name: 'Implicit BFS levels',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`[i .. end]` is the range reachable with `jumps` jumps; `far` is the end of the next range.',
          code: `
            function jump(nums) {
              let jumps = 0, end = 0, far = 0;
              for (let i = 0; i < nums.length - 1; i++) {
                far = Math.max(far, i + nums[i]);
                if (i === end) { jumps++; end = far; }
              }
              return jumps;
            }
          `,
        },
      ],
      fn: 'jump',
      tests: [
        { args: [[2, 3, 1, 1, 4]], expected: 2 },
        { args: [[2, 3, 0, 1, 4]], expected: 2 },
        { args: [[0]], expected: 0 },
      ],
    },
    {
      id: 'non-overlapping-intervals',
      title: 'Non-overlapping Intervals',
      difficulty: 'Medium',
      lc: 'non-overlapping-intervals',
      tags: ['greedy', 'intervals'],
      statement: 'Minimum number of intervals to remove so the rest don’t overlap.',
      approaches: [
        {
          name: 'Sort by end, keep earliest finishers',
          time: 'O(n log n)',
          space: 'O(1)',
          idea: 'Finishing earliest leaves the most room for the rest (exchange argument).',
          code: `
            function eraseOverlapIntervals(intervals) {
              const a = [...intervals].sort((x, y) => x[1] - y[1]);
              let removed = 0, end = -Infinity;
              for (const [s, e] of a) {
                if (s >= end) end = e;
                else removed++;
              }
              return removed;
            }
          `,
        },
      ],
      fn: 'eraseOverlapIntervals',
      tests: [
        { args: [[[1, 2], [2, 3], [3, 4], [1, 3]]], expected: 1 },
        { args: [[[1, 2], [1, 2], [1, 2]]], expected: 2 },
        { args: [[[1, 2], [2, 3]]], expected: 0 },
      ],
    },
    {
      id: 'gas-station',
      title: 'Gas Station',
      difficulty: 'Medium',
      lc: 'gas-station',
      tags: ['greedy'],
      statement: 'Return the start index to complete the circuit once, or -1.',
      approaches: [
        {
          name: 'Reset start when tank goes negative',
          time: 'O(n)',
          space: 'O(1)',
          idea: 'If total gas ≥ total cost a solution exists. If you run dry at i starting from s, no station in `[s..i]` can be the start — jump to i + 1.',
          code: `
            function canCompleteCircuit(gas, cost) {
              let total = 0, tank = 0, start = 0;
              for (let i = 0; i < gas.length; i++) {
                const d = gas[i] - cost[i];
                total += d;
                tank += d;
                if (tank < 0) { start = i + 1; tank = 0; }
              }
              return total >= 0 ? start : -1;
            }
          `,
        },
      ],
      fn: 'canCompleteCircuit',
      tests: [
        { args: [[1, 2, 3, 4, 5], [3, 4, 5, 1, 2]], expected: 3 },
        { args: [[2, 3, 4], [3, 4, 3]], expected: -1 },
      ],
    },
    {
      id: 'candy',
      title: 'Candy',
      difficulty: 'Hard',
      lc: 'candy',
      tags: ['greedy', 'two-pass'],
      statement: 'Each child gets ≥ 1 candy; a child with a higher rating than a neighbour gets more than that neighbour. Minimum candies?',
      approaches: [
        {
          name: 'Left pass + right pass',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function candy(ratings) {
              const n = ratings.length, c = new Array(n).fill(1);
              for (let i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) c[i] = c[i - 1] + 1;
              for (let i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) c[i] = Math.max(c[i], c[i + 1] + 1);
              return c.reduce((a, b) => a + b, 0);
            }
          `,
        },
      ],
      fn: 'candy',
      tests: [
        { args: [[1, 0, 2]], expected: 5 },
        { args: [[1, 2, 2]], expected: 4 },
        { args: [[1, 3, 4, 5, 2]], expected: 11 },
      ],
    },
    {
      id: 'min-arrows',
      title: 'Minimum Number of Arrows to Burst Balloons',
      difficulty: 'Medium',
      lc: 'minimum-number-of-arrows-to-burst-balloons',
      tags: ['greedy', 'intervals'],
      statement: 'Balloons are intervals on the x-axis; an arrow at x bursts all intervals containing x. Minimum arrows?',
      approaches: [
        {
          name: 'Shoot at the earliest end',
          time: 'O(n log n)',
          space: 'O(1)',
          code: `
            function findMinArrowShots(points) {
              const a = [...points].sort((x, y) => x[1] - y[1]);
              let arrows = 0, pos = -Infinity;
              for (const [s, e] of a) {
                if (s > pos) { arrows++; pos = e; }
              }
              return arrows;
            }
          `,
        },
      ],
      fn: 'findMinArrowShots',
      tests: [
        { args: [[[10, 16], [2, 8], [1, 6], [7, 12]]], expected: 2 },
        { args: [[[1, 2], [3, 4], [5, 6], [7, 8]]], expected: 4 },
        { args: [[[1, 2], [2, 3], [3, 4], [4, 5]]], expected: 2 },
      ],
    },
  ],
};
