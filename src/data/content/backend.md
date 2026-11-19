---
id: backend
title: Backend
icon: ⚙️
tagline: Python/FastAPI, async SQLAlchemy + PostgreSQL, Redis, API design, OAuth/JWT + hierarchical RBAC, distributed systems, system design, Kubernetes/GitOps and leadership.
---

::: resume
- **Python 3.13 / FastAPI** multi-service monorepo; **async data layer** — PostgreSQL + SQLAlchemy 2.0 (async) + asyncpg, Redis, Qdrant; Alembic migrations; Pytest unit/integration/e2e standards you set for the team.
- **Security:** OAuth/JWT and **hierarchical RBAC** across **lender → division → branch** scopes for **6 personas** (RM, CM, CRO, …).
- **Temporal** for durable workflows (100+ concurrent), REST + GraphQL APIs.
- **Infra/release:** Docker multi-stage builds, Kubernetes + Helm, **ArgoCD GitOps**, Jenkins, separate **India and UAE** environments, **weekly releases at 99.9%+ uptime**.
- **Leadership:** team of 6, architecture & delivery ownership, code-review process, mentoring, interviewing; earlier led 4 devs at Publicis Sapient with daily fail-forward releases.

> **Note:** answers tagged **From resume** are suggested framings built from your resume. Where they give specifics (which library, which incident, which numbers), swap in what actually happened. Never claim a detail you can't back up.
:::

# Python for JavaScript developers {#python-from-js}
You already know JavaScript and TypeScript well. Learn Python by mapping each idea to the JS you know. Four days is enough to read, discuss and write simple Python; it isn't enough to become an expert, so be honest about that in the interview (see the last question).

## Python vs JavaScript: the basics side by side [Core]
| Idea | JavaScript | Python |
|---|---|---|
| Variable | `let x = 5` | `x = 5` |
| Constant | `const MAX = 10` | `MAX = 10` (just a naming rule) |
| Nothing | `null` / `undefined` | `None` |
| Booleans | `true && false \|\| !x` | `True and False or not x` |
| Blocks | `{ }` braces | **indentation** (4 spaces) after a `:` |
| If | `if (a) {} else if (b) {} else {}` | `if a:` / `elif b:` / `else:` |
| Function | `function add(a, b) { return a + b }` | `def add(a, b):` then `return a + b` on the next line |
| Arrow function | `x => x * 2` | `lambda x: x * 2` (one expression only) |
| Template string | `` `Hi ${name}` `` | `f"Hi {name}"` |
| Length | `arr.length` | `len(arr)` |
| Loop over items | `for (const x of items)` | `for x in items:` |
| Loop with index | `items.forEach((x, i) => …)` | `for i, x in enumerate(items):` |
| Count 0..4 | `for (let i = 0; i < 5; i++)` | `for i in range(5):` |
| Import | `import { x } from './mod'` | `from mod import x` |
| Print | `console.log(x)` | `print(x)` |

```python
def greet(name, times=1):
    for i in range(times):
        print(f"Hello {name} #{i + 1}")

greet("Rishabh", times=2)   # named (keyword) arguments are normal in Python
```

**Two traps for JS developers**
- **Empty list `[]` and empty dict `{}` are falsy in Python**, but truthy in JavaScript. `if items:` means "if the list is not empty".
- **`==` compares values** (`[1, 2] == [1, 2]` is `True`). `is` checks it's the same object (like `===` on objects). Use `is` only with `None`: `if x is None:`.

## Lists, dicts, sets and comprehensions [Core]
| JavaScript | Python |
|---|---|
| Array `[1, 2, 3]` | list `[1, 2, 3]` |
| `arr.push(4)` | `lst.append(4)` |
| `arr.slice(1, 3)` | `lst[1:3]` (slicing), `lst[-1]` is the last item |
| Object / Map `{ a: 1 }` | dict `{"a": 1}`, read with `d["a"]` or `d.get("a", default)` |
| `Object.keys(o)` / `Object.entries(o)` | `d.keys()` / `d.items()` |
| `new Set([1, 2])` | `{1, 2}` or `set()` |
| `key in obj` | `key in d` (also works for lists and sets) |
| fixed list | tuple `(1, 2)`, which can't be changed |

**Comprehensions replace most `map` and `filter` calls:**

```python
nums = [1, 2, 3, 4, 5]
doubled = [n * 2 for n in nums]                 # nums.map(n => n * 2)
evens = [n for n in nums if n % 2 == 0]         # nums.filter(n => n % 2 === 0)
by_id = {u["id"]: u for u in users}             # Object.fromEntries(users.map(u => [u.id, u]))
total = sum(n for n in nums)                    # nums.reduce((a, n) => a + n, 0)
```

**Useful built-ins:** `sorted(items, key=lambda u: u["age"])`, `min`, `max`, `any`, `all`, `zip(a, b)`, `reversed`.
For counting and grouping use `collections.Counter` and `collections.defaultdict(list)`.

## Functions, arguments and type hints [Core]
```python
def book(patient: str, slot_id: int, notify: bool = True) -> dict:
    return {"patient": patient, "slot_id": slot_id, "notify": notify}

book("Asha", 42)                       # positional
book(patient="Asha", slot_id=42)       # keyword: clearer, very common
def log(*args, **kwargs):              # like (...args) and an options object
    print(args, kwargs)
```

- **Type hints** look like TypeScript (`name: str`, `-> dict`, `list[int]`, `str | None`), but **Python does not check them at runtime.** A tool like `mypy` checks them, and FastAPI and Pydantic *use* them to validate data.
- **Mutable default trap:** `def add(item, bucket=[])` shares **one** list across all calls. Use `bucket=None`, then `if bucket is None: bucket = []`.

## Classes, dataclasses and Pydantic models [Core]
```python
class Agent:
    def __init__(self, name: str):      # constructor
        self.name = name                # `self` is like `this`, but you write it explicitly

    def speak(self, text: str) -> str:
        return f"{self.name}: {text}"

a = Agent("Iksha")                      # no `new` keyword
print(a.speak("Namaste"))
```

