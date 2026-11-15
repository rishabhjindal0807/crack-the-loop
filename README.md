# Crack the Loop

**Live site:** https://rishabhjindal0807.github.io/crack-the-loop/

Rishabh's interview-preparation hub.

A personal interview-preparation site with four tracks:

| Track | What's inside |
|---|---|
| **DSA** | 137 problems across 18 topics. Every Bosscoder Notes problem from Lectures 1–9 (marked 📒), plus the rest of the curriculum: strings, hashing, two pointers, linked list, stack/queue, trees, heaps, greedy, DP, graphs and tries. Each problem has brute-force → optimal **JavaScript** solutions, complexity, an explanation and a **Run tests** button that executes the code in your browser. |
| **UI / Frontend** | JavaScript, machine-coding polyfills, React 18, TypeScript, Angular/RxJS, performance, accessibility, security and frontend system design |
| **Agentic AI** | LLM fundamentals, agents and tool use (Claude SDK), MCP, RAG with Qdrant, the citation pipeline, Temporal workflows, evals and AI system design (OptimaAI) |
| **Backend** | Python/asyncio, FastAPI, PostgreSQL + async SQLAlchemy, Redis, API design, OAuth/JWT + hierarchical RBAC, distributed systems, system design, Kubernetes/GitOps, testing and leadership |

You can mark items done or ★ star them for a revision list. Progress is saved in your browser's localStorage.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # runs every approach of every DSA problem against its test cases
npm run build      # static site in dist/
npm run preview    # serve the production build locally
```

Requires Node 20+. Stack: Vite, React 19 and Tailwind CSS v4, with HashRouter, so the build works from any static host or sub-path.

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`. That workflow tests, builds and publishes to **GitHub Pages**.
One-time setup: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Add your own content

- **DSA problem:** add an object to a topic file in `src/data/dsa/`. You need `id`, `title`, `difficulty`, `statement`, and `approaches[]` (each with `name`, `time`, `space` and `code`), plus `fn` and `tests[]`. Set `from: 'Lec N – …'` to tag it as a Bosscoder Notes problem. Run `npm test` before you push.
- **UI / AI / Backend Q&A:** edit the Markdown in `src/data/content/*.md`:

  ```md
  # Category title {#category-id}
  Optional one-line summary.

  ## Your question here [Core | Deep dive | From resume | Design | Coding]
  Answer in Markdown, including fenced code blocks.
  ```

Links: [LeetCode](https://leetcode.com/u/rishabhjindal0807/) · [Bosscoder curriculum](https://www.bosscoderacademy.com/platform/curriculum)
