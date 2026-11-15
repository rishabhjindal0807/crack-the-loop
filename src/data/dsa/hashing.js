export default {
  id: 'hashing',
  title: 'Hashing',
  icon: '#️⃣',
  source: 'curriculum',
  blurb: 'Map/Set lookups, prefix-sum + hash map, grouping by canonical key.',
  concepts: `
    - \`Map\` / \`Set\` give average **O(1)** insert/lookup. Prefer \`Map\` over plain objects for arbitrary keys (no prototype keys, keeps insertion order, numeric keys stay numbers).
    - **Complement lookup:** “does \`target − x\` exist?” ⇒ Two Sum in O(n).
    - **Prefix sum + hash map:** count subarrays with sum k — store how many times each prefix sum was seen; seed with \`{0: 1}\`.
    - **Canonical keys:** group anagrams by sorted string or by a 26-count signature.
    - Worst case is O(n) per op when many keys collide — mention it if asked about adversarial inputs.
  `,
  questions: [
    {
      id: 'two-sum',
      title: 'Two Sum',
      difficulty: 'Easy',
      lc: 'two-sum',
      tags: ['hash-map'],
      statement: 'Return indices of the two numbers that add up to `target`.',
      approaches: [
        {
          name: 'Brute force',
          time: 'O(n²)',
          space: 'O(1)',
          code: `
            function twoSum(nums, target) {
              for (let i = 0; i < nums.length; i++)
                for (let j = i + 1; j < nums.length; j++) if (nums[i] + nums[j] === target) return [i, j];
            }
          `,
        },
        {
          name: 'One-pass hash map',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Before inserting `x`, check whether its complement was already seen.',
          code: `
            function twoSum(nums, target) {
              const seen = new Map();
              for (let i = 0; i < nums.length; i++) {
                if (seen.has(target - nums[i])) return [seen.get(target - nums[i]), i];
                seen.set(nums[i], i);
              }
            }
          `,
        },
      ],
      fn: 'twoSum',
      tests: [
        { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
        { args: [[3, 2, 4], 6], expected: [1, 2] },
        { args: [[3, 3], 6], expected: [0, 1] },
      ],
    },
    {
      id: 'subarray-sum-equals-k',
      title: 'Subarray Sum Equals K',
      difficulty: 'Medium',
      lc: 'subarray-sum-equals-k',
      tags: ['prefix-sum', 'hash-map'],
      statement: 'Count contiguous subarrays whose sum equals `k` (values may be negative).',
      approaches: [
        {
          name: 'All subarrays',
          time: 'O(n²)',
          space: 'O(1)',
          code: `
            function subarraySum(nums, k) {
              let count = 0;
              for (let i = 0; i < nums.length; i++) {
                let sum = 0;
                for (let j = i; j < nums.length; j++) if ((sum += nums[j]) === k) count++;
              }
              return count;
            }
          `,
        },
        {
          name: 'Prefix sum + hash map',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'sum(i..j) = P[j] − P[i−1] = k ⇒ for each prefix P, count earlier prefixes equal to `P − k`.',
          code: `
            function subarraySum(nums, k) {
              const freq = new Map([[0, 1]]);
              let prefix = 0, count = 0;
              for (const x of nums) {
                prefix += x;
                count += freq.get(prefix - k) || 0;
                freq.set(prefix, (freq.get(prefix) || 0) + 1);
              }
              return count;
            }
          `,
        },
      ],
      explanation: 'Sliding window does **not** work here because of negative numbers — say that before reaching for the hash map.',
      fn: 'subarraySum',
      tests: [
        { args: [[1, 1, 1], 2], expected: 2 },
        { args: [[1, 2, 3], 3], expected: 2 },
        { args: [[1, -1, 0], 0], expected: 3 },
      ],
    },
    {
      id: 'group-anagrams',
      title: 'Group Anagrams',
      difficulty: 'Medium',
      lc: 'group-anagrams',
      tags: ['hash-map', 'canonical-key'],
      statement: 'Group strings that are anagrams of each other.',
      approaches: [
        {
          name: 'Count signature as key',
          time: 'O(n · k)',
          space: 'O(n · k)',
          idea: 'Key = the 26 letter counts joined with `#`. Avoids the O(k log k) sort per word.',
          code: `
            function groupAnagrams(strs) {
              const groups = new Map();
              for (const s of strs) {
                const count = new Array(26).fill(0);
                for (let i = 0; i < s.length; i++) count[s.charCodeAt(i) - 97]++;
                const key = count.join('#');
                if (!groups.has(key)) groups.set(key, []);
                groups.get(key).push(s);
              }
              return [...groups.values()];
            }
          `,
        },
      ],
      fn: 'groupAnagrams',
      compare: 'nested-unordered',
      tests: [
        { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
        { args: [['']], expected: [['']] },
      ],
    },
    {
      id: 'longest-consecutive-sequence',
      title: 'Longest Consecutive Sequence',
      difficulty: 'Medium',
      lc: 'longest-consecutive-sequence',
      tags: ['hash-set'],
      statement: 'Return the length of the longest run of consecutive integers (in any order) in O(n).',
      approaches: [
        {
          name: 'Start only at sequence heads',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Only begin counting from x if `x − 1` is not in the set — each number is visited at most twice overall.',
          code: `
            function longestConsecutive(nums) {
              const set = new Set(nums);
              let best = 0;
              for (const x of set) {
                if (set.has(x - 1)) continue;
                let len = 1;
                while (set.has(x + len)) len++;
                best = Math.max(best, len);
              }
              return best;
            }
          `,
        },
      ],
      fn: 'longestConsecutive',
      tests: [
        { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
        { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
        { args: [[]], expected: 0 },
      ],
    },
    {
      id: 'top-k-frequent',
      title: 'Top K Frequent Elements',
      difficulty: 'Medium',
      lc: 'top-k-frequent-elements',
      tags: ['hash-map', 'bucket-sort'],
      statement: 'Return the `k` most frequent elements.',
      approaches: [
        {
          name: 'Bucket sort by frequency',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'Frequencies are in `1..n`, so bucket index = frequency. Read buckets from high to low.',
          code: `
            function topKFrequent(nums, k) {
              const freq = new Map();
              for (const x of nums) freq.set(x, (freq.get(x) || 0) + 1);
              const buckets = Array.from({ length: nums.length + 1 }, () => []);
              for (const [x, f] of freq) buckets[f].push(x);
              const out = [];
              for (let f = nums.length; f > 0 && out.length < k; f--) out.push(...buckets[f]);
              return out.slice(0, k);
            }
          `,
        },
      ],
      fn: 'topKFrequent',
      compare: 'unordered',
      tests: [
        { args: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2] },
        { args: [[1], 1], expected: [1] },
      ],
    },
    {
      id: 'longest-substring-no-repeat',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      lc: 'longest-substring-without-repeating-characters',
      tags: ['hash-map', 'sliding-window'],
      statement: 'Return the length of the longest substring without repeated characters.',
      approaches: [
        {
          name: 'Sliding window + last-seen map',
          time: 'O(n)',
          space: 'O(min(n, charset))',
          idea: 'When `s[r]` was seen inside the window, jump `l` to one past its last index.',
          code: `
            function lengthOfLongestSubstring(s) {
              const last = new Map();
              let l = 0, best = 0;
              for (let r = 0; r < s.length; r++) {
                if (last.has(s[r]) && last.get(s[r]) >= l) l = last.get(s[r]) + 1;
                last.set(s[r], r);
                best = Math.max(best, r - l + 1);
              }
              return best;
            }
          `,
        },
      ],
      fn: 'lengthOfLongestSubstring',
      tests: [
        { args: ['abcabcbb'], expected: 3 },
        { args: ['bbbbb'], expected: 1 },
        { args: ['pwwkew'], expected: 3 },
        { args: ['abba'], expected: 2 },
      ],
    },
  ],
};
