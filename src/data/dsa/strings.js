export default {
  id: 'strings',
  title: 'Strings',
  icon: '🔤',
  source: 'curriculum',
  blurb: 'Frequency arrays, expand-around-centre, string building, KMP prefix function.',
  concepts: `
    - JS strings are **immutable** — \`s += c\` in a loop can be O(n²); collect into an array and \`join('')\`.
    - **Frequency array** of size 26: \`count[c.charCodeAt(0) - 97]++\` — faster than a Map for lowercase letters.
    - **Anagram / permutation checks** → compare frequency arrays (or a sorted key).
    - **Palindromes** → two pointers, or *expand around centre* (2n − 1 centres) for substrings.
    - **Pattern matching** → KMP's prefix function (LPS) gives O(n + m); Rabin–Karp uses a rolling hash.
    - Unicode: \`'😀'.length === 2\` (UTF-16). Use \`[...s]\` to iterate code points.
  `,
  questions: [
    {
      id: 'valid-anagram',
      title: 'Valid Anagram',
      difficulty: 'Easy',
      lc: 'valid-anagram',
      tags: ['frequency'],
      statement: 'Return true if `t` is an anagram of `s`.',
      approaches: [
        {
          name: 'Sort both',
          time: 'O(n log n)',
          space: 'O(n)',
          code: `
            function isAnagram(s, t) {
              return s.length === t.length && [...s].sort().join('') === [...t].sort().join('');
            }
          `,
        },
        {
          name: 'Frequency array',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function isAnagram(s, t) {
              if (s.length !== t.length) return false;
              const count = new Array(26).fill(0);
              for (let i = 0; i < s.length; i++) {
                count[s.charCodeAt(i) - 97]++;
                count[t.charCodeAt(i) - 97]--;
              }
              return count.every((c) => c === 0);
            }
          `,
        },
      ],
      fn: 'isAnagram',
      tests: [
        { args: ['anagram', 'nagaram'], expected: true },
        { args: ['rat', 'car'], expected: false },
        { args: ['ab', 'a'], expected: false },
      ],
    },
    {
      id: 'longest-palindromic-substring',
      title: 'Longest Palindromic Substring',
      difficulty: 'Medium',
      lc: 'longest-palindromic-substring',
      tags: ['expand-around-centre'],
      statement: 'Return the longest palindromic substring of `s`.',
      approaches: [
        {
          name: 'Expand around centre',
          time: 'O(n²)',
          space: 'O(1)',
          idea: 'Every palindrome has a centre — either a character (odd length) or a gap (even length). Expand from each of the 2n − 1 centres.',
          code: `
            function longestPalindrome(s) {
              let start = 0, len = 0;
              const expand = (l, r) => {
                while (l >= 0 && r < s.length && s[l] === s[r]) { l--; r++; }
                if (r - l - 1 > len) { start = l + 1; len = r - l - 1; }
              };
              for (let i = 0; i < s.length; i++) {
                expand(i, i);
                expand(i, i + 1);
              }
              return s.slice(start, start + len);
            }
          `,
        },
      ],
      explanation: "Manacher's algorithm does it in O(n) — worth naming, rarely expected to code.",
      fn: 'longestPalindrome',
      check: (got, [s], t) => got.length === t.len && s.includes(got) && got === [...got].reverse().join(''),
      tests: [
        { args: ['babad'], len: 3 },
        { args: ['cbbd'], len: 2 },
        { args: ['a'], len: 1 },
        { args: ['forgeeksskeegfor'], len: 10 },
      ],
    },
    {
      id: 'longest-common-prefix',
      title: 'Longest Common Prefix',
      difficulty: 'Easy',
      lc: 'longest-common-prefix',
      tags: ['strings'],
      statement: 'Return the longest common prefix among an array of strings.',
      approaches: [
        {
          name: 'Vertical scan',
          time: 'O(total chars)',
          space: 'O(1)',
          code: `
            function longestCommonPrefix(strs) {
              if (!strs.length) return '';
              for (let i = 0; i < strs[0].length; i++) {
                const c = strs[0][i];
                for (const s of strs) if (i >= s.length || s[i] !== c) return strs[0].slice(0, i);
              }
              return strs[0];
            }
          `,
        },
      ],
      fn: 'longestCommonPrefix',
      tests: [
        { args: [['flower', 'flow', 'flight']], expected: 'fl' },
        { args: [['dog', 'racecar', 'car']], expected: '' },
        { args: [['a']], expected: 'a' },
      ],
    },
    {
      id: 'reverse-words',
      title: 'Reverse Words in a String',
      difficulty: 'Medium',
      lc: 'reverse-words-in-a-string',
      tags: ['strings', 'two-pointers'],
      statement: 'Reverse the order of words; collapse multiple spaces and trim.',
      approaches: [
        {
          name: 'Split / filter / reverse',
          time: 'O(n)',
          space: 'O(n)',
          code: `
            function reverseWords(s) {
              return s.trim().split(/\\s+/).reverse().join(' ');
            }
          `,
        },
        {
          name: 'Manual scan from the end',
          time: 'O(n)',
          space: 'O(n)',
          idea: 'What interviewers want if they forbid split: walk right-to-left, collect each word.',
          code: `
            function reverseWords(s) {
              const words = [];
              let i = s.length - 1;
              while (i >= 0) {
                while (i >= 0 && s[i] === ' ') i--;
                if (i < 0) break;
                const end = i;
                while (i >= 0 && s[i] !== ' ') i--;
                words.push(s.slice(i + 1, end + 1));
              }
              return words.join(' ');
            }
          `,
        },
      ],
      fn: 'reverseWords',
      tests: [
        { args: ['the sky is blue'], expected: 'blue is sky the' },
        { args: ['  hello world  '], expected: 'world hello' },
        { args: ['a good   example'], expected: 'example good a' },
      ],
    },
    {
      id: 'string-compression',
      title: 'String Compression (run-length encoding)',
      difficulty: 'Medium',
      lc: 'string-compression',
      tags: ['two-pointers'],
      statement: 'Compress `chars` in place: runs become `char` + count (if > 1). Return the new length.',
      approaches: [
        {
          name: 'Read / write pointers',
          time: 'O(n)',
          space: 'O(1)',
          code: `
            function compress(chars) {
              let write = 0, read = 0;
              while (read < chars.length) {
                const c = chars[read];
                let run = 0;
                while (read < chars.length && chars[read] === c) { read++; run++; }
                chars[write++] = c;
                if (run > 1) for (const d of String(run)) chars[write++] = d;
              }
              return write;
            }
          `,
        },
      ],
      fn: 'compress',
      output: (len, _H, args) => args[0].slice(0, len),
      tests: [
        { args: [['a', 'a', 'b', 'b', 'c', 'c', 'c']], expected: ['a', '2', 'b', '2', 'c', '3'] },
        { args: [['a']], expected: ['a'] },
        { args: [['a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b']], expected: ['a', 'b', '1', '2'] },
      ],
    },
    {
      id: 'kmp-strstr',
      title: 'Find the Index of the First Occurrence (KMP)',
      difficulty: 'Medium',
      lc: 'find-the-index-of-the-first-occurrence-in-a-string',
      tags: ['kmp', 'pattern-matching'],
      statement: 'Return the first index of `needle` in `haystack`, or -1.',
      approaches: [
        {
          name: 'Brute force',
          time: 'O(n·m)',
          space: 'O(1)',
          code: `
            function strStr(haystack, needle) {
              for (let i = 0; i + needle.length <= haystack.length; i++) {
                let j = 0;
                while (j < needle.length && haystack[i + j] === needle[j]) j++;
                if (j === needle.length) return i;
              }
              return -1;
            }
          `,
        },
        {
          name: 'KMP',
          time: 'O(n + m)',
          space: 'O(m)',
          idea: '`lps[i]` = length of the longest proper prefix of `needle[0..i]` that is also a suffix. On mismatch, jump `j = lps[j − 1]` instead of restarting.',
          code: `
            function strStr(haystack, needle) {
              if (needle === '') return 0;
              const lps = new Array(needle.length).fill(0);
              for (let i = 1, len = 0; i < needle.length; ) {
                if (needle[i] === needle[len]) lps[i++] = ++len;
                else if (len) len = lps[len - 1];
                else lps[i++] = 0;
              }
              for (let i = 0, j = 0; i < haystack.length; ) {
                if (haystack[i] === needle[j]) {
                  i++; j++;
                  if (j === needle.length) return i - j;
                } else if (j) j = lps[j - 1];
                else i++;
              }
              return -1;
            }
          `,
        },
      ],
      fn: 'strStr',
      tests: [
        { args: ['sadbutsad', 'sad'], expected: 0 },
        { args: ['leetcode', 'leeto'], expected: -1 },
        { args: ['aaaaab', 'aab'], expected: 3 },
        { args: ['mississippi', 'issip'], expected: 4 },
      ],
    },
  ],
};