**Plain data: use a dataclass** (it writes `__init__` and equality for you):

```python
from dataclasses import dataclass

@dataclass
class Slot:
    id: int
    doctor: str
    free: bool = True
```

**Data that comes from outside (API bodies, LLM output): use Pydantic.** It validates and converts types, much like zod in TypeScript:

```python
from pydantic import BaseModel

class BookingIn(BaseModel):
    patient_name: str
    slot_id: int

BookingIn(patient_name="Asha", slot_id="42")   # "42" becomes 42; a bad value raises a clear error
```

## Errors and "with" (context managers) [Core]
```python
try:
    slot = find_slot(slot_id)
except KeyError:                      # catch a specific error, like catch + instanceof
    raise ValueError(f"No slot {slot_id}")
finally:
    print("done")

with open("calls.log") as f:          # `with` closes the file even if an error happens
    for line in f:
        print(line.strip())
```

- `raise` is JavaScript's `throw`.
- `with` is like `try/finally` cleanup packaged for you. It's used for files, DB sessions, locks and HTTP clients.

## async/await in Python vs JavaScript [Deep dive]
The keywords are the same, but the behaviour is different in important ways.

| | JavaScript | Python (`asyncio`) |
|---|---|---|
| Event loop | Always running | You start it: `asyncio.run(main())`. FastAPI and Uvicorn start it for you |
| Calling an async function | Starts running straight away and returns a Promise | Returns a **coroutine** that does **nothing** until you `await` it or schedule it |
| Run things in parallel | `await Promise.all([a(), b()])` | `await asyncio.gather(a(), b())` |
| Start now, await later | `const p = fetchX()` | `task = asyncio.create_task(fetch_x())` |
| Timeout | `AbortController` / `Promise.race` | `async with asyncio.timeout(2):` (3.11+) or `asyncio.wait_for(…, 2)` |
| Sleep | `await new Promise(r => setTimeout(r, 1000))` | `await asyncio.sleep(1)` |

```python
import asyncio

async def stt(audio):   await asyncio.sleep(0.2); return "book a slot"
async def lookup(q):    await asyncio.sleep(0.3); return ["10:00", "11:30"]

async def main():
    text, slots = await asyncio.gather(stt(b"..."), lookup("dr mehta"))   # ~0.3 s, not 0.5 s
    print(text, slots)

asyncio.run(main())
```

**The big rule:** never call blocking code inside `async def`. That means `time.sleep`, `requests.get` and heavy CPU work. They freeze the whole event loop, so every live call on that worker stalls. Use async libraries (`httpx`, `asyncpg`), or move the work off the loop with `await asyncio.to_thread(fn)` or a separate worker. In JavaScript you rarely hit this, because almost all I/O is already async.

## Write a small FastAPI service (REST + WebSocket) [Coding]
FastAPI is the Python version of an Express or Nest service, with built-in validation from type hints and automatic API docs at `/docs`.

```python
# main.py   run with:  pip install fastapi uvicorn   then   uvicorn main:app --reload
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel

app = FastAPI()

class BookingIn(BaseModel):
    patient_name: str
    slot_id: int

bookings: dict[int, BookingIn] = {}          # in memory, just for the example

@app.get("/health")
async def health():
    return {"ok": True}                       # dicts are returned as JSON

@app.post("/bookings", status_code=201)
async def create_booking(body: BookingIn):    # body is validated automatically (422 if bad)
    if body.slot_id in bookings:
        raise HTTPException(status_code=409, detail="Slot already booked")
    bookings[body.slot_id] = body
    return {"slot_id": body.slot_id, "patient_name": body.patient_name}

@app.websocket("/calls/{call_id}/audio")
async def call_audio(ws: WebSocket, call_id: str):
    await ws.accept()
    try:
        while True:
            chunk = await ws.receive_bytes()   # audio frames from the phone provider
            # real version: feed chunk to streaming STT → agent → streaming TTS
            await ws.send_bytes(chunk)         # echo back as a placeholder
    except WebSocketDisconnect:
        print(f"call {call_id} ended")
```

**Be ready to explain:**
- **Path and body:** path parameters come from the URL, and the body is parsed into the Pydantic model.
- **async def or def:** `async def` endpoints run on the event loop. Plain `def` endpoints run in a thread pool, which is safe for blocking code.
- **Dependencies:** `Depends(...)` injects things like the DB session or the current user.
- **Production:** run several Uvicorn workers behind a load balancer. On Kubernetes, use more pods, and sticky routing for long WebSocket calls.

## Python tooling: environments, packages, tests [Core]
| Need | JavaScript | Python |
|---|---|---|
| Isolated dependencies | `node_modules` per project | a **virtual environment**: `python -m venv .venv`, then `source .venv/bin/activate` |
| Install | `npm install x` | `pip install x` (or the faster `uv add x`) |
| Lock file | `package-lock.json` | `requirements.txt`, `uv.lock` or `poetry.lock` |
| Project file | `package.json` | `pyproject.toml` |
| Tests | Jest / Vitest | **pytest**: files `test_*.py`, functions `test_*`, plain `assert` |
| Lint + format | ESLint + Prettier | **ruff** (does both) |
| Type check | `tsc` | **mypy** or pyright |

```python
# test_bookings.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_double_booking_is_rejected():
    assert client.post("/bookings", json={"patient_name": "Asha", "slot_id": 1}).status_code == 201
    assert client.post("/bookings", json={"patient_name": "Ravi", "slot_id": 1}).status_code == 409
```

