export default {
  id: 'bits',
  title: 'Bit Manipulation',
  icon: '🔢',
  source: 'notes',
  lecture: 'Lec 4',
  blurb: 'AND/OR/XOR/shift tricks, XOR cancellation, counting bits per position.',
  concepts: `
    | Op | Meaning | Handy fact |
    |---|---|---|
    | \`a & b\` | 1 only if both 1 | \`n & (n-1)\` clears the lowest set bit |
    | \`a \\| b\` | 1 if either is 1 | \`n \\| (1 << k)\` sets bit k |
    | \`a ^ b\` | 1 if different | \`x ^ x = 0\`, \`x ^ 0 = x\` — pairs cancel |
    | \`~a\` | flip all bits | \`~x = -x - 1\` in two's complement |
    | \`a << k\` | × 2ᵏ | \`1 << k\` builds a mask with only bit k |
    | \`a >> k\` | ÷ 2ᵏ (sign-preserving) | use \`>>>\` in JS for unsigned shift |

    - **Check bit k:** \`(n >> k) & 1\` or \`n & (1 << k)\`.
    - **Toggle bit k:** \`n ^ (1 << k)\`. **Clear bit k:** \`n & ~(1 << k)\`.
    - **Lowest set bit:** \`n & -n\`.
    - **Power of two:** \`n > 0 && (n & (n - 1)) === 0\`.
    - XOR, AND and OR are all **associative and commutative** — order of elements doesn't matter, which is why XOR-ing the whole array finds the odd one out.
    - JS bitwise ops work on **32-bit signed ints** — use \`>>> 0\` to get an unsigned result.
  `,
  questions: [
    {
      id: 'kth-bit-set',
      title: 'Check if the Kth Bit is Set',
      difficulty: 'Easy',
      from: 'Lec 4 – Bit Manipulation',
      tags: ['bits'],
      statement: 'Given `n` and `k` (0-indexed from the right), return `"SET"` if bit k of n is 1, otherwise `"NOT SET"`.',
      approaches: [
        {
          name: 'Left-shift mask',
          time: 'O(1)',
          space: 'O(1)',
          idea: '`1 << k` has only bit k set; AND it with n.',
          code: `
            function isKthBitSet(n, k) {
              return (n & (1 << k)) !== 0 ? 'SET' : 'NOT SET';
            }
          `,
        },
        {
          name: 'Right-shift n',
          time: 'O(1)',
          space: 'O(1)',
          idea: 'Shift bit k down to position 0 and check it.',
          code: `
            function isKthBitSet(n, k) {
              return ((n >> k) & 1) === 1 ? 'SET' : 'NOT SET';
            }
          `,
        },
      ],
      fn: 'isKthBitSet',
      tests: [
        { args: [5, 0], expected: 'SET' },
        { args: [5, 1], expected: 'NOT SET' },
        { args: [8, 3], expected: 'SET' },
      ],
    },
    {
      id: 'single-number',
      title: 'Single Number (every other element appears twice)',
      difficulty: 'Easy',
      lc: 'single-number',
      from: 'Lec 4 – Instructor notes',
      tags: ['xor'],
      statement: 'Every element appears twice except one. Find it in O(n) time and O(1) space.\n\n**Example:** `[4,1,2,1,2]` → `4`',
      approaches: [
        {
          name: 'Hash map count',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function singleNumber(nums) {
              const count = new Map();
              for (const x of nums) count.set(x, (count.get(x) || 0) + 1);
              for (const [x, c] of count) if (c === 1) return x;
            }
          `,
        },
        {
          name: 'XOR everything',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`x ^ x = 0` and XOR is commutative, so all pairs cancel and the single number remains.',
          code: `
            function singleNumber(nums) {
              let res = 0;
              for (const x of nums) res ^= x;
              return res;
            }
          `,
        },
      ],
      fn: 'singleNumber',
      tests: [
        { args: [[2, 2, 1]], expected: 1 },
        { args: [[4, 1, 2, 1, 2]], expected: 4 },
        { args: [[1, 2, 1, 5, 5]], expected: 2 },
      ],
    },
    {
      id: 'single-number-ii',
      title: 'Single Number II (every other element appears three times)',
      difficulty: 'Medium',
      lc: 'single-number-ii',
      from: 'Lec 4 – Instructor notes',
      tags: ['bits', 'counting'],
      statement: 'Every element appears **three** times except one, which appears once. Find it with O(1) extra space.\n\n**Example:** `[1,2,1,1]` → `2`',
      approaches: [
        {
          name: 'Count bits per position',
          time: 'O(32·n)',
          space: 'O(1)',
          idea: `
            For each bit position k, count how many numbers have it set. Numbers appearing 3 times contribute a
            multiple of 3, so \`count % 3\` is exactly the single number's bit. (This is the instructor's approach.)
          `,
          code: `
            function singleNumber(nums) {
              let result = 0;
              for (let k = 0; k < 32; k++) {
                let count = 0;
                for (const x of nums) count += (x >> k) & 1;
                if (count % 3 !== 0) result |= 1 << k;
              }
              return result; // bit 31 set => JS gives a negative number, as required
            }
          `,
        },
        {
          name: 'ones / twos state machine',
          time: 'O(n)',
          space: 'O(1)',
          idea: '`ones` holds bits seen 1 (mod 3) times, `twos` bits seen 2 times. A bit seen a third time is cleared from both.',
          code: `
            function singleNumber(nums) {
              let ones = 0, twos = 0;
              for (const x of nums) {
                ones = (ones ^ x) & ~twos;
                twos = (twos ^ x) & ~ones;
              }
              return ones;
            }
          `,
        },
      ],
      explanation: 'The bit-count method generalises to “every element appears k times” — just use `% k`.',
      fn: 'singleNumber',
      tests: [
        { args: [[2, 2, 3, 2]], expected: 3 },
        { args: [[0, 1, 0, 1, 0, 1, 99]], expected: 99 },
        { args: [[1, 2, 1, 1]], expected: 2 },
        { args: [[-2, -2, 1, 1, 4, 1, 4, 4, -4, -2]], expected: -4 },
      ],
    },
    {
      id: 'number-of-1-bits',
      title: 'Number of 1 Bits (Hamming weight)',
      difficulty: 'Easy',
      lc: 'number-of-1-bits',
      tags: ['bits'],
      statement: 'Return the number of set bits in a positive integer `n`.',
      approaches: [
        {
          name: 'Check every bit',
          time: 'O(32)',
          space: 'O(1)',
          code: `
            function hammingWeight(n) {
              let count = 0;
              while (n !== 0) {
                count += n & 1;
                n >>>= 1;
              }
              return count;
            }
          `,
        },
        {
          name: "Brian Kernighan's",
          time: 'O(set bits)',
          space: 'O(1)',
          idea: '`n & (n - 1)` drops the lowest set bit, so the loop runs once per 1-bit.',
          code: `
            function hammingWeight(n) {
              let count = 0;
              while (n !== 0) {
                n &= n - 1;
                count++;
              }
              return count;
            }
          `,
        },
      ],
      fn: 'hammingWeight',
      tests: [
        { args: [11], expected: 3 },
        { args: [128], expected: 1 },
        { args: [2147483645], expected: 30 },
      ],
    },
    {
      id: 'power-of-two',
      title: 'Power of Two',
      difficulty: 'Easy',
      lc: 'power-of-two',
      tags: ['bits'],
      statement: 'Return true if `n` is a power of two.',
      approaches: [
        {
          name: 'n & (n − 1)',
          time: 'O(1)',
          space: 'O(1)',
          idea: 'A power of two has exactly one set bit; clearing the lowest set bit must give 0.',
          code: `
            function isPowerOfTwo(n) {
              return n > 0 && (n & (n - 1)) === 0;
            }
          `,
        },
      ],
      fn: 'isPowerOfTwo',
      tests: [
        { args: [1], expected: true },
        { args: [16], expected: true },
        { args: [3], expected: false },
        { args: [0], expected: false },
        { args: [-8], expected: false },
      ],
    },
    {
      id: 'counting-bits',
      title: 'Counting Bits',
      difficulty: 'Easy',
      lc: 'counting-bits',
      tags: ['bits', 'dp'],
      statement: 'Return an array `ans` of length `n + 1` where `ans[i]` is the number of 1s in the binary form of `i`.',
      approaches: [
        {
          name: 'DP on i >> 1',
          time: 'O(n)',
          space: 'O(1) extra',
          idea: '`i` has the same bits as `i >> 1` plus its lowest bit: `ans[i] = ans[i >> 1] + (i & 1)`.',
          code: `
            function countBits(n) {
              const ans = new Array(n + 1).fill(0);
              for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
              return ans;
            }
          `,
        },
      ],
      fn: 'countBits',
      tests: [
        { args: [2], expected: [0, 1, 1] },
        { args: [5], expected: [0, 1, 1, 2, 1, 2] },
      ],
    },
    {
      id: 'missing-number',
      title: 'Missing Number',
      difficulty: 'Easy',
      lc: 'missing-number',
      tags: ['xor', 'math'],
      statement: 'An array contains `n` distinct numbers from `[0, n]`. Return the one that is missing.',
      approaches: [
        {
          name: 'Sum formula',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function missingNumber(nums) {
              const n = nums.length;
              let sum = (n * (n + 1)) / 2;
              for (const x of nums) sum -= x;
              return sum;
            }
          `,
        },
        {
          name: 'XOR indices and values',
          time: 'O(n)',
          space: 'O(1)',
          idea: 'XOR all indices 0..n with all values — everything present cancels; no overflow risk.',
          code: `
            function missingNumber(nums) {
              let x = nums.length;
              for (let i = 0; i < nums.length; i++) x ^= i ^ nums[i];
              return x;
            }
          `,
        },
      ],
      fn: 'missingNumber',
      tests: [
        { args: [[3, 0, 1]], expected: 2 },
        { args: [[0, 1]], expected: 2 },
        { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
      ],
    },
    {
      id: 'subsets-bitmask',
      title: 'Subsets via Bitmask',
      difficulty: 'Medium',
      lc: 'subsets',
      tags: ['bits', 'enumeration'],
      statement: 'Return all subsets of an array of distinct integers.',
      approaches: [
        {
          name: 'Bitmask enumeration',
          time: 'O(n · 2ⁿ)',
          space: 'O(n · 2ⁿ) output',
          idea: 'Each mask from 0 to 2ⁿ − 1 represents one subset: bit i set ⇒ include `nums[i]`.',
          code: `
            function subsets(nums) {
              const n = nums.length, out = [];
              for (let mask = 0; mask < (1 << n); mask++) {
                const subset = [];
                for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(nums[i]);
                out.push(subset);
              }
              return out;
            }
          `,
        },
      ],
      explanation: 'A neat bridge between bit manipulation and recursion — the recursive include/exclude tree produces exactly the same 2ⁿ subsets.',
      fn: 'subsets',
      compare: 'nested-unordered',
      tests: [
        { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
        { args: [[0]], expected: [[], [0]] },
      ],
    },
  ],
};
