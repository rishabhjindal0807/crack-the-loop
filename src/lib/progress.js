import { useEffect, useState, useCallback } from 'react';

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
    if (bucket[id]) delete bucket[id];
    else bucket[id] = Date.now();
    state = { ...state, [kind]: bucket };
    write(state);
    listeners.forEach((l) => l());
  }, []);

  return {
    isDone: (id) => Boolean(state.done?.[id]),
    isStarred: (id) => Boolean(state.star?.[id]),
    toggleDone: (id) => toggle('done', id),
    toggleStar: (id) => toggle('star', id),
    doneCount: (ids) => ids.filter((id) => state.done?.[id]).length,
  };
}
