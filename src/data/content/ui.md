---
id: ui
title: UI / Frontend
icon: 🎨
tagline: JavaScript, React 18, TypeScript, Angular/RxJS, performance, accessibility and frontend system design — mapped to your resume.
---

::: resume
- **OptimaAI (React 18 + TypeScript):** company search, AI chat, tool configuration, analytics dashboards and **PDF export** modules; the **citation UI** that links every marker in an AI answer to a source panel.
- **Yubi:** B2B loan marketplace, **Loan Management System** with role-based access used by 50+ lenders, **early-risk dashboards** (Recharts + Redux), borrower homepage revamp → **+25% interaction in a month**.
- **Publicis Sapient / Verizon (Angular 9):** reworked LTE/5G order flows → **+10% conversion**; **Nx monorepo** component libraries; **RxJS** stream optimisation to cut redundant API calls; **WCAG 2.1** compliance; led 4 devs.
- **TCS:** Carnival itinerary system with **AG Grid** Excel-like editing; Deutsche Bank portfolio management.

Have a 2-minute story ready for each bolded metric: *problem → what you did → measurable result → what you'd do differently.*

> **Note:** answers tagged **From resume** are suggested framings built from your resume. Where they give specifics (which library, which incident, which numbers), swap in what actually happened. Never claim a detail you can't back up.
:::

# JavaScript fundamentals {#js}
The questions every frontend loop starts with. Be precise with vocabulary.

## Explain the event loop. What's the output of this snippet? [Core]
JS runs on a single thread with a **call stack**. Async work is handed to the host (browser / Node), and callbacks come back through queues:

- **Microtask queue** — promise reactions (`.then`, `await` continuations), `queueMicrotask`, `MutationObserver`.
- **Macrotask (task) queue** — `setTimeout`, `setInterval`, I/O, UI events, `MessageChannel`.

**Algorithm:** run one task → drain **all** microtasks → (browser may render: rAF, style, layout, paint) → next task.

```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
(async () => {
  console.log('4');
  await null;
  console.log('5');
})();
console.log('6');
// 1 4 6 3 5 2
```

`4` prints synchronously (an async function runs synchronously until its first `await`). `3` and `5` are microtasks queued in that order; `2` is a macrotask. A microtask that keeps queueing microtasks **starves rendering** — that is why long promise chains can freeze the UI.

## What is a closure? Give a practical use and a classic bug. [Core]
A closure is a function bundled with references to the variables of the scope it was **created** in — those variables stay alive as long as the function does.

Uses: data privacy/module pattern, memoisation, `debounce`, React hooks (every render's handlers close over that render's state).

Classic bug — `var` is function-scoped, so all callbacks share one `i`:

```js
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 3 3 3
for (let i = 0; i < 3; i++) setTimeout(() => console.log(i)); // 0 1 2 — new binding per iteration
```

React flavour: a **stale closure** — `setInterval(() => setCount(count + 1), 1000)` inside `useEffect(..., [])` always sees `count = 0`. Fix with the functional updater `setCount(c => c + 1)` or a ref.

## How does `this` work? Compare call, apply and bind. [Core]
`this` is decided by **how a function is called**, not where it's defined (except arrow functions):

| Call site | `this` |
|---|---|
| `obj.fn()` | `obj` |
| `fn()` | `undefined` in strict mode (global object in sloppy) |
| `new Fn()` | the new instance |
| `fn.call(x, a, b)` / `fn.apply(x, [a, b])` | `x` |
| `fn.bind(x)` | returns a new function permanently bound to `x` |
| Arrow function | inherits `this` lexically from the enclosing scope |

```js
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  function bound(...args) {
    // called with `new` → ignore ctx and use the new instance
    return fn.apply(this instanceof bound ? this : ctx, [...preset, ...args]);
  }
  bound.prototype = Object.create(fn.prototype); // so `new bound()` instances inherit from fn
  return bound;
};
```

## Prototypes vs classes — what does `class` actually do? [Core]
`class` is syntax over prototypal inheritance. Methods go on `Ctor.prototype`; instances link to it via `[[Prototype]]` (`Object.getPrototypeOf(obj)`). Property lookup walks the chain until `null`.

Differences from old constructor functions: class bodies are strict mode, classes aren't hoisted (TDZ), must be called with `new`, methods are non-enumerable, and `extends` sets up both instance and static chains. Private fields `#x` are truly private (not on the prototype, not reflectable).

## var vs let vs const, hoisting and the Temporal Dead Zone [Core]
- `var`: function-scoped, hoisted and initialised to `undefined`, can be redeclared.
- `let`/`const`: block-scoped, hoisted but **uninitialised** until the declaration runs — accessing earlier throws `ReferenceError` (the TDZ).
- `const` prevents **rebinding**, not mutation (`const a = []; a.push(1)` is fine). Use `Object.freeze` for shallow immutability.
- Function declarations are hoisted with their body; function expressions follow their variable's rules.

