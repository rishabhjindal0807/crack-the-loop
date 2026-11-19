---
id: ai
title: Agentic AI
icon: 🤖
tagline: LLM fundamentals, agents & tool use, MCP, RAG with Qdrant, citations, Temporal-backed agent workflows, evals and AI system design — built around OptimaAI.
---

::: resume
- **OptimaAI** — agentic AI credit-underwriting platform on **Claude + MCP + Temporal**, live with **10 lenders** across India and MENA; you lead a team of 6 and own the architecture.
- **5 MCP servers** (calculator, company, retail, legacy, MENA) exposing **30+ financial tools**; conversations routed to company vs retail agents with **mcp-agent**. *Why MCP:* one standard tool interface; new tools/regions plug in without changing agent code.
- **Temporal** for long-running taskbooks, RFP orchestration and ops automation — durable state + automatic retries, **100+ concurrent workflows**.
- **Citation pipeline** — tools return cited data, LLM output limited to citation markers, UI links each marker to a source panel → audit trail, less hallucination risk.
- **AI-generated CAM** (Credit Assessment Memo) with a dedicated **editing agent** + tool suite, **per-turn versioning, audit history and rollback** → review-ready CAM in under an hour.
- Stack keywords: Anthropic Claude SDK, mcp-agent, Google ADK, LastMile AI, RAG, Qdrant, Claude Code / Windsurf.

Expect deep follow-ups on every bullet: *why this choice, what alternatives you rejected, what broke in production, how you measured success.*

> **Note:** answers tagged **From resume** are suggested framings built from your resume. Where they give specifics (which library, which incident, which numbers), swap in what actually happened. Never claim a detail you can't back up.
:::

# LLM fundamentals {#llm}

## How does an LLM generate text? Tokens, context window, temperature [Core]
An LLM is a transformer trained to predict the **next token** given previous tokens. Generation is a loop: compute a probability distribution over the vocabulary → **sample** a token → append → repeat until a stop condition.

- **Tokens** ≈ sub-word pieces (~4 characters of English). Cost, latency and limits are all counted in tokens; numbers and non-English text often tokenise less efficiently.
- **Context window** — max tokens of input + output the model can attend to at once. Everything the model "knows" about this request must fit: system prompt, tool definitions, conversation, retrieved docs.
- **Temperature** scales the distribution — low (0–0.3) for extraction, classification and financial commentary that must be consistent; higher for brainstorming. **top-p** samples from the smallest set of tokens covering probability p.
- Models are **stateless** between calls — "memory" is whatever you send back in the messages array.

## What is prompt engineering in practice? [Core]
- A clear **system prompt**: role, audience, constraints, output format, what to do when unsure ("If the data doesn't contain the figure, say so — never estimate").
- **Structure** inputs with XML-style tags (`<financials>`, `<instructions>`), put long documents **before** the question.
- **Few-shot examples** of good outputs (including edge cases).
- Ask for **structured output** (JSON schema / tool call) when code will consume it.
- Let the model **think** before answering for multi-step reasoning (extended thinking or a scratchpad), but keep the final answer separately parseable.
- **Iterate with evals**, not vibes — every prompt change is run against a golden set.

## Why do LLMs hallucinate and how do you reduce it? [Core]
They're trained to produce *plausible* continuations, not to verify facts; gaps in context get filled with likely-sounding text. Mitigations, roughly in order of impact for a lending product:

1. **Ground** answers in retrieved/tool data (RAG, MCP tools) instead of model memory.
2. **Constrain** the output: the model may only reference facts via citation markers that resolve to tool results (your citation pipeline).
3. **Do math in tools**, not in the model (calculator MCP server for ratios, DSCR, growth rates).
4. Instruct explicit abstention ("not available in the provided data").
5. **Verify**: post-check that every cited id exists and numbers in prose match source values; LLM-as-judge for faithfulness.
6. Human review for decisions (credit teams approve the CAM).

## Structured outputs and tool calling — how do they relate? [Core]
Tool calling is structured output with intent: you give the model JSON-schema tool definitions; it responds with a `tool_use` block containing arguments that match the schema. Use it to (a) take actions/fetch data, (b) force a schema for extraction (a single "record_result" tool, or `tool_choice` to force it). Always **validate** arguments server-side (Pydantic) — schema adherence is very high but you still own correctness and authorisation.

## How do you manage cost and latency in an LLM product? [Deep dive]
- **Prompt caching** — put stable content (system prompt, tool definitions, long documents) first and mark it cacheable; cached input tokens are much cheaper and faster.
- **Model routing** — small/fast model for classification, routing and summaries; the strongest model only for complex reasoning (credit commentary).
- **Trim context** — summarise old turns, retrieve only top-k relevant chunks, return compact tool results (IDs + needed fields, not whole tables).
- **Parallel tool calls** and parallel sub-tasks; **stream** responses so time-to-first-token feels fast.
- **Batch APIs** for offline jobs (bulk CAM regeneration) at lower cost.
- Track **cost per conversation / per CAM** as a product metric.

