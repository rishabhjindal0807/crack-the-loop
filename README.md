# Crack the Loop

**Live site:** https://rishabhjindal0807.github.io/crack-the-loop/

Rishabh's interview-preparation hub.

A personal interview-preparation and knowledge system: **capture → organize → learn → practice → revise**.

| Section | What it's for |
|---|---|
| **Today** (`/`) | What to do next: the next unsolved problem in your current class, your revise queue and recent interview questions. |
| **Practice** (`/classes`, `/dsa`, `/leetcode`) | 215 DSA problems with runnable JavaScript solutions, step-through diagrams and proofs. Browse them by Bosscoder class, by topic, or through your LeetCode history. |
| **Concepts** (`/ui`, `/ai`, `/backend`) | Interview Q&A for frontend, agentic AI and backend, mapped to the resume. |
| **Interviews** (`/interviews`) | Log every question you're asked, grouped by company → round, and link each to the matching problem or concept. |
| **Revise** (`/revise`) | Everything marked Revise, all your notes, LeetCode retries and your weakest topics. |

Press **⌘K / Ctrl K** (or `/`) to search everything.

**Your data:**
- Every problem and question has one status (To do · Solved · Revise · Mastered) and a notes box.
- Status, notes and the interview log are saved in this browser's `localStorage` (`prep-progress-v1`). Use **Export backup / Import backup** in the footer to keep a copy or move to another device.
- To make interview questions permanent and visible on every device, put them in `src/data/interviews.js`.

The product audit behind this structure is in [`docs/PRODUCT_AUDIT.md`](docs/PRODUCT_AUDIT.md).

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
