import { useEffect, useState, useCallback } from 'react';
import { allQuestions } from '../data/dsa/index.js';
import { lcStatus } from '../data/leetcode.js';

// DSA problems already accepted on LeetCode start out as "done" (you can still untick them).
const lcSolved = new Set(allQuestions.filter((q) => lcStatus(q.lc)?.verdict === 'AC').map((q) => q.uid));
const doneValue = (st, id) => (st.done && id in st.done ? Boolean(st.done[id]) : lcSolved.has(id));

// Progress (done / starred) lives in this browser's localStorage only.
const KEY = 'prep-progress-v1';

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function write(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — progress just won't persist */
  }
}

const listeners = new Set();
let state = read();

export function useProgress() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);

  const toggle = useCallback((kind, id) => {
    const bucket = { ...(state[kind] || {}) };
    if (kind === 'done') bucket[id] = doneValue(state, id) ? 0 : Date.now(); // explicit 0 = unticked
    else if (bucket[id]) delete bucket[id];
    else bucket[id] = Date.now();
    state = { ...state, [kind]: bucket };
    write(state);
    listeners.forEach((l) => l());
  }, []);

  return {
    isDone: (id) => doneValue(state, id),
    isStarred: (id) => Boolean(state.star?.[id]),
    toggleDone: (id) => toggle('done', id),
    toggleStar: (id) => toggle('star', id),
    doneCount: (ids) => ids.filter((id) => doneValue(state, id)).length,
  };
}
