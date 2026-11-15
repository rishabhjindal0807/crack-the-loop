// Runs a solution's JS source against its test cases. Shared by the browser "Run tests" button
// and by scripts/test-solutions.mjs (which checks every approach of every problem before deploy).
import { ListNode, TreeNode, H } from './helpers.js';

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

function canon(v, mode) {
  if (mode === 'unordered' && Array.isArray(v)) {
    return JSON.stringify(v.map((x) => JSON.stringify(x)).sort());
  }
  if (mode === 'nested-unordered' && Array.isArray(v)) {
    const inner = (x) => (Array.isArray(x) ? JSON.stringify([...x].sort((a, b) => (a > b ? 1 : a < b ? -1 : 0))) : JSON.stringify(x));
    return JSON.stringify(v.map(inner).sort());
  }
  if (mode === 'float' && typeof v === 'number') return v.toFixed(5);
  return JSON.stringify(v);
}

export function loadFn(code, fn) {
  // eslint-disable-next-line no-new-func
  return new Function('ListNode', 'TreeNode', `"use strict";\n${code}\n;return ${fn};`)(ListNode, TreeNode);
}

export function runTests(q, code) {
  const results = [];
  let impl;
  try {
    impl = loadFn(code, q.fn);
  } catch (e) {
    return [{ ok: false, label: 'compile', got: String(e), expected: '' }];
  }
  for (const [i, t] of (q.tests || []).entries()) {
    const label = t.label || `Test ${i + 1}`;
    try {
      let got;
      if (q.kind === 'class') {
        // LeetCode-style design problems: ops[0] is the constructor
        const [, ...ops] = t.ops;
        const [ctorArgs, ...opArgs] = t.args;
        const obj = new impl(...clone(ctorArgs));
        got = [null, ...ops.map((op, k) => {
          const r = obj[op](...clone(opArgs[k]));
          return r === undefined ? null : r;
        })];
      } else {
        const args = q.input ? q.input(clone(t.args), H) : clone(t.args);
        got = impl(...args);
        if (q.output) got = q.output(got, H, args);
      }
      const ok = q.check ? q.check(got, clone(t.args), t, impl) : canon(got, q.compare) === canon(t.expected, q.compare);
      results.push({ ok, label, got, expected: q.check ? '(validated by checker)' : t.expected, args: t.args });
    } catch (e) {
      results.push({ ok: false, label, got: `Error: ${e.message}`, expected: t.expected, args: t.args });
    }
  }
  return results;
}