## Python gotchas interviewers like to ask [Deep dive]
- **Mutable default arguments** (`def f(x=[])`) are shared between calls. Use `None`.
- **`is` vs `==`:** `is` means the same object; `==` means equal values.
- **Division:** `7 / 2` is `3.5` and `7 // 2` is `3`. Integers never overflow (they can be huge).
- **Copies:** `b = a` copies the reference, `a.copy()` makes a shallow copy, and `copy.deepcopy(a)` copies nested data too. It's the same idea as JavaScript objects.
- **The GIL:** in standard CPython only one thread runs Python code at a time. Threads still help with waiting on I/O; for CPU-heavy work use processes (`multiprocessing`) or native libraries. Python 3.13 has an optional experimental build without the GIL.
- **Late binding in loops:** `[lambda: i for i in range(3)]` all return 2. Fix it with `lambda i=i: i`.
- **Truthiness:** `[]`, `{}`, `""`, `0` and `None` are all falsy.

## "How strong is your Python?" How do you answer honestly? [From resume]
Never bluff about something on your resume. Interviewers dig into it, and getting caught costs more than the gap itself. Be precise about what you did and didn't do:

> "Our backend at OptimaAI is Python and FastAPI. I designed the services, the async data layer and the workflow architecture, and I review that code. My own day-to-day coding has been stronger in TypeScript and JavaScript, so on Python I'm comfortable reading, reviewing and discussing design, and I'm actively getting faster at writing it. I pick up languages quickly: the hard parts of this job are architecture, async I/O, reliability and LLM behaviour, and those carry across."

**Then show it:** be ready to write the small FastAPI service above, and to explain async vs blocking code. That turns "not strong yet" into "learns fast and knows what matters".

**After the interview:** update your resume so the Python line says exactly what you did (for example, "architected a Python/FastAPI platform"), so it can't be misread.

# Python & async {#python}

## How does asyncio work? When is async actually faster? [Core]
`asyncio` runs an **event loop** on one thread. `async def` functions are coroutines; `await` yields control back to the loop while waiting on I/O, so thousands of concurrent requests can share one thread.

Async helps for **I/O-bound** work (DB queries, HTTP calls to LLMs/MCP servers, Redis). It does **not** speed up CPU-bound work — that blocks the loop for everyone. For CPU work use a process pool, a separate worker (Temporal activity), or native libraries that release the GIL.

```python
results = await asyncio.gather(fetch_financials(cid), fetch_ratings(cid), fetch_news(cid))  # concurrent I/O

async with asyncio.TaskGroup() as tg:          # 3.11+: structured concurrency, cancels siblings on error
    a = tg.create_task(fetch_financials(cid))
    b = tg.create_task(fetch_ratings(cid))
```

## What happens if you call blocking code inside an async endpoint? [Core]
It **blocks the event loop** — every other request on that worker stalls (latency spikes, timeouts, health checks failing). Common culprits: `requests`, sync DB drivers, `time.sleep`, heavy pandas/PDF processing. Fixes: use async libraries (`httpx`, `asyncpg`), `await asyncio.to_thread(fn)` / `run_in_executor` for unavoidable sync calls, or make the endpoint a plain `def` (FastAPI runs it in a threadpool). Detect with asyncio debug mode / slow-callback warnings.

## The GIL, threads vs processes vs asyncio [Core]
The **GIL** lets only one thread execute Python bytecode at a time (in standard CPython builds). 3.13 added an experimental free-threaded (no-GIL) build, and 3.14 made it officially supported but still optional — most production deployments still run with the GIL.
- **Threads** — fine for I/O-bound work, simple with sync libraries.
- **Processes** (`multiprocessing`, `ProcessPoolExecutor`, multiple Uvicorn/Gunicorn workers) — true parallelism for CPU-bound work, more memory.
- **asyncio** — highest concurrency for I/O-bound work with the least overhead, but every library in the path must be async.

## Decorators, context managers and generators — show a practical example of each [Core]
```python
import functools, time, contextlib

def timed(fn):                                     # decorator (async-aware)
    @functools.wraps(fn)
    async def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return await fn(*args, **kwargs)
        finally:
            log.info("%s took %.1fms", fn.__name__, (time.perf_counter() - start) * 1000)
    return wrapper

@contextlib.asynccontextmanager                   # context manager: guaranteed cleanup
async def advisory_lock(session, key: int):
    await session.execute(text("SELECT pg_advisory_lock(:k)"), {"k": key})
    try:
        yield
    finally:
        await session.execute(text("SELECT pg_advisory_unlock(:k)"), {"k": key})

def batched(rows, size):                           # generator: lazy, constant memory
    batch = []
    for r in rows:
        batch.append(r)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch
```

## Pydantic v2 — what do you use it for beyond request validation? [Core]
Settings management (`pydantic-settings` from env vars), validating **LLM tool arguments** and structured outputs, internal DTOs between layers, serialising responses (`model_dump`, `response_model`), discriminated unions for event types, and generating JSON Schema/OpenAPI (which feeds TypeScript type generation for the frontend). v2's Rust core makes validation fast; use `model_validate` for ORM objects (`from_attributes=True`).

# FastAPI {#fastapi}

## How does dependency injection work in FastAPI? [Core]
`Depends()` declares a dependency the framework resolves per request (and caches within the request). Dependencies can depend on others, can be `async`, and can `yield` for setup/teardown — perfect for DB sessions and auth context.

```python
async def get_session() -> AsyncIterator[AsyncSession]:
    async with SessionLocal() as session:
        yield session                       # closed after the response

async def current_user(token: str = Depends(oauth2_scheme)) -> User:
    claims = verify_jwt(token)              # signature, exp, aud, iss
    return User.from_claims(claims)

def require(permission: str):
    async def checker(user: User = Depends(current_user)) -> User:
        if permission not in user.permissions:
            raise HTTPException(status.HTTP_403_FORBIDDEN)
        return user
    return checker

@router.get("/cams/{cam_id}")
async def get_cam(cam_id: UUID, user=Depends(require("cam:read")), db=Depends(get_session)):
    return await cam_service.get_scoped(db, cam_id, user.scope)
```
Testing benefit: `app.dependency_overrides[get_session] = fake_session`.