## Context window management for long conversations [Deep dive]
Long underwriting sessions blow past useful context. Techniques: rolling **summaries** of older turns, keeping **tool results out of the transcript** once consumed (store them; reference by id), retrieving past facts on demand (memory as a tool), and **sub-agents** that do heavy reading in their own context and return only a distilled answer. Watch for "lost in the middle" — put critical instructions at the start and the question at the end.

# Agents & tool use {#agents}

## What is an "agent"? How is it different from a workflow? [Core]
An **agent** is an LLM running in a loop: it decides which tool to call, observes the result, and continues until the task is done — the *model* controls the control flow. A **workflow** is LLM calls orchestrated by *code* along predefined paths.

Anthropic's guidance (Building Effective Agents): start with the simplest thing — a single well-prompted call → **workflows** (prompt chaining, routing, parallelisation, orchestrator–workers, evaluator–optimiser) → autonomous **agents** only when the steps can't be predicted. Agents trade latency/cost/predictability for flexibility.

OptimaAI uses both: deterministic **Temporal workflows** for taskbooks, RFP orchestration and ops automation, and **agents** for open-ended analyst questions and the CAM editing agent.

## Implement a tool-use loop with the Anthropic Claude SDK [Coding]
```python
import anthropic, json

client = anthropic.Anthropic()
TOOLS = [{
    "name": "get_financials",
    "description": "Fetch audited financial statements for a company. Use when the user asks about revenue, EBITDA, debt or ratios.",
    "input_schema": {
        "type": "object",
        "properties": {
            "company_id": {"type": "string"},
            "fiscal_years": {"type": "array", "items": {"type": "integer"}},
        },
        "required": ["company_id"],
    },
}]

def run_agent(user_msg: str, max_turns: int = 8) -> str:
    messages = [{"role": "user", "content": user_msg}]
    for _ in range(max_turns):                      # hard cap: no runaway loops
        resp = client.messages.create(
            model="claude-sonnet-5-5", max_tokens=2048,
            system="You are a credit analyst assistant. Cite every figure.",
            tools=TOOLS, messages=messages,
        )
        messages.append({"role": "assistant", "content": resp.content})
        if resp.stop_reason != "tool_use":
            return "".join(b.text for b in resp.content if b.type == "text")

        results = []
        for block in resp.content:
            if block.type == "tool_use":
                try:
                    out = dispatch(block.name, block.input)      # validate + authorise inside
                    results.append({"type": "tool_result", "tool_use_id": block.id, "content": json.dumps(out)})
                except Exception as e:                            # let the model recover
                    results.append({"type": "tool_result", "tool_use_id": block.id,
                                    "content": f"Error: {e}", "is_error": True})
        messages.append({"role": "user", "content": results})
    raise RuntimeError("Agent exceeded max turns")
```
Points to call out: the loop ends when `stop_reason` isn't `tool_use`; multiple `tool_use` blocks can arrive in one turn (run them in parallel); errors go back as `tool_result` with `is_error` so the model can retry differently; cap iterations; log every step for audit.

## How do you write good tool definitions? [Core]
Tools are a prompt surface — the model only knows what the name, description and schema tell it.

- **Name & description**: what it does, **when to use it**, when *not* to, units/currency, what it returns.
- **Narrow, well-typed inputs** (enums for statement types, ISO dates), required vs optional explicit.
- **Return compact, model-friendly output** — the fields needed, stable ids for citations, human-readable labels; paginate big results.
- **Actionable errors** ("company_id not found; search with `search_companies` first").
- Fewer, higher-level tools beat many tiny ones (consolidate "get revenue", "get EBITDA" into `get_financials`).
- Evaluate tool-selection accuracy as part of your evals.

## Explain the common agentic patterns, mapped onto a platform like yours [From resume]
*Illustrative mapping. Use the ones that match how OptimaAI is actually built.*

- **Routing** — classify the conversation and send it to a specialised agent: *company* (corporate borrowers) vs *retail* agent via mcp-agent's router; each has its own prompt and tool subset.
- **Prompt chaining** — CAM generation: extract financials → compute ratios (calculator tools) → draft each section → assemble.
- **Parallelisation** — draft independent CAM sections concurrently; run multiple checks in parallel.
- **Orchestrator–workers** — an orchestrator plans which sections need which data and delegates to workers.
- **Evaluator–optimiser** — a checker validates citations and numbers; failures go back for revision.
- **Human-in-the-loop** — credit manager reviews; the editing agent applies instructions as versioned changes.

