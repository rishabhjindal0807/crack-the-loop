import { useEffect, useState, useCallback } from 'react';
import { allQuestions } from '../data/dsa/index.js';
import { lcStatus } from '../data/leetcode.js';

// Everything personal lives in this browser's localStorage under one key:
//   status     { [id]: 'todo' | 'solved' | 'revise' | 'mastered' }   ← the source of truth from now on
//   touched    { [id]: timestamp }                                     ← last status change, for "recently revised"
//   notes      { [id]: { text, at } }
//   interviews [ { id, company, round, date, tech, question, notes, link, at } ]   ← questions you were asked
//   prep       { ['<opportunity>:<task>']: timestamp }                            ← ticked prep-plan tasks
//   opps       { [opportunityId]: { rounds: [...] } }                              ← your edits to round details
//   oppsLocal  [ { id, company, role, location, source, jd, rounds, at } ]         ← interviews you added yourself
//   done, star — the original v1 maps. Never rewritten or deleted; only read as a fallback,
//                so nothing recorded before the status model is lost.
const KEY = 'prep-progress-v1';

export const STATUSES = [
  { id: 'todo', label: 'To do' },
  { id: 'solved', label: 'Solved' },
  { id: 'revise', label: 'Revise' },
  { id: 'mastered', label: 'Mastered' },
];
const VALID = new Set(STATUSES.map((s) => s.id));

// DSA problems already accepted on LeetCode start out as "solved".
const lcSolved = new Set(allQuestions.filter((q) => lcStatus(q.lc)?.verdict === 'AC').map((q) => q.uid));

function legacyStatus(st, id) {
  if (st.star?.[id]) return 'revise';
  const done = st.done && id in st.done ? Boolean(st.done[id]) : lcSolved.has(id);
  return done ? 'solved' : 'todo';
}
const statusOf = (st, id) => (VALID.has(st.status?.[id]) ? st.status[id] : legacyStatus(st, id));

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

let saveError = null;
function write(next) {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
    saveError = null;
  } catch (e) {
    saveError = e; // private mode / storage full — the UI shows a warning
  }
}

const listeners = new Set();
let state = read();
const emit = () => listeners.forEach((l) => l());
const commit = (next) => {
  state = next;
  write(state);
  emit();
};

// keep several open tabs in sync
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) {
      state = read();
      emit();
    }
  });
}

export const progressStore = {
  get: () => state,
  statusOf: (id) => statusOf(state, id),
  saveError: () => saveError,

  export() {
    return JSON.stringify({ app: 'crack-the-loop', version: 2, exportedAt: new Date().toISOString(), data: state }, null, 2);
  },

  // Merges a backup into what's here: imported values win per item, interviews are merged by id.
  import(text) {
    const parsed = JSON.parse(text);
    const data = parsed && parsed.app === 'crack-the-loop' ? parsed.data : parsed;
    if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('This file is not a Crack the Loop backup.');
    const maps = ['done', 'star', 'status', 'touched', 'notes', 'prep', 'opps'];
    const next = { ...state };
    for (const m of maps) if (data[m] && typeof data[m] === 'object') next[m] = { ...(state[m] || {}), ...data[m] };
    if (Array.isArray(data.interviews)) {
      const byId = new Map((state.interviews || []).map((x) => [x.id, x]));
      for (const x of data.interviews) if (x && x.id) byId.set(x.id, x);
      next.interviews = [...byId.values()];
    }
    if (Array.isArray(data.oppsLocal)) {
      const byId = new Map((state.oppsLocal || []).map((x) => [x.id, x]));
      for (const x of data.oppsLocal) if (x && x.id) byId.set(x.id, x);
      next.oppsLocal = [...byId.values()];
    }
    commit(next);
    const counts = {
      items: Object.keys(data.status || {}).length + Object.keys(data.done || {}).length,
      notes: Object.keys(data.notes || {}).length,
      interviews: (data.interviews || []).length + (data.oppsLocal || []).length,
    };
    return counts;
  },
};

export function useProgress() {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((n) => n + 1);
    listeners.add(l);
    return () => listeners.delete(l);
  }, []);

  const setStatus = useCallback((id, s) => {
    commit({
      ...state,
      status: { ...(state.status || {}), [id]: s },
      touched: { ...(state.touched || {}), [id]: Date.now() },
    });
  }, []);

  const setNote = useCallback((id, text) => {
    const notes = { ...(state.notes || {}) };
    if (text.trim()) notes[id] = { text, at: Date.now() };
    else delete notes[id];
    commit({ ...state, notes });
  }, []);

  const saveInterview = useCallback((entry) => {
    const list = [...(state.interviews || [])];
    const i = list.findIndex((x) => x.id === entry.id);
    const item = { ...entry, at: Date.now() };
    if (i >= 0) list[i] = item;
    else list.unshift(item);
    commit({ ...state, interviews: list });
  }, []);

  const removeInterview = useCallback((id) => {
    commit({ ...state, interviews: (state.interviews || []).filter((x) => x.id !== id) });
  }, []);

  const togglePrep = useCallback((key) => {
    const prep = { ...(state.prep || {}) };
    if (prep[key]) delete prep[key];
    else prep[key] = Date.now();
    commit({ ...state, prep });
  }, []);

  const saveOppRounds = useCallback((id, rounds) => {
    commit({ ...state, opps: { ...(state.opps || {}), [id]: { ...((state.opps || {})[id] || {}), rounds } } });
  }, []);

  const saveOppLocal = useCallback((o) => {
    const list = [...(state.oppsLocal || [])];
    const i = list.findIndex((x) => x.id === o.id);
    if (i >= 0) list[i] = { ...o, at: Date.now() };
    else list.unshift({ ...o, at: Date.now() });
    commit({ ...state, oppsLocal: list });
  }, []);

  const removeOppLocal = useCallback((id) => {
    commit({ ...state, oppsLocal: (state.oppsLocal || []).filter((x) => x.id !== id) });
  }, []);

  const status = (id) => statusOf(state, id);
  return {
    status,
    setStatus,
    isDone: (id) => status(id) !== 'todo',
    isRevise: (id) => status(id) === 'revise',
    // list checkbox: todo ↔ solved (a Revise / Mastered item goes back to To do)
    toggleDone: (id) => setStatus(id, status(id) === 'todo' ? 'solved' : 'todo'),
    doneCount: (ids) => ids.filter((id) => status(id) !== 'todo').length,
    countBy: (ids, s) => ids.filter((id) => status(id) === s).length,
    touchedAt: (id) => state.touched?.[id] || 0,
    note: (id) => state.notes?.[id]?.text || '',
    notes: () => state.notes || {},
    setNote,
    interviews: () => state.interviews || [],
    saveInterview,
    removeInterview,
    prepDone: (key) => Boolean(state.prep?.[key]),
    togglePrep,
    oppRounds: (id) => state.opps?.[id]?.rounds,
    saveOppRounds,
    oppsLocal: () => state.oppsLocal || [],
    saveOppLocal,
    removeOppLocal,
    // kept so older call sites keep working
    isStarred: (id) => status(id) === 'revise',
    toggleStar: (id) => setStatus(id, status(id) === 'revise' ? 'solved' : 'revise'),
  };
}