## How do you structure a large FastAPI codebase / monorepo? [From resume]
Layering: **routers** (HTTP only) → **services** (business logic, transactions) → **repositories** (SQLAlchemy queries) → **models/schemas**. Shared libraries in the monorepo for auth/RBAC, DB session, logging/tracing, error handling, citation envelope, config. Each service (API, agent service, each MCP server, Temporal workers) has its own entrypoint, Dockerfile and Helm chart but shares code via internal packages (uv/poetry workspaces). Consistent error model (problem+json), OpenAPI as the contract, and a template so new services start with health checks, metrics and auth wired in.

## Background tasks vs Celery vs Temporal — when to use which? [Core]
- `BackgroundTasks` — fire-and-forget after the response in the same process (send an email, write an analytics event). Lost if the pod dies; no retries.
- **Celery/RQ/arq** — distributed task queue with retries; good for simple independent jobs.
- **Temporal** — multi-step, long-running, stateful processes needing durability, retries per step, timers, human signals and visibility (CAM generation, RFP orchestration, document ingestion).

## How do you stream responses (SSE) from FastAPI? [Core]
```python
from fastapi.responses import StreamingResponse

@router.post("/chat")
async def chat(req: ChatRequest, user=Depends(current_user)):
    async def events():
        async for ev in agent.run_stream(req.message, user):     # tokens, tool calls, citations
            yield f"data: {ev.model_dump_json()}\n\n"
        yield "data: {\"type\": \"done\"}\n\n"
    return StreamingResponse(events(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
```
Gotchas: disable proxy buffering (nginx/ingress), send heartbeats to keep idle connections alive, handle client disconnects (`await request.is_disconnected()`) to stop the LLM call and save tokens, and set ingress timeouts long enough.

## Middleware, exception handlers and request context [Core]
Middleware for cross-cutting concerns: request id/correlation id, structured logging, timing metrics, CORS, GZip, security headers. Global exception handlers map domain errors to HTTP responses (`NotFound` → 404, `PermissionDenied` → 403, validation → 422) with a consistent body, never leaking stack traces. Use `contextvars` to carry request id / tenant through async code into logs and outbound calls.

# PostgreSQL & SQLAlchemy 2.0 (async) {#postgres}

## How do you manage async sessions and transactions with SQLAlchemy 2.0? [Core]
```python
engine = create_async_engine(DB_URL, pool_size=10, max_overflow=20, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def transfer_limit(db: AsyncSession, from_id, to_id, amount):
    async with db.begin():                                   # one transaction, commit or rollback
        src = await db.get(CreditLimit, from_id, with_for_update=True)   # row lock
        dst = await db.get(CreditLimit, to_id, with_for_update=True)
        src.available -= amount
        dst.available += amount
```
Rules: **one session per request/unit of work**, never share a session across concurrent tasks, `expire_on_commit=False` to avoid implicit lazy loads after commit (which fail in async), and use the 2.0 style `select()` API.

## What is the N+1 problem and how do you fix it in async SQLAlchemy? [Core]
Loading 50 companies then accessing `company.financials` for each issues 1 + 50 queries — and in async, implicit lazy loading **raises** (`MissingGreenlet`). Fix with explicit eager loading:

```python
stmt = (select(Company)
        .where(Company.lender_id == scope.lender_id)
        .options(selectinload(Company.financials),       # 1 extra IN query for collections
                 joinedload(Company.industry)))           # JOIN for many-to-one
companies = (await db.scalars(stmt)).unique().all()
```
Set `lazy="raise"` on relationships to catch accidental lazy loads in tests. In GraphQL, use DataLoaders to batch per request.

## Indexing strategy — how do you decide which indexes to add? [Core]
Start from real queries (`pg_stat_statements`) and `EXPLAIN (ANALYZE, BUFFERS)`.
- **B-tree** for equality/range/sort. **Composite** index column order: equality columns first, then range/sort (`(lender_id, status, created_at DESC)`).
- **Partial** indexes for hot subsets (`WHERE status = 'pending'`).
- **Covering** (`INCLUDE`) to enable index-only scans.
- **GIN** for JSONB containment and full-text search; **trigram** (`pg_trgm`) for fuzzy company-name search.
- Every index slows writes and costs storage — drop unused ones (`pg_stat_user_indexes`).
- Create in production with `CREATE INDEX CONCURRENTLY` to avoid locking writes.

## Transaction isolation levels and MVCC [Deep dive]
PostgreSQL uses **MVCC**: each transaction sees a snapshot; writers don't block readers.
- **Read Committed** (default) — each statement sees data committed before it began; allows non-repeatable reads and lost updates in read-modify-write code.
- **Repeatable Read** — one snapshot for the whole transaction; concurrent updates to the same row raise a serialization error.
- **Serializable** — as if transactions ran one at a time (SSI); must **retry** on serialization failures.

Preventing lost updates on, say, a credit limit: `SELECT … FOR UPDATE`, an atomic `UPDATE … SET available = available - :x WHERE available >= :x`, or **optimistic locking** with a version column (`version_id_col` in SQLAlchemy) — good for CAM editing where conflicts are rare.

## How do you run zero-downtime schema migrations with Alembic? [Deep dive]
Use **expand → migrate → contract** across releases:
1. Expand: add nullable column / new table / new index (`CONCURRENTLY`, in an autocommit block); deploy code that writes both old and new.
2. Backfill in batches (a job, not inside the migration lock).
3. Switch reads to the new column; add constraints with `NOT VALID` then `VALIDATE CONSTRAINT`.
4. Contract: drop the old column in a later release.

Avoid long locks: set `lock_timeout`, never rewrite big tables in one migration, and keep migrations backward compatible with the currently running version (rolling deploys run old and new pods together).