## How do you build a safe "editing agent" for a long document (CAM)? [From resume]
- Represent the CAM as **structured sections** (ids, content, citations), not one blob.
- Give the agent **targeted tools**: `get_section`, `replace_section_text`, `insert_table`, `recompute_ratio`, `add_commentary` — instead of "rewrite everything", so diffs stay small and reviewable.
- **Per-turn versioning**: every agent turn produces a new immutable version with a diff, author (user + agent), instruction and tool calls → **audit history**; **rollback** = point the head to an earlier version.
- **Validation** after each turn: citations still resolve, numbers match sources, required sections present.
- **Scope & permissions**: the agent can only edit CAMs the user can edit (RBAC check inside every tool).
- UX: show the diff and let the user accept/reject.

## Multi-agent systems: when are they worth it? [Deep dive]
Benefits: separation of concerns (smaller prompts and tool sets per agent), parallel exploration, context isolation (a research sub-agent reads 50 documents and returns a summary). Costs: more tokens, coordination failures, harder debugging and evaluation. Use them when tasks are genuinely decomposable or when one agent's tool set/prompt grows unmanageable — e.g. region-specific agents (India vs MENA) with different regulations and data sources. Otherwise prefer one agent with good tools.

## How do you defend against prompt injection? [Deep dive]
Untrusted text (uploaded PDFs, emails, web pages, even tool results) can contain instructions. Defences: treat tool/document content as **data** (clear delimiters + system prompt saying so), **least-privilege tools** (read-only where possible, server-side authorisation on every call using the *user's* identity, not the agent's), **human confirmation** for consequential actions (sending, approving, deleting), output filtering (no secrets/PII leakage), allow-listed destinations, and monitoring for anomalous tool sequences. You can't fully "prompt" your way out — enforce in code.

## Google ADK vs mcp-agent vs raw SDK — how did you choose? [From resume]
- **Raw Claude SDK** — maximum control and transparency; you write the loop, retries and tool routing yourself. Good for core flows where you need auditability.
- **mcp-agent** (open source, from LastMile AI) — lightweight framework built around MCP: agents connect to MCP servers, with workflow patterns (router, orchestrator, parallel, evaluator-optimiser) out of the box; fits a platform whose tools are already MCP servers. Used for routing conversations to company/retail agents.
- **Google ADK** — Agent Development Kit with multi-agent hierarchy, session/state management, evaluation tooling and deployment on Google Cloud; model-agnostic.

Selection criteria you can state: does it speak MCP natively, how much control over the loop/prompting, observability hooks, maturity, lock-in, and how easily it fits Temporal for durability.

# Model Context Protocol (MCP) {#mcp}

## What is MCP and why did you choose it? [From resume]
MCP is an **open protocol** (JSON-RPC 2.0) that standardises how AI applications connect to tools and data — "USB-C for AI integrations".

**Why OptimaAI uses it:** with 30+ financial tools across calculator, company, retail, legacy-system and MENA domains, every agent uses **one standard tool interface**. New tools or a new region ship as a new/updated MCP server and agents discover them without code changes; servers are independently deployable, testable and ownable by different engineers; and the same servers work with any MCP-capable client (Claude, IDE assistants, internal tools).

Alternative considered: bespoke function-calling adapters per agent — faster to start, but N agents × M tools integrations and drift.

## Explain MCP architecture: host, client, server and primitives [Core]
- **Host** — the AI application (your agent service / Claude Desktop / IDE). It creates one **client** per server connection and manages consent/security.
- **Server** — exposes capabilities:
  - **Tools** — model-invoked functions with JSON-schema inputs (`calculate_dscr`, `get_company_financials`).
  - **Resources** — application-controlled read-only data addressed by URI (documents, schemas).
  - **Prompts** — reusable, user-invoked templates.
