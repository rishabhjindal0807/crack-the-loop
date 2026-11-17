// Samples impl() N times; passes if every value 1..k appears within ±8% of N/k.
const uniform = (impl, k, N) => {
  const freq = new Array(k + 1).fill(0);
  for (let i = 0; i < N; i++) {
    const v = impl();
    if (!Number.isInteger(v) || v < 1 || v > k) return false;
    freq[v]++;
  }
  return freq.slice(1).every((f) => Math.abs(f - N / k) < (N / k) * 0.08);
};

export default {
  id: 'maths',
  title: 'Maths: Randomisation, GCD, Factors, Primes, Modular Arithmetic',
  icon: '➗',
  source: 'notes',
  lecture: 'Lec 5 (Maths 1 & 2) + IL3',
  blurb: 'randN from randM, Euclid GCD, √n factor pairs, sieve, modular arithmetic identities.',
  concepts: `
    - **randM → randN:** \`(randM() - 1) * M + randM()\` is uniform on \`1..M²\`. If \`M²\` isn't a multiple of N, **reject** the top values and retry (rejection sampling).
    - **GCD (Euclid):** \`gcd(a, b) = gcd(b, a % b)\`, \`gcd(a, 0) = a\` — O(log min(a, b)). \`lcm(a, b) = a / gcd(a, b) * b\`.
    - **Factors come in pairs** \`(i, n / i)\` with \`i ≤ √n\` ⇒ enumerate in O(√n). Only perfect squares have an **odd** number of divisors.
    - **Primality:** trial-divide up to √n. **Sieve of Eratosthenes** marks all primes ≤ n in O(n log log n).
    - **Modular arithmetic:**
      - \`(a + b) % m = ((a % m) + (b % m)) % m\`
      - \`(a − b) % m = ((a % m) − (b % m) + m) % m\`  ← add m to stay non-negative
      - \`(a · b) % m = ((a % m) · (b % m)) % m\`
      - Division does **not** distribute — you need the modular inverse (\`b^(m−2) mod m\` when m is prime).
    - In JS, products above 2⁵³ lose precision — use \`BigInt\` for modular multiplication with large moduli.
  `,
  questions: [
    {
      id: 'rand9-from-rand6',
      title: 'Implement rand9() using rand6()',
      difficulty: 'Medium',
      from: 'Lec 5 – Maths 1',
      tags: ['randomisation'],
      statement: '`rand6()` returns 1–6 uniformly. Implement `rand9()` returning 1–9 uniformly.',
      approaches: [
        {
          name: 'Two calls → 0..35, then % 9',
          time: 'O(1)',
          space: 'O(1)',
          idea: `
            \`(rand6() − 1) · 6 + (rand6() − 1)\` is uniform on 0..35. 36 is divisible by 9, so \`r % 9\` is uniform
            on 0..8 — no rejection needed. Note \`(rand6() + rand6()) % 9\` is **wrong**: sums of dice are not uniform.
          `,
          code: `
            function rand6() {
              return Math.floor(Math.random() * 6) + 1;
            }
            function rand9() {
              const r = (rand6() - 1) * 6 + (rand6() - 1); // uniform 0..35
              return (r % 9) + 1;
            }
          `,
        },
      ],
      explanation: 'The checker runs 90,000 samples and verifies every value 1–9 appears with ~11.1% frequency.',
      fn: 'rand9',
      tests: [{ args: [], label: '90k samples are uniform' }],
      check: (_r, _a, _t, impl) => uniform(impl, 9, 90000),
    },
    {
      id: 'rand7-from-rand5',
      title: 'Implement rand7() using rand5()',
      difficulty: 'Medium',
      lc: 'implement-rand10-using-rand7',
      from: 'Lec 5 – Maths 1',
      tags: ['randomisation', 'rejection-sampling'],
      statement: '`rand5()` returns 1–5 uniformly. Implement `rand7()` returning 1–7 uniformly. (LeetCode 470 is the same idea with rand7 → rand10.)',
      approaches: [
        {
          name: 'Rejection sampling',
          time: 'O(1) expected',
          space: 'O(1)',
          idea: `
            Two calls give 0..24 uniformly (a 5×5 grid). 25 isn't divisible by 7, so keep only 0..20 (21 cells = 3 per
            output value) and **retry** on 21..24. Expected calls = 2 · 25/21 ≈ 2.38.
          `,
          code: `
            function rand5() {
              return Math.floor(Math.random() * 5) + 1;
            }
            function rand7() {
              let num;
              do {
                num = (rand5() - 1) * 5 + (rand5() - 1); // uniform 0..24
              } while (num > 20); // reject 21..24
              return (num % 7) + 1;
            }
          `,
        },
      ],
      explanation: 'The instructor first tried `(rand5() + (rand5()−1)·5) % 7` without rejection and showed the counts (3,4,4,4,4,3,3) are uneven — that is the bug interviewers want you to catch.',
      fn: 'rand7',
      tests: [{ args: [], label: '70k samples are uniform' }],
      check: (_r, _a, _t, impl) => uniform(impl, 7, 70000),
    },
    {
      id: 'gcd',
      title: 'GCD of Two Numbers',
      difficulty: 'Easy',
      from: 'Lec 5 – Maths 1',
      tags: ['gcd'],
      statement: 'Return the greatest common divisor of `a` and `b`. **Example:** `gcd(98, 56) = 14`.',
      approaches: [
        {
          name: 'Count down from min',
          time: 'O(min(a, b))',
          space: 'O(1)',
          code: `
            function gcd(a, b) {
              let r = Math.min(a, b);
              while (r > 0 && (a % r !== 0 || b % r !== 0)) r--;
              return r === 0 ? Math.max(a, b) : r;
            }
          `,
        },
        {
          name: 'Euclid by subtraction (notes)',
          time: 'O(max(a, b))',
          space: 'O(1)',
          idea: 'Repeatedly subtract the smaller from the larger; when they become equal that value is the GCD.',
          code: `
            function gcd(a, b) {
              if (a === 0) return b;
              if (b === 0) return a;
              while (a !== b) {
                if (a > b) a -= b;
                else b -= a;
              }
              return a;
            }
          `,
        },
        {
          name: 'Euclidean algorithm',
          time: 'O(log min(a, b))',
          space: 'O(1)',
          idea: 'Any common divisor of a and b also divides `a % b`, so `gcd(a, b) = gcd(b, a % b)`.',
          code: `
            function gcd(a, b) {
              while (b !== 0) [a, b] = [b, a % b];
              return a;
            }
          `,
        },
      ],
      fn: 'gcd',
      tests: [
        { args: [98, 56], expected: 14 },
        { args: [20, 28], expected: 4 },
        { args: [17, 5], expected: 1 },
        { args: [0, 9], expected: 9 },
      ],
    },
    {
      id: 'all-divisors',
      title: 'Find All Divisors of n',
      difficulty: 'Easy',
      from: 'Lec 5 – Maths 2',
      tags: ['factors'],
      statement: 'Return all divisors of `n` in ascending order. **Example:** `100` → `[1,2,4,5,10,20,25,50,100]`',
      approaches: [
        {
          name: 'Check 1..n',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function divisors(n) {
              const out = [];
              for (let i = 1; i <= n; i++) if (n % i === 0) out.push(i);
              return out;
            }
          `,
        },
        {
          name: 'Pairs up to √n',
          time: 'O(√n)',
          space: 'O(√n)',
          idea: 'If `i` divides n, so does `n / i`. Push small ones forward and big ones into a second list, then join — no sort needed.',
          code: `
            function divisors(n) {
              const small = [], big = [];
              for (let i = 1; i * i <= n; i++) {
                if (n % i === 0) {
                  small.push(i);
                  if (i !== n / i) big.push(n / i);
                }
              }
              return small.concat(big.reverse());
            }
          `,
        },
      ],
      fn: 'divisors',
      tests: [
        { args: [10], expected: [1, 2, 5, 10] },
        { args: [100], expected: [1, 2, 4, 5, 10, 20, 25, 50, 100] },
        { args: [1], expected: [1] },
      ],
    },
    {
      id: 'odd-even-divisors',
      title: 'Is the Number of Factors Odd or Even?',
      difficulty: 'Easy',
      from: 'Lec 5 – Maths 2',
      tags: ['factors', 'perfect-square'],
      statement: 'Return `"Odd"` if `n` has an odd number of divisors, else `"Even"`.',
      approaches: [
        {
          name: 'Count divisors',
          time: 'O(√n)',
          space: 'O(1)',
          code: `
            function factorParity(n) {
              let cnt = 0;
              for (let i = 1; i * i <= n; i++) if (n % i === 0) cnt += i * i === n ? 1 : 2;
              return cnt % 2 ? 'Odd' : 'Even';
            }
          `,
        },
        {
          name: 'Perfect-square check',
          time: 'O(1)',
          space: 'O(1)',
          idea: 'Divisors pair up `(i, n/i)` except when `i = √n`. So the count is odd **iff n is a perfect square**.',
          code: `
            function factorParity(n) {
              const r = Math.round(Math.sqrt(n));
              return r * r === n ? 'Odd' : 'Even';
            }
          `,
        },
      ],
      fn: 'factorParity',
      tests: [
        { args: [100], expected: 'Odd' },
        { args: [10], expected: 'Even' },
        { args: [49], expected: 'Odd' },
      ],
    },
    {
      id: 'bulb-switcher',
      title: 'Open Doors / Bulb Switcher',
      difficulty: 'Medium',
      lc: 'bulb-switcher',
      from: 'IL3 – Maths',
      tags: ['perfect-square', 'math'],
      statement: '`n` closed doors. On pass `i` (1..n) you toggle every i-th door. How many doors are open at the end?',
      approaches: [
        {
          name: 'Simulate',
          time: 'O(n log n)',
          space: 'O(n)',
          code: `
            function bulbSwitch(n) {
              const open = new Array(n + 1).fill(false);
              for (let i = 1; i <= n; i++) for (let j = i; j <= n; j += i) open[j] = !open[j];
              return open.filter(Boolean).length;
            }
          `,
        },
        {
          name: 'Count perfect squares',
          time: 'O(1)',
          space: 'O(1)',
          idea: 'Door d is toggled once per divisor of d. It ends open iff it has an odd number of divisors ⇒ d is a perfect square. Count = ⌊√n⌋.',
          code: `
            function bulbSwitch(n) {
              return Math.floor(Math.sqrt(n));
            }
          `,
        },
      ],
      fn: 'bulbSwitch',
      tests: [
        { args: [3], expected: 1 },
        { args: [100], expected: 10 },
        { args: [0], expected: 0 },
      ],
    },
    {
      id: 'is-prime',
      title: 'Check if a Number is Prime',
      difficulty: 'Easy',
      from: 'IL3 – Maths 1 & 2',
      tags: ['primes'],
      statement: 'Return true if `n` is prime (exactly two divisors: 1 and itself).',
      approaches: [
        {
          name: 'Trial division up to n − 1',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function isPrime(n) {
              if (n < 2) return false;
              for (let d = 2; d < n; d++) if (n % d === 0) return false;
              return true;
            }
          `,
        },
        {
          name: 'Trial division up to √n',
          time: 'O(√n)',
          space: 'O(1)',
          idea: 'If n = a·b with a ≤ b then a ≤ √n — so a divisor must show up by √n. Skip even numbers after 2 for a 2× speed-up.',
          code: `
            function isPrime(n) {
              if (n < 2) return false;
              if (n % 2 === 0) return n === 2;
              for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
              return true;
            }
          `,
        },
      ],
      explanation: 'For many queries up to some limit, precompute with the Sieve (next problems). 1 is **not** prime — a classic edge case.',
      fn: 'isPrime',
      tests: [
        { args: [1], expected: false },
        { args: [2], expected: true },
        { args: [21], expected: false },
        { args: [97], expected: true },
        { args: [7919], expected: true },
      ],
    },
    {
      id: 'four-divisors',
      title: 'Four Divisors',
      difficulty: 'Medium',
      lc: 'four-divisors',
      from: 'IL3 – Maths',
      tags: ['factors'],
      statement: 'Return the sum of divisors of the numbers in `nums` that have **exactly four** divisors. **Example:** `[21,4,7]` → `32` (21: 1+3+7+21).',
      approaches: [
        {
          name: '√n enumeration per number',
          time: 'O(n · √max)',
          space: 'O(1)',
          idea: 'Start with `count = 2, sum = 1 + x` (1 and x itself), add each factor pair up to √x, bail early past 4.',
          code: `
            function sumFourDivisors(nums) {
              let total = 0;
              for (const x of nums) {
                let count = 2, sum = 1 + x;
                for (let j = 2; j * j <= x && count <= 4; j++) {
                  if (x % j === 0) {
                    count++;
                    sum += j;
                    if (j !== x / j) {
                      count++;
                      sum += x / j;
                    }
                  }
                }
                if (x > 1 && count === 4) total += sum;
              }
              return total;
            }
          `,
        },
      ],
      fn: 'sumFourDivisors',
      tests: [
        { args: [[21, 4, 7]], expected: 32 },
        { args: [[21, 21]], expected: 64 },
        { args: [[1, 2, 3, 4, 5]], expected: 0 },
        { args: [[8]], expected: 15 },
      ],
    },
    {
      id: 'array-pairs-divisible-by-k',
      title: 'Check If Array Pairs Are Divisible by k',
      difficulty: 'Medium',
      lc: 'check-if-array-pairs-are-divisible-by-k',
      from: 'IL3 – Maths (modular arithmetic)',
      tags: ['modular-arithmetic', 'hashing'],
      statement: 'Can the array (even length) be split into pairs where each pair sum is divisible by `k`?',
      approaches: [
        {
          name: 'Remainder counting',
          time: 'O(n + k)',
          space: 'O(k)',
          idea: `
            \`(a + b) % k = 0\` ⇔ \`a % k + b % k ∈ {0, k}\`. So remainder r must pair with \`k − r\`:
            need \`cnt[r] === cnt[k − r]\` for 0 < r < k, and \`cnt[0]\` even. Normalise negatives with \`((x % k) + k) % k\`.
          `,
          code: `
            function canArrange(arr, k) {
              const cnt = new Array(k).fill(0);
              for (const x of arr) cnt[((x % k) + k) % k]++;
              if (cnt[0] % 2 !== 0) return false;
              for (let r = 1; r < k; r++) if (cnt[r] !== cnt[k - r]) return false;
              return true;
            }
          `,
        },
      ],
      explanation: 'When k is even, `r = k/2` pairs with itself, so the loop’s check there is trivially true. That is still correct: the array length is even, `cnt[0]` is even and every other remainder pairs off evenly, so `cnt[k/2]` is forced to be even too.',
      fn: 'canArrange',
      tests: [
        { args: [[1, 2, 3, 4, 5, 10, 6, 7, 8, 9], 5], expected: true },
        { args: [[1, 2, 3, 4, 5, 6], 7], expected: true },
        { args: [[1, 2, 3, 4, 5, 6], 10], expected: false },
        { args: [[-1, 1, -2, 2, -3, 3, -4, 4], 3], expected: true },
      ],
    },
    {
      id: 'count-primes',
      title: 'Count Primes (Sieve of Eratosthenes)',
      difficulty: 'Medium',
      lc: 'count-primes',
      tags: ['primes', 'sieve'],
      statement: 'Return the number of primes strictly less than `n`.',
      approaches: [
        {
          name: 'Trial division',
          time: 'O(n√n)',
          space: 'O(1)',
          code: `
            function countPrimes(n) {
              let count = 0;
              for (let x = 2; x < n; x++) {
                let prime = true;
                for (let d = 2; d * d <= x; d++) if (x % d === 0) { prime = false; break; }
                if (prime) count++;
              }
              return count;
            }
          `,
        },
        {
          name: 'Sieve',
          time: 'O(n log log n)',
          space: 'O(n)',
          idea: 'For each prime p, cross out multiples starting at **p²** (smaller multiples were already crossed by smaller primes).',
          code: `
            function countPrimes(n) {
              if (n < 3) return 0;
              const composite = new Uint8Array(n);
              let count = 0;
              for (let p = 2; p < n; p++) {
                if (composite[p]) continue;
                count++;
                for (let m = p * p; m < n; m += p) composite[m] = 1;
              }
              return count;
            }
          `,
        },
      ],
      fn: 'countPrimes',
      tests: [
        { args: [10], expected: 4 },
        { args: [0], expected: 0 },
        { args: [2], expected: 0 },
        { args: [1000], expected: 168 },
      ],
    },
  ],
};