## Multi-tenancy in PostgreSQL — shared schema, schema-per-tenant or DB-per-tenant? [Design]
- **Shared tables + `tenant_id`** — simplest ops, scales to many tenants; risk of leaks if a query forgets the filter → enforce with a repository base class that always applies scope, and/or **Row-Level Security** policies keyed on a per-transaction setting (`SET LOCAL app.tenant_id = …` or `set_config('app.tenant_id', …, true)` — transaction-scoped so pooled connections can't leak it).
- **Schema per tenant** — stronger isolation, migrations × N.
- **Database per tenant** — strongest isolation, per-tenant backup/restore and residency, highest ops cost.
For ~10 lenders with regulatory needs: shared schema per **region** with RLS + scope enforcement in code is a solid answer; mention a dedicated DB for a lender that contractually demands it.

## JSONB — when is it the right choice? [Core]
Good for semi-structured, evolving data you mostly read as a whole: tool-call logs, CAM section content, citation registries, lender-specific configuration. Index with GIN for containment queries or expression indexes for specific keys. Avoid it for fields you filter/join/aggregate on constantly or that need foreign keys — promote those to columns.

# Redis & caching {#redis}

## Caching patterns and invalidation [Core]
- **Cache-aside** (most common): read cache → miss → read DB → set with TTL. Invalidate (delete) on write.
- **Write-through / write-behind** — write to cache with/before the DB; more complex.
- **TTL + versioned keys** (`company:{id}:v{version}`) make invalidation simpler — bump version on change.
- What to cache in an AI platform: expensive aggregates (financial ratios), external API/legacy responses, permission sets per user, LLM responses for identical deterministic prompts.
- Never cache across tenants without the tenant in the key.

## How do you prevent a cache stampede? [Deep dive]
When a hot key expires, many requests hit the DB at once. Mitigations: **single-flight** — one request recomputes under a short Redis lock (`SET key:lock 1 NX PX 5000`) while others wait/serve stale; **stale-while-revalidate** (store a soft expiry inside the value, refresh in the background); **jittered TTLs** so keys don't expire together; pre-warming for known hot keys.

## Implement a rate limiter with Redis [Coding]
Sliding-window log with a sorted set (accurate, per user or per tenant), done atomically in Lua:

```python
SLIDING_WINDOW = """
local key, now, window, limit = KEYS[1], tonumber(ARGV[1]), tonumber(ARGV[2]), tonumber(ARGV[3])
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
if redis.call('ZCARD', key) < limit then
  redis.call('ZADD', key, now, ARGV[4])
  redis.call('PEXPIRE', key, window)
  return 1
end
return 0
"""
limiter = redis.register_script(SLIDING_WINDOW)

async def allow(user_id: str, limit=60, window_ms=60_000) -> bool:
    now = int(time.time() * 1000)
    return bool(await limiter(keys=[f"rl:{user_id}"], args=[now, window_ms, limit, f"{now}-{uuid4()}"]))
```
Alternatives: **token bucket** (allows bursts, smooth refill — good for protecting LLM provider quotas), fixed window counter (`INCR` + `EXPIRE`, simplest, bursty at edges). Return `429` with `Retry-After`.

## Distributed locks with Redis — what are the caveats? [Deep dive]
`SET lock:key <token> NX PX 30000` + release only if the token matches (Lua compare-and-delete). Caveats: a GC pause or slow process can outlive the TTL and two holders run; Redlock across nodes is debated for correctness. For correctness-critical mutual exclusion use **fencing tokens** or the database (`SELECT … FOR UPDATE`, advisory locks), or let Temporal guarantee single execution per workflow id.

## Redis pub/sub vs Streams vs a real message broker [Core]
**Pub/sub** — fire-and-forget fan-out; offline subscribers miss messages (fine for live UI notifications). **Streams** — persisted log with consumer groups, acks and replay (lightweight queue). **Kafka/RabbitMQ/SQS** — durable, high-throughput, richer delivery semantics for core event pipelines.

# API design {#api}

## What makes a good REST API? [Core]
Resource-oriented URLs (`/lenders/{id}/cams/{cam_id}/versions`), correct methods and status codes (201 + `Location` on create, 204, 409 on conflict, 422 validation, 429 rate limit), consistent error body (RFC 9457 problem+json, which replaced RFC 7807), **cursor pagination**, filtering/sorting conventions, `ETag`/`If-Match` for optimistic concurrency, versioning strategy, idempotency for unsafe retries, OpenAPI documentation, and auth scopes per endpoint.

## Offset vs cursor pagination [Core]
`OFFSET 100000` makes the DB scan and discard rows (slow) and shifts when rows are inserted (duplicates/skips). **Cursor/keyset** pagination: `WHERE (created_at, id) < (:last_created_at, :last_id) ORDER BY created_at DESC, id DESC LIMIT 50` — constant cost with the right composite index, stable under inserts. Offset is fine for small admin tables needing "jump to page 7".

## How do idempotency keys work? [Core]
Client sends `Idempotency-Key: <uuid>` on POSTs that create side effects (disburse, submit RFP). Server stores `(key, user, request_hash) → status, response` (with a unique constraint) and on a retry returns the stored response instead of re-executing; a concurrent duplicate gets `409`/waits. Keys expire after e.g. 24 h. Combined with client retries with backoff, this gives effectively-once behaviour across network failures.

## REST vs GraphQL — when did you use each? [From resume]
- **REST** — CRUD and command endpoints, simple caching, file uploads/downloads, webhooks; easy to secure per route.
- **GraphQL** — read-heavy screens aggregating many related entities (company profile + financials + facilities + documents) where clients want to pick fields; one schema for many UIs.
GraphQL concerns: N+1 (DataLoader), query depth/cost limits, field-level authorization, caching (persisted queries / APQ), error semantics.

## API versioning and backward compatibility [Core]
Prefer **additive, backward-compatible** changes (new optional fields, new endpoints). For breaking changes: URL (`/v2`) or header versioning, run both versions, publish deprecation dates (`Deprecation`/`Sunset` headers), monitor usage of old versions, and contract-test consumers. Internally, generated clients from OpenAPI make breakages visible at compile time.

## Designing webhooks for partner integrations [Design]
Sign payloads (HMAC with a per-subscriber secret + timestamp to prevent replay), deliver **at-least-once** with exponential backoff and a dead-letter queue, include an event id so receivers can dedupe, keep payloads small (id + type, let them fetch details), provide a replay endpoint and a delivery log UI, and use the **outbox pattern** so events are emitted only for committed transactions.

# Authentication, authorization & security {#security}

## Explain OAuth 2.0 / OIDC — which flow for which client? [Core]
- **Authorization Code + PKCE** — SPAs and mobile apps (no client secret in the browser). OIDC adds an **ID token** (who the user is) on top of OAuth's access token (what the client may do).
- **Client Credentials** — service-to-service (Temporal workers calling APIs, MCP servers calling internal services).
- **Refresh tokens** — long-lived, rotated on use, stored HttpOnly or server-side.
- Avoid the Implicit and Password grants — the OAuth 2.0 Security BCP (RFC 9700) discourages them and the OAuth 2.1 draft removes them.

## JWT — structure, validation and pitfalls [Core]
`header.payload.signature` (base64url). Validate: **signature** (prefer RS256/ES256 with a JWKS endpoint so services only hold public keys), `exp`/`nbf`, `iss`, `aud`, and pin allowed algorithms (reject `none`/algorithm confusion). Keep access tokens **short-lived** (5–15 min); JWTs can't be revoked individually — use short TTL + refresh rotation, a deny-list (Redis) for emergencies, or opaque tokens with introspection for high-risk actions. Don't put sensitive data in claims (they're only encoded, not encrypted) and keep them small.

## Design hierarchical RBAC for lender → division → branch with 6 personas [From resume]
**Model:**
- `org_unit(id, lender_id, parent_id, type: lender|division|branch, path ltree)` — a tree per lender.
- `role(id, name)` e.g. RM, CM, CRO, Ops, Admin, Viewer; `permission(code)` e.g. `cam:read`, `cam:edit`, `cam:approve`, `tool:configure`.
- `role_permission(role_id, permission)`; `user_assignment(user_id, role_id, org_unit_id)` — a role **at a scope**.

**Evaluation:** a user can act on a resource if they hold the permission via an assignment whose org unit is the resource's unit **or an ancestor** (CRO at lender level sees all; RM at branch sees only that branch). With `ltree`, `resource.path <@ assignment.path` is a single indexed query.

```python
def is_within(resource_path: str, scope_path: str) -> bool:
    # segment-aware: "lender1.div2" covers "lender1.div2.branch7", but NOT "lender1.div23"
    return resource_path == scope_path or resource_path.startswith(scope_path + ".")

def can(user: Principal, perm: str, resource_unit_path: str) -> bool:
    return any(perm in a.permissions and is_within(resource_unit_path, a.unit_path)
               for a in user.assignments)
```

**Enforcement:** in FastAPI dependencies for endpoint-level checks **and** in repository queries (always filter by the user's allowed unit paths) so list endpoints can't leak; the same check runs inside every MCP tool. Cache resolved permissions per user in Redis (invalidate on assignment change); put coarse claims (lender, roles) in the JWT, resolve fine-grained scope server-side. Audit every authorization-relevant action. Maker–checker: an RM can draft, only a CM/CRO can approve (and never their own).

## OWASP Top 10 — what do you check in reviews? [Core]
Broken access control (IDOR — always scope by tenant/unit), injection (parameterised queries — SQLAlchemy does this unless you build raw strings), cryptographic failures (TLS everywhere, encrypt sensitive columns, no homemade crypto), insecure design, security misconfiguration (debug off, CORS restricted), vulnerable dependencies (Dependabot/pip-audit/Trivy in CI), auth failures (rate-limit logins, MFA), integrity failures (signed artifacts, pinned images), logging gaps, SSRF (validate outbound URLs — relevant when tools fetch documents).

## How do you manage secrets across environments? [Core]
Never in code or images. Use a secret manager (AWS Secrets Manager / Azure Key Vault / Vault) synced into Kubernetes via External Secrets or the CSI driver, or Sealed Secrets/SOPS in the GitOps repo (encrypted). Least-privilege IAM per service (IRSA / workload identity), rotation policies, separate secrets per region/environment, and audit access.

# Distributed systems fundamentals {#distributed}

## CAP and PACELC in plain words [Core]
During a **network partition** a distributed store must choose **consistency** (reject some requests) or **availability** (serve possibly stale data). PACELC adds: **else** (no partition) you still trade **latency vs consistency**. Financial ledgers/limits choose consistency (single-primary PostgreSQL, synchronous where needed); caches, search indexes and analytics accept eventual consistency.

## Exactly-once processing — is it possible? [Deep dive]
Across a network, delivery is at-most-once or at-least-once. You get **effectively-once** by combining at-least-once delivery with **idempotent consumers** (dedupe by message/event id in a processed table within the same transaction as the effect, or natural idempotency like upserts). Temporal gives exactly-once *workflow* semantics, but activities are at-least-once — so activities must be idempotent.

## The transactional outbox pattern [Deep dive]
Problem: you update the DB and publish an event — if one succeeds and the other fails, systems diverge. Solution: in the **same DB transaction** write the business change and an `outbox` row; a relay (poller or CDC with Debezium) publishes outbox rows to the broker and marks them sent. Consumers dedupe by event id. Guarantees no event without a commit and no commit without (eventual) event.

## Sagas vs distributed transactions [Deep dive]
2PC across services is fragile and blocks. A **saga** is a sequence of local transactions with **compensating** actions on failure (reserve limit → create facility → notify; if notify permanently fails, decide whether to compensate). Orchestrated sagas (a coordinator — Temporal is excellent here) are easier to reason about than choreographed ones (services reacting to events).

## Kafka vs RabbitMQ vs SQS — how do you choose? [Core]
- **Kafka** — partitioned, replayable log; very high throughput; consumer groups; ordering per partition. Event streaming, audit/event sourcing, analytics pipelines.
- **RabbitMQ** — flexible routing (exchanges), per-message acks, priorities, delayed messages; classic work queues.
- **SQS** — fully managed, simple at-least-once queue (FIFO variant for ordering + dedupe); pairs with SNS for fan-out.
Pick by need for replay/retention, routing complexity, ordering, throughput and ops burden.

## Resilience patterns: timeouts, retries, circuit breakers, bulkheads [Core]
Every remote call gets a **timeout**. **Retry** only transient failures, with exponential backoff + jitter and a budget. **Circuit breaker** stops hammering a failing dependency (legacy core-banking system) and fails fast/falls back. **Bulkheads** isolate resources (separate pools/queues per dependency) so one slow dependency can't exhaust everything. **Load shedding** and graceful degradation (serve cached data, disable non-critical features).

## Observability: logs, metrics, traces, SLOs [Core]
Structured JSON logs with correlation ids; RED metrics (rate, errors, duration) per endpoint and USE for resources; distributed tracing (OpenTelemetry) across API → agent → MCP → DB/LLM; dashboards and alerts on **SLOs** (e.g. 99.9% availability ⇒ ~43 min/month error budget). Alert on symptoms users feel, not on every CPU spike; when the error budget burns, slow releases and fix reliability.

# Backend system design {#system-design}
Framework: **clarify requirements & scale → API → data model → high-level architecture → deep dives (bottlenecks, consistency, failure modes) → security → observability → trade-offs.**

## Design a Loan Management System (post-disbursement) for 50+ lenders [Design]
**Functional:** loan accounts, repayment schedules (EMI), payments allocation (principal/interest/penalty), overdue tracking (DPD buckets), restructuring/loan splitting, statements, role-based access per lender.
**Non-functional:** correctness and auditability over raw speed, multi-tenant isolation, daily batch accruals at month-end scale.

- **Data:** `loan`, `schedule_installment`, `transaction` (immutable ledger entries, double-entry style), `dpd_snapshot`, `audit_event`. Money as integers in minor units / `NUMERIC`.
- **Services:** loan servicing API, payment ingestion (bank files/webhooks → idempotent processing), **daily jobs** (interest accrual, DPD computation, early-risk scoring) as orchestrated workflows with checkpoints, reporting/analytics read model (replica or warehouse).
- **Consistency:** posting a payment = one DB transaction updating ledger + installment status; idempotency keys on payment references.
- **Early-risk dashboards:** precomputed aggregates per lender/portfolio refreshed by the daily job; drill-down queries on a read replica.
- **Scale:** partition large tables by lender or month; archive closed loans.
- **Security:** RBAC per lender role, maker-checker for adjustments, full audit trail.

## Design a rate limiter as a service [Design]
Requirements: per user/tenant/API key limits, low latency (< 2 ms), distributed across many API pods, configurable rules. Store counters in **Redis** (token bucket / sliding window via Lua for atomicity), rules in config/DB cached locally, enforce in API gateway or middleware, return `429` + headers (`X-RateLimit-Remaining`, `Retry-After`). Failure mode: if Redis is down, fail-open for low-risk endpoints, fail-closed for expensive ones (LLM calls). Shard keys across a Redis cluster; local in-memory pre-check to cut Redis traffic for very hot keys.

## Design a notification service (email, SMS, in-app, WhatsApp) [Design]
API accepts `notify(user, template, data, channels, priority, idempotency_key)` → persists → enqueues per channel → channel workers call providers with retries/backoff and provider failover → status callbacks update delivery state. User preferences and quiet hours, templating with localisation, rate limits per user, dedupe, DLQ and replay, audit log. In-app notifications via WebSocket/SSE fan-out (Redis pub/sub) with persistence for offline users.

## Design an audit-log system for a regulated lending platform [Design]
Append-only `audit_event(id, at, actor_user, actor_type: user|agent|system, tenant, action, entity, entity_id, before, after, request_id, ip)` written in the **same transaction** as the change (or via outbox). Tamper evidence with hash chaining or WORM storage (object lock). Partition by month; ship to cheap long-term storage; searchable via an index for investigations. Include AI specifics: model, prompt version, tool calls and citations for every AI-generated content change.

## Design a job scheduler / workflow engine (or: why not build one) [Design]
Components: job definitions, a durable store of runs and state, schedulers (cron) with leader election, workers pulling from queues with leases/heartbeats, retries with backoff, timeouts, DAG dependencies, idempotency, visibility UI. Then the senior answer: this is exactly what **Temporal** provides — you evaluated build vs buy and chose Temporal to avoid owning a complex distributed system; explain its architecture (frontend, history, matching, workers, persistence) at a high level.

## Design a URL shortener (classic warm-up) [Design]
Write: generate a short id (base62 of a counter from a ticket server/Snowflake-style id, or random 7 chars with collision check) → store `id → url` in a KV/SQL store. Read path (100× more reads): CDN/edge + Redis cache → DB; 301 vs 302 (analytics needs 302). Analytics via async click events to a stream. Scale: shard by id, rate-limit creation, block malicious URLs, custom aliases with uniqueness constraint, TTL/expiry.

# DevOps, Kubernetes & delivery {#devops}

## Docker multi-stage builds — why and how? [From resume]
Build dependencies (compilers, dev packages) stay in the builder stage; the final image contains only the runtime and app → smaller, faster to pull, smaller attack surface.

```dockerfile
FROM python:3.13-slim AS builder
WORKDIR /app
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project      # cached layer: deps change rarely
COPY src ./src
RUN uv sync --frozen --no-dev

FROM python:3.13-slim
RUN useradd -r -u 10001 app
WORKDIR /app
COPY --from=builder --chown=app /app /app
USER app                                                # never run as root
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "service.main:app", "--host", "0.0.0.0", "--port", "8000"]
```
Also: pin base image digests, `.dockerignore`, scan images (Trivy) in CI.

## Kubernetes essentials you use day to day [Core]
**Deployment** (replica sets, rolling updates) → **Pods**; **Service** (stable virtual IP / DNS) and **Ingress** for HTTP routing; **ConfigMaps/Secrets**; **HPA** autoscaling on CPU or custom metrics (queue depth for Temporal workers); **resource requests/limits** (requests drive scheduling; memory limit breach = OOMKill); **probes** — readiness (take out of load balancing), liveness (restart), startup (slow boots); **PodDisruptionBudgets** for safe node drains; **NetworkPolicies** to restrict traffic; namespaces per environment/team.

## Helm + ArgoCD GitOps — how does your release flow work? [From resume]
CI (Jenkins/GitLab) runs tests, builds and scans the image, pushes it with an immutable tag, then updates the image tag in the **GitOps repo** (Helm values per environment — e.g. `dev`, `uat`, `prod-india`, `prod-uae`; use your real names). **ArgoCD** watches the repo and syncs clusters to the declared state, shows drift, and supports rollback by reverting a commit. Promotion between environments = PR to the next environment's values (reviewed, auditable). Benefits: Git is the single source of truth, every change is reviewed and reversible, clusters self-heal from manual drift.

## How do you release weekly with 99.9%+ uptime? [From resume]
- Small, frequent changes behind **feature flags**; trunk-based development.
- Automated test gates (unit, integration, e2e smoke) + migrations designed to be backward compatible (expand/contract).
- **Rolling** deployments with readiness probes and `maxUnavailable: 0`; **canary** for risky changes (one lender/region first); fast rollback via ArgoCD.
- Graceful shutdown (handle SIGTERM, drain in-flight requests and SSE streams; Temporal workers finish or hand back activities).
- Release checklist, release notes for lenders, on-call and post-deploy monitoring window, blameless postmortems feeding back into tests.

## Blue-green vs canary vs rolling deployments [Core]
- **Rolling** — replace pods gradually; default, cheap; both versions run simultaneously (needs backward compatibility).
- **Blue-green** — full parallel environment, switch traffic at once; instant rollback, double cost, DB migrations still need compatibility.
- **Canary** — send a small % of traffic (or one tenant) to the new version, watch metrics, then ramp (Argo Rollouts/Flagger can automate analysis).

# Testing & quality {#testing}

## What testing standards did you set for the team? [From resume]
- **Pytest** unit tests for services/tools (pure logic, calculators, permission checks) — fast, no I/O.
- **Integration** tests against real PostgreSQL/Redis in containers (testcontainers or docker-compose in CI), transactional fixtures rolled back per test, factories for data.
- **API/e2e** tests through the HTTP layer with `httpx.AsyncClient` + dependency overrides; a small set of end-to-end journeys in a staging environment.
- **LLM features**: deterministic tests with recorded/mocked model responses for the plumbing + eval suites for quality.
- Coverage on critical paths (money, permissions, citations) rather than a vanity percentage; tests required in PR template; flaky tests quarantined and fixed.

```python
# async fixtures/tests need pytest-asyncio (or anyio) — e.g. asyncio_mode = "auto" in pytest config
@pytest.fixture
async def client(db_session):
    app.dependency_overrides[get_session] = lambda: db_session
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()

async def test_rm_cannot_read_other_branch_cam(client, rm_token, other_branch_cam):
    r = await client.get(f"/cams/{other_branch_cam.id}", headers={"Authorization": f"Bearer {rm_token}"})
    assert r.status_code == 404        # don't leak existence
```

## How do you test Temporal workflows? [Deep dive]
Use the Temporal testing environment with **time skipping** (`WorkflowEnvironment.start_time_skipping()`), register mocked activities, and assert on workflow results, signals and retries without waiting real days. Add **replay tests** with recorded histories to catch non-determinism before deploying workflow code changes.

# Engineering leadership {#leadership}
Behavioural rounds for a Lead role. Use **STAR** and quantify.

## How do you run code and design reviews for a team of 6? [From resume]
Design docs/RFCs for anything cross-service (problem, options, decision, risks) reviewed before coding; PR reviews within a day, small PRs, checklists (tests, migrations, security/RBAC, observability), automated linters/formatters so humans review logic not style; rotate reviewers to spread knowledge; review tone: ask questions, explain the why; I review the risky parts (money, permissions, AI output handling) personally.

## Tell me about a hard technical decision you made and its trade-offs [From resume]
Strong candidates: **choosing Temporal** for taskbooks/RFP orchestration (vs Celery + state tables), or **choosing MCP** for 30+ tools (vs bespoke function calling). Structure: context and constraints → options evaluated (with a spike/POC) → decision criteria (reliability, team skill, ops cost, vendor lock-in) → outcome (100+ concurrent workflows without manual recovery; new region tools without agent changes) → what you'd revisit.

## How do you handle a production incident? [Core]
Stabilise first (rollback/feature flag/scale), communicate early with a single incident channel and status updates to lenders, assign roles (incident lead, comms, investigators), then a **blameless postmortem**: timeline, root cause(s), what made it worse, action items with owners (tests, alerts, runbooks). Track MTTR and repeat incidents.

## How do you mentor engineers and grow the team? [Core]
Individual growth plans tied to real ownership (each MCP server/feature has an owner), pairing on hard problems, letting people lead design reviews, regular 1:1s, clear expectations per level, celebrating wins publicly, and feedback that is specific and timely. As an interviewer: structured rubrics, practical problems, calibrated debriefs.

## How do you plan, estimate and deliver with product, credit and ops stakeholders? [From resume]
Break work into thin vertical slices with user-visible value; estimate with ranges and explicit risks/unknowns (spikes for AI uncertainty); weekly release train; demo to credit/ops users early to validate; a visible roadmap and a "now/next/later" view; protect ~20% capacity for tech debt and reliability; say no (or "not now") with data. Report outcomes in business terms — e.g. CAM drafting reduced to under an hour, underwriting turnaround shortened.

## Tell me about a time you disagreed with a stakeholder [Core]
Pick a real one (e.g. product wanting fully automatic AI credit recommendations vs your push for citations + human approval). Show you understood their goal, brought data (eval results, regulatory requirements), proposed an alternative that met the goal (faster review-ready CAMs with traceability), and committed once decided.