- Client-side features servers can request: **sampling** (ask the host's LLM for a completion), **roots** (filesystem/URI boundaries), **elicitation** (ask the user for input).
- **Lifecycle**: `initialize` handshake with capability negotiation → `tools/list`, `tools/call`, `resources/read` … → notifications such as `tools/list_changed`.
- **Transports**: **stdio** (local subprocess) and **Streamable HTTP** (remote servers; supports streaming via SSE). Remote servers use **OAuth 2.1** for authorisation.

## Write a minimal MCP server in Python [Coding]
```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("calculator")

@mcp.tool()
def debt_service_coverage(net_operating_income: float, total_debt_service: float) -> dict:
    """Compute DSCR = NOI / total debt service. Use for loan repayment capacity.
    Returns the ratio rounded to 2 decimals and the inputs for citation."""
    if total_debt_service <= 0:
        raise ValueError("total_debt_service must be positive")
    return {
        "dscr": round(net_operating_income / total_debt_service, 2),
        "inputs": {"noi": net_operating_income, "debt_service": total_debt_service},
    }

@mcp.resource("ratios://definitions/{name}")
def ratio_definition(name: str) -> str:
    """Definition and formula of a financial ratio."""
    return DEFINITIONS[name]

if __name__ == "__main__":
    mcp.run(transport="streamable-http")   # or "stdio" for local
```
Docstrings and type hints become the tool description and JSON schema — write them for the model.

## How did you structure 5 MCP servers in a FastAPI monorepo? [From resume]
- **One server per bounded context** (calculator, company, retail, legacy, MENA) — independent deploys and ownership; region servers isolate data-residency rules.
- **Shared packages** in the monorepo: auth/RBAC context, DB session factory (SQLAlchemy async), citation helpers (every tool returns `{data, citations: [{id, source, ref}]}`), logging/tracing, error types.
- **Conventions**: tool naming (`verb_noun`), description template, response envelope, pagination, error messages that guide the model.
- **Auth**: the agent service passes the end user's identity/token; each tool enforces lender/division/branch scope — the LLM never decides permissions.
- **Testing**: unit tests per tool, contract tests on schemas, eval suites for tool selection.
- **Versioning**: additive changes are safe; breaking changes get a new tool name and deprecation window.
- Deployed as separate Kubernetes deployments via Helm/ArgoCD, per environment (India, UAE).

## MCP vs plain function calling vs REST APIs [Core]
Function calling is the **model capability** (emit structured tool calls). MCP is the **integration protocol** — how tools are described, discovered, invoked and secured across processes and vendors. REST APIs are for apps; an MCP server often *wraps* REST/DB access and adds model-oriented descriptions, compact outputs and citations. MCP adds overhead (a protocol hop, a server to run); for a single small app with three tools, in-process function calling is fine.

## How do you secure MCP servers in a regulated environment? [Deep dive]
- Remote servers behind auth (OAuth 2.1 / service tokens); **never** trust tool arguments — validate with Pydantic and re-check authorisation using the end user's scopes.
- Least privilege: read-only tools by default; write tools require explicit confirmation flows.
- Network policies so only the agent service can reach servers; mTLS inside the cluster.
- Audit log every `tools/call` (who, which tool, args hash, result ids, latency).
- Don't expose internal stack traces; redact PII in logs.
- Data residency: MENA data served only by MENA-hosted servers.
- Beware of **tool poisoning** from third-party servers — pin versions and review descriptions.

# RAG & vector search {#rag}

## Walk through a RAG pipeline end to end [Core]
**Ingest:** parse documents (PDF annual reports, bank statements) → clean → **chunk** (structure-aware: by section/table, ~300–800 tokens with overlap) → attach **metadata** (lender_id, company_id, doc type, fiscal year, page) → **embed** → upsert to the vector DB (Qdrant).

**Query:** rewrite/expand the user query (optional) → embed → **filtered** vector search (tenant + company + year) → optionally **hybrid** with keyword/BM25 → **rerank** (cross-encoder) → pack top-k chunks with ids into the prompt → generate an answer that cites chunk ids → validate citations.

**Evaluate:** retrieval recall@k / MRR on a labelled set, answer faithfulness and relevance, latency and cost.

## Chunking strategies — what works for financial documents? [Deep dive]
Fixed-size chunks split tables and lose headers. Better: **structure-aware** chunking (headings, page/section boundaries), keep **tables whole** (or convert to row-level records with column headers repeated), prepend a short **context header** to each chunk ("Company X — FY2024 Balance Sheet — Liabilities"), modest overlap for prose. Consider parent-child retrieval: embed small chunks for precision, return the larger parent section for context. For numbers, prefer **structured extraction into tables + SQL/tools** over embedding — vector search is bad at exact figures.

## Why Qdrant? How do HNSW and payload filtering work? [From resume]
Qdrant is an open-source vector DB (Rust) with strong **payload filtering**, good performance, self-hosting on Kubernetes (important for data residency), hybrid dense+sparse search, and quantisation.

- **HNSW** (Hierarchical Navigable Small World) — a layered proximity graph; search greedily descends from sparse top layers to the dense bottom layer. Approximate nearest neighbours in ~log time; tune `m` (edges per node) and `ef` (search breadth) for recall vs speed.
- **Payload filters** — conditions on metadata applied *during* graph traversal (with payload indexes), so filtered search stays accurate instead of post-filtering a top-k that might be empty.
- **Multitenancy** — one collection with a tenant field (`lender_id`) indexed as a tenant key, every query filtered by it; separate collections only for strict isolation needs.
- **Quantisation** (scalar/binary) to cut memory, with rescoring for accuracy.

## Hybrid search and reranking — why bother? [Deep dive]
Dense embeddings capture meaning but miss exact tokens (CIN numbers, ratio names, "Ind AS 116"); sparse/BM25 nails exact terms. **Hybrid** runs both and fuses results (Reciprocal Rank Fusion). A **reranker** (cross-encoder scoring query+chunk together) then reorders the top ~50 to pick the best ~5 — usually the single biggest quality gain after good chunking.

## RAG vs fine-tuning vs long context — how do you decide? [Core]
- **RAG** — knowledge that changes, must be cited, is tenant-specific or large. Default for enterprise Q&A.
- **Long context** — when the relevant corpus for one task is small enough to send whole (one company's annual report) — simpler, often more accurate than retrieval, but costs tokens (use prompt caching).
- **Fine-tuning** — teach *format/style/behaviour* or a narrow skill, not facts; expensive to update and hard to cite.
Often combined: long context for the primary document, RAG for supporting material, tools for live data.

# Citations, grounding & auditability {#citations}

## Design the end-to-end citation pipeline you built [From resume]
**Goal:** every AI statement in a lending decision is traceable to source data (audit requirement) and hallucination risk drops.

1. **Tools return cited data.** Every MCP tool response carries a citation registry: `{ "c12": {source: "balance_sheet", company_id, fy: 2024, line_item: "Total Debt", value: 1520.4, doc_page: 37} }`. Data and provenance travel together.
2. **The LLM may only reference citations.** System prompt + output format: facts must carry markers like `[[c12]]`; the model never invents source descriptions. Optionally numbers themselves are rendered from the citation (`{{c12.value}}`) so the model can't mistype them.
3. **Post-generation validation.** Parse markers → every id must exist in this turn's registry; flag uncited numeric claims; compare numbers near a marker to the cited value.
4. **Persistence.** Store the answer, the registry and tool-call log together with the conversation/CAM version.
5. **UI.** Markers render as clickable chips; clicking opens a **source panel** (statement row, document page with highlight). Credit teams verify in one click.

Result: auditors can reconstruct exactly which data produced each sentence; analysts trust the output more (measure citation click-through and correction rates).

## How do you evaluate faithfulness/groundedness? [Deep dive]
- **Deterministic checks**: citation ids valid, numbers match, required sections present.
- **LLM-as-judge** with a rubric: "Is every claim supported by the cited snippets? List unsupported claims." Calibrate the judge against human labels.
- **Golden datasets**: real (anonymised) companies with expert-written expected facts; run on every prompt/model/tool change in CI.
- **Production signals**: analyst edits per CAM section, rejected answers, thumbs-down reasons.

# Durable agent workflows with Temporal {#temporal}

## Why Temporal for agent and taskbook orchestration? [From resume]
Agent jobs are **long-running and failure-prone**: many LLM and tool calls, rate limits, flaky legacy systems, human approvals that take days. Temporal gives **durable execution** — workflow state is persisted as an event history, so after a crash or deploy the workflow resumes exactly where it was. You get **automatic retries** with backoff per activity, timeouts, **signals/queries** for human-in-the-loop and progress, cron/schedules, and full visibility of every step (great for audit).

Alternatives considered: Celery/RQ + DB status tables (you re-implement state machines, retries and recovery by hand), Airflow (batch DAG scheduler, not interactive per-request workflows), Step Functions (ties you to AWS).

## Workflows vs activities — and the determinism rule [Core]
- **Workflow** code orchestrates; it must be **deterministic** because Temporal **replays** the event history to rebuild state. No network/DB calls, no `datetime.now()`, `random`, or threads inside workflows — use `workflow.now()`, `workflow.random()`, timers.
- **Activities** do the side effects: LLM calls, MCP tool calls, DB writes, PDF generation. They're retried according to their `RetryPolicy` and must be **idempotent** (an activity can run more than once).

```python
import asyncio
from datetime import timedelta
from temporalio import workflow, activity
from temporalio.common import RetryPolicy

@activity.defn
async def draft_section(cam_id: str, section: str) -> str:
    return await llm_draft(cam_id, section)               # side effects live here

@activity.defn
async def save_draft(cam_id: str, drafts: list[str]) -> None:
    await repo.save_cam_draft(cam_id, drafts)             # idempotent upsert

@workflow.defn
class GenerateCamWorkflow:
    def __init__(self) -> None:
        self.approved = False

    @workflow.signal
    def approve(self) -> None:
        self.approved = True

    @workflow.run
    async def run(self, cam_id: str) -> str:
        sections = ["business", "financials", "risks", "recommendation"]
        drafts = await asyncio.gather(*[                 # parallel, each retried independently
            workflow.execute_activity(
                draft_section, args=[cam_id, s],
                start_to_close_timeout=timedelta(minutes=5),
                retry_policy=RetryPolicy(maximum_attempts=5, backoff_coefficient=2.0),
            ) for s in sections
        ])
        await workflow.execute_activity(save_draft, args=[cam_id, drafts],
                                        start_to_close_timeout=timedelta(seconds=30))
        try:                                              # human review, up to 7 days
            await workflow.wait_condition(lambda: self.approved, timeout=timedelta(days=7))
        except asyncio.TimeoutError:                      # raised when the timeout elapses
            return "expired"
        return "approved"
```

## How do you scale to 100+ concurrent workflows reliably? [From resume]
- Workflows are cheap (state in Temporal); throughput is governed by **workers** and downstream limits. Scale worker deployments horizontally on Kubernetes (HPA on task-queue backlog).
- Separate **task queues** by workload (LLM-heavy, DB-heavy, PDF export) so one can't starve the others; set `max_concurrent_activities` per worker.
- Protect LLM/API **rate limits** with a token-bucket in Redis or a dedicated low-concurrency queue.
- **Heartbeats** for long activities so stuck ones are detected and retried.
- Idempotency keys on writes; **saga** compensation for multi-step side effects.
- Use **continue-as-new** for very long workflows to keep event histories small.
- Versioning with `workflow.patched()` so in-flight workflows survive code deploys.

## How do you handle a step that keeps failing (poison activity)? [Deep dive]
Classify errors: **retryable** (timeouts, 429/5xx) vs **non-retryable** (validation, missing data — mark with `non_retryable_error_types` or raise `ApplicationError(non_retryable=True)`). Cap attempts, then catch in the workflow and route to a **fallback** (smaller model, cached data) or a **human task** (signal-driven). Alert on workflows stuck beyond an SLA, and make the failure visible in the UI ("Waiting for legacy system — retrying").

# Evaluation, observability & guardrails {#evals}

## How do you evaluate an agentic system? [Core]
Layered:
1. **Component evals** — tool selection accuracy, argument correctness, retrieval recall, routing accuracy (company vs retail).
2. **Task evals** — end-to-end on a golden set: is the CAM complete, correct, cited? Rubric-based LLM-as-judge + deterministic checks + spot human review.
3. **Trajectory evals** — number of steps, redundant tool calls, loops, cost and latency per task.
4. **Online** — user feedback, edit rates, time-to-review-ready CAM (< 1 hour is your headline metric), escalations.

Run evals in CI on every prompt/model/tool change; keep a **regression set** built from production failures.

## What do you log/trace for LLM features? [Core]
Per request: trace id, user/tenant, model + version, prompt template version, token counts (input/cached/output), latency (TTFT and total), each tool call (name, args hash, duration, error), retrieved chunk ids, citations, final output, user feedback. Use OpenTelemetry-style spans (e.g. Langfuse, LangSmith, or OTel export from your agent framework) so you can replay a bad answer end to end. Redact PII; respect retention rules.

## Guardrails you'd put around a credit-underwriting assistant [Design]
- **Input**: authN/authZ, tenant scoping, PII detection, prompt-injection heuristics on uploaded docs.
- **Behavioural**: system prompt limits (no final credit decisions, no advice outside lender policy), refusal templates.
- **Tool-level**: server-side permission checks, read-only defaults, confirmation for writes, rate limits.
- **Output**: citation validation, numeric consistency checks, toxicity/PII filters, mandatory disclaimers.
- **Process**: human approval for CAM sign-off, full audit trail, model/prompt change management (evals + staged rollout).

## How do you roll out a new model or prompt safely? [Deep dive]
Offline evals on the golden set → shadow mode (run new version, don't show) and compare → canary to one lender/internal users behind a feature flag → monitor quality, cost, latency, error rates → gradual rollout with instant rollback (config, not code). Pin model versions; never let "latest" silently change behaviour in a regulated product.

# Real-time voice agents {#voice}
How a phone or app voice agent works: audio in, words understood, the agent decides, audio out, all in about a second. This is the part of a voice-AI role your resume doesn't show yet, so learn the moving parts and connect each one to what you already built.

## Design a real-time voice AI agent end to end [Design]
**Example to practise:** a Hindi voice agent that answers a hospital's phone line and books, moves or cancels appointments.

**1. Clarify first (2 minutes).** Phone calls or an app? Which languages? How many calls at the same time? What can it do (book only, or also answer questions)? What must go to a human? Where does the hospital's data live?

**2. The pipeline** (this is the "cascade" design most teams use):

```text
caller ⇄ phone network (SIP)  or  browser / app (WebRTC)
      ⇄ telephony provider / media server
      ⇄ voice gateway  (your service, one long-lived connection per call)
           → VAD + turn detection   (is the caller speaking? have they finished?)
           → streaming speech-to-text   (partial + final words)
           → agent: LLM + tools + call state   (find_slot, book, cancel, transfer_to_human)
           → streaming text-to-speech   (audio chunks)
      ← audio back to the caller
side systems: Redis (live call state) · Postgres (appointments, call logs)
              queue / Temporal (after the call: summary, CRM update, SMS)
              tracing + metrics for every stage
```

**3. Key decisions to talk through**
- **Cascade vs speech-to-speech model.** A cascade (STT → LLM → TTS) gives you the transcript, tool calls and logs at every step, which matters in healthcare. Speech-to-speech models can be faster and sound more natural, but they're harder to control and audit. Say which you'd pick and why.
- **Every call is stateful and long-lived.** Keep the session on one worker (sticky routing) and save checkpoints to Redis, so a crash doesn't lose the booking.
- **Tools are normal backend APIs** with timeouts and idempotency keys. The agent reads back the details ("Tuesday 10 am with Dr Mehta, right?") before it books.
- **Safety.** The agent gives no medical advice. Words like "chest pain" or "emergency" hand off to a human right away. Announce that the caller is talking to an AI, and that the call is recorded.
- **Scale = live calls, not requests.** Each call holds a socket plus STT, LLM and TTS streams. Scale the gateway workers horizontally, and watch vendor rate limits and concurrency caps.
- **After the call** run the slow work asynchronously: summary, CRM update, confirmation SMS. That's exactly the Temporal pattern you already run at OptimaAI.

**4. Close with how you'd measure it:** latency per stage, task success rate, how often calls go to a human, and cost per call.

## Where does the latency go in a voice call, and how do you cut it? [Deep dive]
In a normal conversation people reply within a fraction of a second. A voice agent usually feels fine if it starts talking within about **1 second** of the caller stopping, and feels slow past roughly 1.5–2 seconds. These are rough targets; measure your own.

**Where the time goes** (rough ranges, they vary a lot by vendor and region):

| Stage | Typical time |
|---|---|
| Deciding the caller has finished (end-of-turn) | 200–500 ms |
| Final words from streaming speech-to-text | 100–300 ms |
| LLM first token | 200–600 ms |
| Text-to-speech first audio | 100–300 ms |
| Network + phone line | 100–200 ms |

**How to cut it**
- **Stream every stage.** Send audio to STT as it arrives, and start TTS on the **first sentence** of the LLM's answer instead of waiting for the whole reply.
- **Use a fast model for the live turn.** Keep prompts short, use prompt caching, and move heavy reasoning (summaries, analysis) to after the call.
- **Keep everything close.** Put the vendors' servers in the same region as your users (India), and keep persistent connections open so you don't pay a new handshake every turn.
- **Hide slow tools.** Say a short filler ("Let me check that for you") while a slow lookup runs, or start likely lookups early.
- **Measure p50 and p95 for each stage**, not one total number, so you know which stage to fix.

## How do you handle interruptions (barge-in) and turn-taking? [Deep dive]
- **Barge-in:** when voice activity detection (VAD) hears the caller while the agent is speaking:
  1. stop playback immediately and flush the audio buffer;
  2. cancel the in-flight LLM and TTS work;
  3. save only the part of the reply that was actually played, so the agent doesn't "remember" saying things the caller never heard.
- **End of turn:** silence alone is a bad signal. People pause to think, and Hindi speakers often use fillers like "haan", "matlab" or "woh". Combine VAD, a short silence window and a small end-of-turn model, and tune it per language.
- **Backchannels:** "haan ji" or "hmm" while the agent talks usually means "go on", not "stop". Don't treat every sound as an interruption.
- **Echo:** use echo cancellation, so the agent doesn't hear its own voice through the caller's speaker and interrupt itself.
- **Test on real phone audio.** Phone lines are noisy and low quality (8 kHz), very different from a clean laptop mic.

## WebSockets vs WebRTC vs phone lines (SIP): which and when? [Core]
- **Phone calls (PSTN / SIP):** most hospital and bank calls in India are ordinary phone calls. A telephony provider (for example Exotel, Plivo or Twilio) connects the call and streams the audio to your server, often over a WebSocket as small 8 kHz chunks.
- **WebRTC:** use it for voice inside a browser or mobile app. It's built for live media: it runs over UDP, handles jitter and does echo cancellation. With many calls you add a media server or SFU (for example LiveKit).
- **WebSockets:** simple and fine for audio between your own services in one data centre. They run over TCP, so on a bad mobile network one lost packet delays everything behind it.

**Rule of thumb:**
- phone numbers → a telephony provider;
- browser or app → WebRTC;
- between your own services → WebSocket or gRPC streams.

## How do you test and monitor a voice agent? [Core]
**Before a release**
- Build a test set of call scripts and recorded real calls, with the expected result for each (right slot, right patient name, right language). Include Hindi, English, Hinglish, accents and noisy lines.
- Run **simulated callers**: an LLM plays the patient, TTS speaks for it, and your agent answers. Run hundreds of these after every prompt or model change, the same idea as your offline eval set at OptimaAI.
- Score the transcripts: was the task done, were any facts wrong, did it follow the policy (no medical advice, correct handoff)?

**In production**
- **Latency** p50 and p95 for every stage, plus total time to first audio.
- **Quality:**
  - task success rate;
  - human-handoff rate;
  - hang-ups mid-call;
  - STT error rate on a reviewed sample;
  - tool error rate.
- **Cost** per call and per minute.
- **One call ID across every service** (tracing), so you can replay one bad call end to end.
- **Alerts on SLOs** (for example, "p95 time to first audio above 1.5 s for 5 minutes").
- **A weekly review** of sampled calls with someone from the hospital or bank.

## How do you keep patient data safe in a voice AI product? [Core]
- **Collect only what you need.** Tell callers they're talking to an AI and that the call is recorded, and get consent.
- **Know the law.** India's **Digital Personal Data Protection (DPDP) Act, 2023** covers personal data. Health data needs extra care, and **HIPAA** applies if you serve US healthcare clients. Say you'd involve legal/compliance; don't pretend to be the expert.
- **Encrypt** audio and data in transit and at rest. **Keep data in the required country.** You already ran separate India and UAE environments, which is the same idea.
- **Redact** names, phone numbers and medical details from logs and from the transcripts you use for testing and evals.
- **Control access:** role-based access (your lender → division → branch RBAC is the same skill), and an audit log of who listened to or read what.
- **Check vendors:** confirm the STT, LLM and TTS providers don't train on your data, and that a data processing agreement is signed.
- **Keep the AI in scope:** no diagnosis or medical advice, and a clear, fast path to a human.

# AI system design {#ai-design}

## Design OptimaAI: an AI credit-underwriting platform [Design]
**Requirements:** analysts ask questions about a borrower, generate a CAM, edit it via instructions; multi-tenant (10 lenders), India + MENA data residency, 6 personas with hierarchical RBAC, auditability, 99.9% uptime.

**Architecture:**
- **React SPA** → **API gateway / FastAPI BFF** (auth via OAuth/JWT, RBAC context).
- **Agent service** — conversation management, routing (mcp-agent) to company/retail agents, Claude via SDK, streaming SSE to the UI.
- **MCP servers** (calculator, company, retail, legacy, MENA) — tools over PostgreSQL, Qdrant, legacy systems; return cited data.
- **Temporal** — CAM generation, taskbooks, RFP orchestration, document ingestion; workers per task queue.
- **Data** — PostgreSQL (entities, CAM versions, audit log), Redis (cache, rate limiting, sessions), Qdrant (document chunks), object storage (PDFs, exports).
- **Ingestion pipeline** — upload → parse/OCR → extract tables → chunk/embed → index (Temporal workflow).
- **Observability** — traces, metrics, LLM evals dashboards.
- **Deployment** — Kubernetes + Helm + ArgoCD, separate India and UAE clusters/environments; data never crosses regions.

**Key decisions to defend:** MCP for tools, Temporal for durability, citation-first output, versioned CAM model, region isolation, model routing for cost.

## Design per-turn versioning, audit history and rollback for AI edits [Design]
Data model:
- `cam(id, borrower_id, head_version_id, status)`
- `cam_version(id, cam_id, parent_version_id, created_by_user, created_by_agent_turn, instruction, content_jsonb, diff_jsonb, created_at)` — **immutable** rows (append-only).
- `agent_turn(id, conversation_id, model, prompt_version, tool_calls_jsonb, tokens, latency)`.
- `audit_event(id, actor, action, entity, entity_id, before_hash, after_hash, at)`.

Edit flow: user instruction → editing agent works on the head version via tools → produces a new version (with diff + citations) in a **transaction** that also moves `head_version_id` (optimistic locking on the old head to prevent lost updates if two people edit). Rollback = create a new version whose content equals an older one (keeps history linear and auditable) or move head with an audit event. Large content: store sections separately to diff cheaply.

## Design a document ingestion pipeline for financial statements [Design]
Upload to object storage (pre-signed URL) → Temporal workflow: virus scan → classify document type → OCR/parse (layout-aware) → **table extraction** → map line items to a canonical chart of accounts (LLM + rules, with confidence) → human review queue for low-confidence fields → write structured financials to PostgreSQL with provenance (doc, page, bbox) → chunk & embed narrative sections into Qdrant → mark ready. Idempotent per document hash; retries per step; progress visible to the UI via workflow queries.

## How would you support India and UAE deployments with data residency? [Design]
Separate **regional stacks** (clusters, databases, vector stores, object storage, Temporal namespaces) with the same code deployed via GitOps overlays (Helm values per region). A global control plane only holds non-sensitive config. Route users to their region at login (tenant → region mapping). LLM provider endpoints chosen per region and contractually compliant. Region-specific MCP server (MENA) encapsulates local data sources and regulations. Cross-region analytics only on anonymised aggregates.

# Leading AI engineering {#ai-leadership}

## How do you use AI coding tools (Claude Code, Windsurf) across a team responsibly? [From resume]
Use them for scaffolding, tests, refactors, migrations and exploring unfamiliar code; keep humans accountable for design and review. Team practices: a repo-level instructions file (conventions, architecture, how to run tests), require tests for AI-written code, same code-review bar (no "the AI wrote it"), no secrets/customer data in prompts, and measure impact (cycle time, defect rate) rather than vibes. Share good prompts/workflows in team demos.

## How do you explain an AI feature's limitations to credit and business stakeholders? [Core]
Frame it as **decision support, not decision making**. Show where answers come from (citations), what it can't do (no data → no answer), the measured accuracy on their own historical cases, and the human checkpoints. Agree on success metrics up front (turnaround time, analyst edits, error rates) and review them in a regular cadence; collect feedback in-product.