## Promises: states, chaining, and the combinators [Core]
A promise is `pending` → `fulfilled` | `rejected` (settled once). `.then` returns a **new** promise, so returning a value/promise from a handler chains; throwing rejects.

| Combinator | Fulfils when | Rejects when |
|---|---|---|
| `Promise.all` | all inputs fulfil (array of values, input order) | as soon as **any** input rejects |
| `Promise.allSettled` | all inputs settle (array of `{status, value \| reason}`) | never |
| `Promise.race` | the **first input to settle** fulfils | the first input to settle rejects |
| `Promise.any` | the first input fulfils | all inputs reject (`AggregateError`) |

`async/await` is sugar over promises — wrap with `try/catch`, and remember `await` in a `for` loop is **sequential**; use `Promise.all(items.map(fn))` for parallel, or a concurrency limiter for many requests.

## Explain event delegation, bubbling and capturing [Core]
Events go **capture** (window → target) → **target** → **bubble** (target → window). `addEventListener(type, fn, { capture: true })` listens in the capture phase.

**Delegation:** attach one listener to a parent and use `event.target.closest('li')` to find the item. Fewer listeners, works for dynamically added children. `stopPropagation()` stops further propagation; `preventDefault()` cancels the default action (they're unrelated). React attaches listeners at the root container and dispatches synthetic events — effectively delegation.

## == vs ===, and other coercion gotchas [Core]
`===` compares without coercion. `==` coerces (`'1' == 1`, `null == undefined`, `[] == false`). Only common sane use of `==` is `x == null` (null or undefined).

Other gotchas: `typeof null === 'object'`, `NaN !== NaN` (use `Number.isNaN`), `0.1 + 0.2 !== 0.3` (use integers in minor units for money — relevant in FinTech!), `[10, 9, 1].sort()` → `[1, 10, 9]`.

# Machine coding & polyfills {#coding}
Write these from memory — they come up constantly in frontend rounds.

## Implement debounce and throttle [Coding]
**Debounce** — run after the user *stops* triggering for `wait` ms (search input, resize). **Throttle** — run at most once per `wait` ms (scroll, mousemove).

```js
function debounce(fn, wait) {
  let t;
  const d = function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
  d.cancel = () => clearTimeout(t);
  return d;
}

function throttle(fn, wait) {
  let last = 0, timer = null, pending;
  return function (...args) {
    const now = Date.now();
    pending = args;
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      // trailing call so the final position isn't lost
      timer = setTimeout(() => {
        last = Date.now();
        timer = null;
        fn.apply(this, pending);
      }, wait - (now - last));
    }
  };
}
```

In React, create the debounced function once (`useMemo`/`useRef`) and cancel it in the effect cleanup.

## Polyfill Promise.all [Coding]
```js
function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const items = Array.from(iterable);
    const results = new Array(items.length);
    let remaining = items.length;
    if (remaining === 0) return resolve(results);
    items.forEach((item, i) => {
      Promise.resolve(item).then((value) => {
        results[i] = value;            // keep input order
        if (--remaining === 0) resolve(results);
      }, reject);                       // first rejection wins
    });
  });
}
```
Key points the interviewer checks: preserves order, handles non-promise values (`Promise.resolve`), empty input resolves immediately, rejects fast.

## Run async tasks with a concurrency limit [Coding]
Useful for bulk uploads / fetching many documents without overwhelming the API.

```js
async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function lane() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, lane));
  return results;
}
```

## Retry a fetch with exponential backoff and timeout [Coding]
```js
async function fetchWithRetry(url, { retries = 3, base = 300, timeout = 5000, ...opts } = {}) {
  for (let attempt = 0; ; attempt++) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeout);
    try {
      const res = await fetch(url, { ...opts, signal: ctrl.signal });
      if (res.status >= 500 && attempt < retries) throw new Error('retryable ' + res.status);
      return res;
    } catch (err) {
      if (attempt >= retries) throw err;
      const delay = base * 2 ** attempt + Math.random() * base; // jitter avoids thundering herd
      await new Promise((r) => setTimeout(r, delay));
    } finally {
      clearTimeout(timer);
    }
  }
}
```
Only retry **idempotent** requests (GET, or POST with an idempotency key) — ties nicely into backend design.

## Implement an EventEmitter (pub/sub) [Coding]
```js
class EventEmitter {
  #events = new Map();
  on(evt, fn) {
    if (!this.#events.has(evt)) this.#events.set(evt, new Set());
    this.#events.get(evt).add(fn);
    return () => this.off(evt, fn); // unsubscribe handle
  }
  once(evt, fn) {
    const off = this.on(evt, (...a) => { off(); fn(...a); });
    return off;
  }
  off(evt, fn) { this.#events.get(evt)?.delete(fn); }
  emit(evt, ...args) {
    [...(this.#events.get(evt) || [])].forEach((fn) => fn(...args)); // copy: handlers may unsubscribe
  }
}
```

## Deep clone, deep equal and flatten [Coding]
```js
// structuredClone(obj) is the modern built-in (handles Date, Map, Set, cycles; not functions/DOM).
function deepClone(v, seen = new WeakMap()) {
  if (v === null || typeof v !== 'object') return v;
  if (seen.has(v)) return seen.get(v);              // cycles
  if (v instanceof Date) return new Date(v);
  const out = Array.isArray(v) ? [] : Object.create(Object.getPrototypeOf(v));
  seen.set(v, out);
  for (const k of Reflect.ownKeys(v)) out[k] = deepClone(v[k], seen);
  return out;
}

function deepEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
  const ka = Object.keys(a), kb = Object.keys(b);
  return ka.length === kb.length && ka.every((k) => deepEqual(a[k], b[k]));
}

const flatten = (arr, depth = Infinity) =>
  arr.reduce((acc, x) => acc.concat(Array.isArray(x) && depth > 0 ? flatten(x, depth - 1) : x), []);
```

## Implement memoize and curry [Coding]
```js
function memoize(fn, key = (...a) => JSON.stringify(a)) {
  const cache = new Map();
  return function (...args) {
    const k = key(...args);
    if (!cache.has(k)) cache.set(k, fn.apply(this, args));
    return cache.get(k);
  };
}

function curry(fn) {
  return function curried(...args) {
    return args.length >= fn.length ? fn.apply(this, args) : (...more) => curried.apply(this, [...args, ...more]);
  };
}
// curry((a, b, c) => a + b + c)(1)(2)(3) === 6
```

## Build a typeahead / autocomplete component (React) [Coding]
```tsx
function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function CompanySearch() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Company[]>([]);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(q);

  useEffect(() => {
    setActive(-1);                                    // new results → reset highlight
    if (!debounced) { setItems([]); return; }
    const ctrl = new AbortController();               // cancel stale requests
    fetch(`/api/companies?q=${encodeURIComponent(debounced)}`, { signal: ctrl.signal })
      .then((r) => r.json()).then(setItems).catch(() => {});
    return () => ctrl.abort();
  }, [debounced]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') setActive((i) => Math.min(i + 1, items.length - 1));
    if (e.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0));
    if (e.key === 'Enter' && items[active]) select(items[active]);
  };

  return (
    <div>
      {/* ARIA 1.2 combobox: the role goes on the input itself */}
      <input role="combobox" aria-expanded={items.length > 0} aria-controls="results"
             aria-autocomplete="list" aria-activedescendant={active >= 0 ? `opt-${active}` : undefined}
             value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown} />
      <ul id="results" role="listbox">
        {items.map((c, i) => (
          <li key={c.id} id={`opt-${i}`} role="option" aria-selected={i === active}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}
```
Talk through: debounce, **race conditions** (abort), caching recent queries, highlighting the match, empty/loading/error states, ARIA combobox pattern — this mirrors the company-search module in OptimaAI.

# React 18 {#react}

## How does reconciliation work and why do keys matter? [Core]
On every render React builds a new element tree and **diffs** it against the previous fiber tree. Heuristics make it O(n): different element **type** ⇒ unmount the subtree and mount fresh; same type ⇒ update props and recurse; for lists, children are matched by **key**.

Keys must be **stable and unique among siblings**. Using the array index breaks when items are inserted/reordered: React reuses the wrong component instance, so local state (input text, focus) "moves" to another row. Changing a key on purpose is a clean way to **reset** a component's state.

The **Fiber** architecture splits rendering into interruptible units of work (render phase, can be paused) and a synchronous **commit** phase (DOM mutations, layout effects).

## What changed in React 18? (concurrent rendering) [Deep dive]
- **`createRoot`** opts into concurrent features.
- **Automatic batching** — state updates inside promises, timeouts and native handlers are batched (previously only inside React events). Use `flushSync` to opt out.
- **Transitions** — `startTransition` / `useTransition` mark updates as non-urgent, so typing stays responsive while a heavy list re-renders; `isPending` lets you show a spinner.
- **`useDeferredValue`** — render with a lagging copy of a value (great for filtering big tables).
- **Suspense** on the server: streaming SSR with selective hydration. Suspense for data fetching works through frameworks/libraries (Next.js, React Query's suspense mode), not a built-in fetch API.
- **New hooks:** `useId` (SSR-safe ids for ARIA), `useSyncExternalStore` (tear-free subscriptions — what Redux/Zustand use), `useInsertionEffect` (CSS-in-JS).
- StrictMode in dev **double-invokes** effects (mount → unmount → mount) to surface missing cleanups.

```jsx
const [isPending, startTransition] = useTransition();
const onChange = (e) => {
  setQuery(e.target.value);                         // urgent
  startTransition(() => setFilter(e.target.value)); // can be interrupted
};
```

## useEffect vs useLayoutEffect, dependencies and cleanup [Core]
- `useEffect` usually runs **after paint** — data fetching, subscriptions, logging. (For discrete input like a click, React 18 may flush it before paint.)
- `useLayoutEffect` runs after DOM mutation but **before paint** — measuring DOM / preventing flicker (tooltip positioning). It blocks painting, so keep it small.
- The dependency array is compared with `Object.is`. Missing deps ⇒ stale closures; objects/functions created during render ⇒ the effect runs every render.
- The **cleanup** runs before the next effect and on unmount — abort fetches, clear timers, unsubscribe.

You might not need an effect: derive values during render, handle user events in handlers, and reset state with a `key` instead of syncing props to state.

## When do useMemo, useCallback and React.memo actually help? [Core]
They're **referential stability** tools, not free performance:

- `React.memo(Comp)` skips re-rendering when props are shallow-equal.
- `useCallback(fn, deps)` / `useMemo(() => obj, deps)` keep the same reference between renders so a memoised child (or an effect dependency) doesn't see a "new" prop.
- `useMemo` also caches genuinely expensive computations (sorting/aggregating thousands of loan rows for a chart).

Measure first with the React Profiler. Often better fixes: **move state down** to the component that needs it, **lift content up** (pass children), split contexts, or virtualise long lists. (The React Compiler, a separate build-time tool, now automates most of this memoisation.)

## Context API — performance pitfalls and alternatives [Core]
Every consumer re-renders when the context **value** changes. A provider with `value={{ user, setUser }}` creates a new object each render ⇒ all consumers re-render.

Mitigations: `useMemo` the value, **split** contexts (state vs dispatch, or by domain), keep fast-changing state out of context, or use a store with **selectors** (Zustand / Redux `useSelector`) so components only re-render when their slice changes. Context is great for low-frequency values: theme, auth user, permissions, locale.

## Redux vs Zustand vs React Query vs Context — how do you choose? [From resume]
Separate **server state** from **client state**:

- **Server state** (lists, entities fetched from APIs — company data, CAM versions): React Query / RTK Query. You get caching, deduping, background refetch, retries, optimistic updates, pagination.
- **Global client state:**
  - **Redux / Redux Toolkit** — large teams, strict conventions, devtools/time-travel, middleware. Your resume ties Redux to the Yubi LMS early-risk dashboards.
  - **Zustand** — tiny API, no providers, selector-based subscriptions. It's on your resume; be ready to say where you used it and why.
  - **Context** — rarely-changing values.
- **Local UI state** — `useState`/`useReducer`.

Rule: don't put server data in Redux by hand — you end up re-implementing a cache badly.

## Write a custom hook for data fetching with cancellation [Coding]
```tsx
type State<T> = { data?: T; error?: Error; loading: boolean };

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<State<T>>({ loading: !!url });
  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true }));
    fetch(url, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((data) => setState({ data, loading: false }))
      .catch((error) => { if (error.name !== 'AbortError') setState({ error, loading: false }); });
    return () => ctrl.abort();      // prevents setState on unmounted / stale responses
  }, [url]);
  return state;
}
```

## How do you stream an LLM response into a chat UI? [From resume]
The backend (FastAPI) returns **Server-Sent Events** or a chunked `text/event-stream`. On the client, read the stream incrementally:

```ts
const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message }), signal });
const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
let buffer = '';
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  buffer += value;
  const events = buffer.split('\n\n');
  buffer = events.pop()!;                       // keep the partial event
  for (const e of events) {
    const data = JSON.parse(e.replace(/^data: /, ''));
    if (data.type === 'token') appendToken(data.text);
    if (data.type === 'tool_call') showToolStatus(data.name);   // "Fetching financials…"
    if (data.type === 'citation') registerCitation(data);       // [1] → source panel
  }
}
```

UI concerns: append tokens to a ref and flush with `requestAnimationFrame` to avoid re-rendering per token; render markdown incrementally; keep a **Stop** button (AbortController); auto-scroll only if the user is at the bottom; announce completion to screen readers with `aria-live="polite"`.

## Error boundaries and Suspense [Core]
**Error boundaries** (class components with `getDerivedStateFromError` / `componentDidCatch`, or `react-error-boundary`) catch errors during render/lifecycle of their subtree and show a fallback. They do **not** catch errors in event handlers, async code or SSR — handle those with try/catch and state.

**Suspense** shows a fallback while children "suspend" (lazy components, data via frameworks/React Query's suspense mode). Place boundaries around independent regions — e.g. each dashboard widget — so one slow chart doesn't blank the page.

## Controlled vs uncontrolled components; building large forms [Core]
Controlled: React state is the source of truth (`value` + `onChange`) — easy validation, but every keystroke re-renders. Uncontrolled: the DOM holds the value (`ref`, `defaultValue`) — fewer renders.

Large forms (loan origination, tool configuration): **React Hook Form** (uncontrolled under the hood, subscribes per field) + **Zod** schema shared with TypeScript types. Field-level validation on blur, form-level on submit, server errors mapped back to fields, and dirty-state warnings on navigation.

## Server Components, SSR, SSG and CSR — trade-offs [Deep dive]
- **CSR** — SPA (what OptimaAI is): simple hosting, rich interactivity, slower first paint and weaker SEO. Fine for authenticated B2B apps.
- **SSR** — HTML per request: faster FCP/LCP, SEO, but server cost and hydration cost.
- **SSG/ISR** — pre-rendered at build/revalidated: fastest, for marketing/docs pages.
- **React Server Components** — components that run only on the server, ship **zero JS**, can read data directly; client components (`'use client'`) handle interactivity. Reduces bundle size; requires a framework (Next.js App Router).

For a public borrower homepage SSR/SSG helps SEO and LCP; for an internal credit-analyst workspace CSR + code splitting is usually right.

# TypeScript {#typescript}

## interface vs type, any vs unknown vs never [Core]
- `interface` — object shapes, can be **extended and merged** (declaration merging; good for public library APIs). `type` — aliases for anything: unions, tuples, mapped/conditional types.
- `any` disables checking. `unknown` is the type-safe top type — you must narrow before use (perfect for `JSON.parse` / API responses). `never` is the empty type — used for exhaustiveness checks and impossible branches.

```ts
function assertNever(x: never): never { throw new Error('Unexpected ' + x); }
```

## Discriminated unions and narrowing [Core]
```ts
type ToolEvent =
  | { type: 'token'; text: string }
  | { type: 'tool_call'; name: string; args: Record<string, unknown> }
  | { type: 'citation'; id: string; source: { table: string; row: number } };

function handle(e: ToolEvent) {
  switch (e.type) {
    case 'token': return append(e.text);        // e is narrowed to the token variant
    case 'tool_call': return showTool(e.name);
    case 'citation': return addCitation(e);
    default: return assertNever(e);              // compile error if a new variant is unhandled
  }
}
```
Other narrowing: `typeof`, `instanceof`, `in`, user-defined guards (`(x): x is Foo => ...`), assertion functions.

## Generics, constraints and utility types [Core]
```ts
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((i) => i[key]);
}
```
Built-ins to know: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`.

```ts
// Mapped + conditional types
type Nullable<T> = { [K in keyof T]: T[K] | null };
type ApiResponse<T> = T extends any[] ? { items: T; total: number } : { item: T };
type Permissions = `${'read' | 'write'}:${'cam' | 'company'}`; // template literal types
```

## How do you share types between a Python backend and a TS frontend? [From resume]
Generate them rather than hand-write: FastAPI publishes an **OpenAPI** schema from Pydantic models → `openapi-typescript` (or orval) generates TS types and a typed client in CI. Drift becomes a compile error. For runtime safety at the boundary, validate untrusted responses with **Zod** (or generate Zod schemas too).

# Angular & RxJS {#angular}

## How does Angular change detection work? Default vs OnPush, zone.js and signals [Core]
**zone.js** monkey-patches async APIs (events, timers, XHR) and tells Angular "something may have changed" → it checks the component tree top-down.

- **Default** strategy: every component is checked on every cycle.
- **OnPush**: a component is checked only when an `@Input` reference changes, an event fires inside it, an `async` pipe emits, or you call `markForCheck()`. Pairs naturally with immutable data and observables.
- **Signals** (v16+): fine-grained reactivity — `signal()`, `computed()`, `effect()`. Angular knows exactly which views depend on which signals, enabling **zoneless** apps.

Perf toolkit: OnPush everywhere, `trackBy` in `*ngFor` (or `@for ... track`), pure pipes instead of template method calls, `runOutsideAngular` for high-frequency events.

## switchMap vs mergeMap vs concatMap vs exhaustMap [Core]
All map each outer value to an inner observable; they differ in **what happens to the previous inner one**:

| Operator | Behaviour | Use for |
|---|---|---|
| `switchMap` | cancels previous inner | typeahead search, route param → fetch |
| `mergeMap` | runs all concurrently | independent parallel requests |
| `concatMap` | queues, one at a time in order | sequential saves that must not reorder |
| `exhaustMap` | ignores new values while busy | login / submit button double-clicks |

```ts
this.results$ = this.query.valueChanges.pipe(
  debounceTime(300),
  map((q) => q.trim()),
  distinctUntilChanged(),
  filter((q) => q.length > 1),
  switchMap((q) => this.api.search(q).pipe(catchError(() => of([])))),
);
```

## How did you remove unnecessary API calls with RxJS? [From resume]
*Example framing — adapt it to what actually happened on the Verizon order flow.* A typical cause: several components request the same device/plan data and re-fire on every form change. The fixes:

- **Share** one request across subscribers: `shareReplay({ bufferSize: 1, refCount: true })` on a service-level observable (a cached stream per key).
- `debounceTime` + `distinctUntilChanged` on form value streams so only meaningful changes trigger calls.
- `switchMap` to cancel in-flight requests when the user changed selection.
- `combineLatest` to derive view models from existing streams instead of fetching again.
- Unsubscribe correctly (`async` pipe / `takeUntilDestroyed`) to stop leaked subscriptions from firing duplicates.

Quantify it if you can: "cut duplicate calls on the configurator page from N to 1".

## Subject vs BehaviorSubject vs ReplaySubject vs AsyncSubject [Core]
- `Subject` — multicast, no initial value; late subscribers miss past emissions (event bus).
- `BehaviorSubject` — requires an initial value, replays the **latest** to new subscribers (current state, e.g. selected plan).
- `ReplaySubject(n)` — replays the last n values (cache).
- `AsyncSubject` — emits only the last value on complete.

Hot vs cold: HTTP observables are **cold** (each subscription triggers a request) — that is why `shareReplay` matters.

## How do you avoid memory leaks with subscriptions? [Core]
Prefer the `async` pipe (auto-unsubscribes). In code: `takeUntilDestroyed(this.destroyRef)` (v16+) or the `takeUntil(this.destroy$)` pattern; `first()`/`take(1)` for one-shot values. Also remove manual DOM listeners and clear intervals in `ngOnDestroy`.

## NgRx — when is it worth it and how does data flow? [Core]
Component dispatches an **action** → **reducer** (pure) computes new state → **selectors** (memoised) feed components → **effects** handle side effects (API calls) and dispatch success/failure actions. Worth it for large apps with shared, complex state and many contributors; overkill for CRUD screens — use component stores or signals there.

## Building reusable component libraries in an Nx monorepo [From resume]
- Structure: `libs/ui` (presentational, no business logic), `libs/feature-*`, `libs/data-access`, `apps/*`. Enforce boundaries with Nx **tags + lint rules** (`feature` can depend on `ui`, never the reverse).
- **Affected** commands (`nx affected -t test build`) + computation caching keep CI fast as the repo grows.
- Library API: small, composable components, theming via CSS variables/design tokens, accessibility built in, Storybook for docs and visual tests.
- Versioning: in a monorepo everything moves together; publish to a registry only if consumed outside.

# Browser, performance & rendering {#performance}

## Walk through the critical rendering path [Core]
HTML → **DOM**; CSS → **CSSOM** (render-blocking); DOM + CSSOM → **render tree** → **layout** (geometry) → **paint** → **composite** layers on the GPU.

- `<script>` blocks parsing unless `defer` (run after parse, in order) or `async` (run when ready, any order).
- **Reflow** (layout) is triggered by geometry changes; **repaint** by visual-only changes. Animating `transform`/`opacity` skips both (compositor only).
- **Layout thrashing:** reading layout (`offsetHeight`) after writing styles in a loop forces synchronous reflows — batch reads, then writes (or use rAF).

## Core Web Vitals and how you'd improve each [Core]
| Metric | Good | Improve with |
|---|---|---|
| **LCP** (largest contentful paint) | ≤ 2.5 s | preload hero image/fonts, SSR/SSG, CDN, compress images (AVIF/WebP), remove render-blocking CSS |
| **INP** (interaction to next paint) | ≤ 200 ms | break up long tasks, `startTransition`, web workers, less JS, avoid heavy re-renders |
| **CLS** (layout shift) | ≤ 0.1 | reserve space (width/height, aspect-ratio), no late-injected banners, `font-display` |

Measure in the field (RUM via `web-vitals`) not just Lighthouse. For the borrower homepage revamp, tie improvements to the +25% interaction metric.

## How do you render 50,000 rows / an Excel-like grid smoothly? [From resume]
- **Virtualisation / windowing** — only render visible rows (+ overscan): `react-window`, TanStack Virtual, or AG Grid's built-in row & column virtualisation (Carnival itinerary grid).
- **Server-side** pagination/sorting/filtering (AG Grid server-side row model) for very large data.
- Memoise row components, stable keys, avoid inline object props.
- Batch edits; debounce autosave; use immutable updates keyed by row id (`getRowId`) so the grid diffs instead of re-rendering everything.
- Heavy aggregations in a **web worker**.

## Code splitting, lazy loading and bundle optimisation [Core]
- Route-level `React.lazy(() => import('./CamEditor'))` + `Suspense`; component-level for heavy widgets (PDF viewer, charts, rich-text editor).
- Prefetch likely next routes on hover/idle.
- Tree-shaking (ESM, `sideEffects: false`), import only what you use (`lodash-es/debounce`), replace heavy libraries (moment → date-fns/dayjs).
- Analyse with `rollup-plugin-visualizer` / `webpack-bundle-analyzer`; set **performance budgets** in CI.
- Long-term caching with content-hashed filenames + a CDN.

## Browser storage and caching options [Core]
- **Cookies** — sent with every request; `HttpOnly`, `Secure`, `SameSite` flags. Best for session/refresh tokens.
- **localStorage / sessionStorage** — ~5 MB, synchronous, string-only, readable by any script (XSS risk — never store tokens).
- **IndexedDB** — async, large structured data (offline drafts).
- **Cache API + Service Worker** — offline assets, stale-while-revalidate.
- **HTTP caching** — `Cache-Control: max-age, immutable` for hashed assets; `ETag`/`If-None-Match` for revalidation; `no-store` for sensitive financial responses.

## Web Workers — when would you use one? [Deep dive]
For CPU-heavy work that would block the main thread: parsing large CSV/Excel uploads, computing financial ratios across thousands of rows, client-side PDF generation, syntax highlighting. Communicate with `postMessage` (structured clone) or transfer `ArrayBuffer`s; Comlink makes it RPC-like. Workers have no DOM access.

# Accessibility (WCAG 2.1) {#a11y}

## What does WCAG 2.1 AA compliance involve in practice? [From resume]
The **POUR** principles — Perceivable, Operable, Understandable, Robust. Practical checklist:

- **Semantic HTML first** (`button`, `nav`, `main`, `label`, headings in order) — ARIA only to fill gaps ("no ARIA is better than bad ARIA").
- **Keyboard**: everything reachable with Tab, visible focus ring, logical order, no keyboard traps, skip link.
- **Contrast**: 4.5:1 for body text, 3:1 for large text and UI components.
- **Forms**: associated labels, errors described in text (not colour only) and linked via `aria-describedby`.
- **Images**: meaningful `alt`, decorative `alt=""`.
- **Dynamic content**: `aria-live` regions for async updates (order status, streaming AI answers).
- **Respect** `prefers-reduced-motion`; support 200% zoom / reflow at 320 px.

Tools: axe DevTools / `jest-axe`, Lighthouse, keyboard-only and screen-reader testing (NVDA, VoiceOver).

## How do you build an accessible modal dialog? [Coding]
- Use native `<dialog>` with `showModal()` (built-in focus trap, `Esc`, inert background) — or replicate: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to the title.
- Move focus into the dialog on open (first focusable or the title), **trap** Tab inside, close on `Esc`, and **restore focus** to the trigger on close.
- Make the background `inert` so screen readers can't wander out.

```jsx
function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </dialog>
  );
}
```

## Making charts and dashboards accessible [Deep dive]
Charts (Recharts risk dashboards) are SVG — give them `role="img"` + an `aria-label` summary ("At-risk loans rose 12% this quarter"), provide a **data-table alternative** or "view as table" toggle, never encode meaning by colour alone (add patterns/labels), ensure tooltips are keyboard-reachable, and announce filter changes.

# Security & networking {#security}

## XSS, CSRF and CSP — what are they and how do you defend? [Core]
- **XSS** — attacker script runs in your origin. React escapes text by default; risks are `dangerouslySetInnerHTML` (sanitise with DOMPurify — important when rendering **LLM-generated markdown**), `href="javascript:..."`, and third-party scripts. Add a **Content-Security-Policy** (`script-src 'self'`, nonces) as defence in depth.
- **CSRF** — another site makes the browser send your cookies. Defend with `SameSite=Lax/Strict` cookies, CSRF tokens for cookie-authenticated state changes, and checking `Origin`.
- **Clickjacking** — `frame-ancestors 'none'` / `X-Frame-Options`.

## Where should a SPA store auth tokens? [Core]
Best practice: **access token in memory**, **refresh token in an `HttpOnly; Secure; SameSite` cookie**, short access-token lifetime, silent refresh on 401 with a single in-flight refresh promise (so 10 parallel requests don't trigger 10 refreshes). Or a **BFF** (backend-for-frontend) that keeps tokens server-side and gives the browser only a session cookie. Avoid `localStorage` for tokens — any XSS can exfiltrate them.

## Explain CORS [Core]
The browser blocks reading cross-origin responses unless the server opts in with `Access-Control-Allow-Origin`. "Non-simple" requests (JSON body, custom headers like `Authorization`) trigger an `OPTIONS` **preflight**; the server answers with allowed methods/headers and can cache it with `Access-Control-Max-Age`. With cookies you need `credentials: 'include'` + `Access-Control-Allow-Credentials: true` and a specific origin (not `*`). CORS protects users, not servers — curl ignores it.

## REST vs GraphQL from the client's point of view [Core]
GraphQL lets the client ask for exactly the fields it needs in one round-trip (great for dashboards aggregating many entities), with a typed schema and tooling (Apollo/urql caching by id). Costs: caching is harder than HTTP GET caching, complex queries need cost limits, and errors come back with HTTP 200. REST is simpler, cacheable and fits CRUD well. You used both — be ready to say *why* each was chosen.

# Frontend system design {#fe-design}
Structure: **requirements → component architecture → data model & API → state management → performance → accessibility → security → testing/observability → rollout.**

## Design the AI chat with citations used by credit analysts (OptimaAI) [Design]
**Requirements:** streaming answers, tool-progress indicators, inline citation markers that open a source panel, conversation history, works for 6 personas with RBAC, auditable.

**Components:** `ChatShell` → `MessageList` (virtualised) → `Message` (markdown renderer + `CitationMarker`) · `Composer` (multiline, slash commands, attachments) · `SourcePanel` (table/document viewer, highlights the cited cell/row) · `ToolActivity` (live status of MCP tool calls).

**Data contract:** the backend streams typed events — `token`, `tool_call_started/finished`, `citation {id, source_type, source_ref, snippet}`, `done`. The LLM only emits markers like `[[c3]]`; the UI resolves `c3` from the citation registry, so the UI never trusts free-text sources.

**State:** server state (conversations, messages) in React Query; streaming buffer in a ref + Zustand store; source panel selection in URL query params (shareable deep links for audit).

**Performance:** rAF-batched token rendering, memoised past messages, lazy-load the PDF/table viewer.

**Accessibility:** `aria-live` for completed answers, citation markers are buttons with descriptive labels, keyboard shortcut to jump between citations.

**Security:** sanitise rendered markdown, never render raw HTML from the model, enforce permissions server-side (the UI only hides).

**Observability:** log time-to-first-token, tool latency, citation click-through (a proxy for trust), thumbs up/down.

## Design an analytics / early-risk dashboard [Design]
- **Layout:** filter bar (lender, portfolio, date range — persisted in URL) + grid of widgets (KPI tiles, trend lines, distribution bars, at-risk table).
- **Data:** one aggregated endpoint per widget (or a GraphQL query) so widgets load independently; each widget has its own Suspense/error boundary and skeleton.
- **State:** filters in URL + a store; server data cached per filter combination (React Query keys include filters).
- **Charts:** Recharts for standard charts; downsample large time series; memoise transformed data; avoid animating thousands of points.
- **Drill-down:** clicking a bar opens the filtered loan list (virtualised table) — keeps context via URL.
- **Export:** CSV client-side, PDF server-side for consistent rendering.
- **RBAC:** widgets and actions gated by permissions from the session; the backend enforces data scope (lender/division/branch).

## Design a reusable component library / design system [Design]
Tokens (colour, spacing, typography) as CSS variables → primitives (Button, Input, Select, Dialog) built on accessible headless primitives (Radix/Headless UI or CDK) → composite patterns (DataTable, FilterBar, Wizard). Ship with TypeScript types, Storybook docs, visual regression tests (Chromatic/Playwright screenshots), a11y tests, semantic versioning + changelog, and codemods for breaking changes. Governance: an RFC process and office hours — this is how the Nx libraries at Publicis Sapient scaled across projects.

## Design PDF export of a Credit Assessment Memo [Design]
Options: (1) **client-side** (`react-pdf`, html2canvas) — quick but inconsistent fonts/page breaks and heavy bundles; (2) **server-side** headless Chromium (Playwright/Puppeteer) rendering a print-styled route — pixel-consistent, supports charts, runs as an async job. Prefer (2) for regulated documents: the API enqueues an export job (Temporal activity), returns a job id, the UI polls/streams status, the file is stored in object storage with a signed URL, and the exact CAM **version** id is embedded for audit. Use `@media print` CSS, `break-inside: avoid` for tables, and a header/footer with page numbers.

## Micro-frontends — when would you use them? [Design]
When multiple teams need **independent deployments** of parts of one product (e.g. loan marketplace vs LMS vs analytics). Approaches: Module Federation, single-spa, or route-based composition behind a shell. Costs: duplicated dependencies, inconsistent UX, cross-app state and routing complexity, harder testing. For a single team of 6, a well-bounded monorepo (Nx) gives most benefits without the overhead — say this explicitly; it shows judgement.

# Testing {#fe-testing}

## How do you test a React app? What goes in each layer? [Core]
- **Unit** (Vitest/Jest): pure functions, hooks (`renderHook`), reducers/selectors.
- **Component/integration** (React Testing Library): render with providers, interact like a user (`userEvent`), assert on accessible roles/text — not implementation details. Mock the network at the boundary with **MSW**.
- **E2E** (Playwright/Cypress): a few critical journeys (login → search company → ask AI → open citation → export PDF) against a seeded environment.
- **Visual regression** for the design system; **a11y** checks with axe in component tests.

Testing streaming UI: MSW can return a `ReadableStream` of SSE events so you can assert incremental rendering and the stop button.
