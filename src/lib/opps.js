import { opportunities, genericReady } from '../data/opportunities.js';

// All interview processes: the ones written up in the repo (with your edits to their rounds)
// plus the ones you added on the site.
export function allOpps(p) {
  const committed = opportunities.map((o) => ({ ...o, rounds: p.oppRounds(o.id) || o.rounds, tailored: true }));
  const local = p.oppsLocal().map((o) => ({ ...o, rounds: o.rounds || [], tailored: false, local: true }));
  return [...committed, ...local];
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export function daysUntil(date) {
  if (!date) return null;
  const [y, m, d] = date.split('-').map(Number);
  return Math.round((startOfDay(new Date(y, m - 1, d)) - startOfDay(new Date())) / 86400000);
}

export function whenLabel(date, time) {
  if (!date) return 'Date not set';
  const n = daysUntil(date);
  const day = new Date(date + 'T00:00').toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const rel = n === 0 ? 'today' : n === 1 ? 'tomorrow' : n === -1 ? 'yesterday' : n > 1 ? `in ${n} days` : `${-n} days ago`;
  return `${day}${time ? `, ${time}` : ''} (${rel})`;
}

// The next round that hasn't happened yet (or the last one, if all are done).
export function nextRound(o) {
  const upcoming = o.rounds.filter((r) => r.result === 'upcoming');
  upcoming.sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
  return upcoming[0] || null;
}

export const RESULTS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'waiting', label: 'Done, waiting for result' },
  { id: 'passed', label: 'Cleared' },
  { id: 'rejected', label: 'Not selected' },
];
export const resultLabel = Object.fromEntries(RESULTS.map((r) => [r.id, r.label]));

// Every tickable prep task for an interview → key used in the progress store.
export function prepTasks(o) {
  if (o.tailored) {
    return [
      ...o.plan.flatMap((d) => d.items.map((it) => `${o.id}:${it.id}`)),
      ...o.ready.map((_, i) => `${o.id}:ready-${i}`),
    ];
  }
  return genericReady.map((_, i) => `${o.id}:g-${i}`);
}

export function overallState(o) {
  if (o.rounds.some((r) => r.result === 'rejected')) return 'Closed';
  if (nextRound(o)) return 'In progress';
  if (o.rounds.length && o.rounds.every((r) => r.result === 'passed')) return 'All rounds cleared';
  if (o.rounds.some((r) => r.result === 'waiting')) return 'Waiting for result';
  return 'In progress';
}
