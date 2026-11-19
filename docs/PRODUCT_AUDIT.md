# Crack the Loop — Product Audit & Roadmap

*19 Nov 2026 · audited the deployed site (https://rishabhjindal0807.github.io/crack-the-loop/) against `main` (`cb4493a`).*

**Method:**
- Crawled all 302 internal routes in a headless browser.
- Ran axe-core (WCAG 2 A/AA + best practice) on one page of each type, in light and dark mode.
- Measured tap targets at 390 px.
- Tab-tested keyboard focus.
- Read every page, component and data file.

---

## 1. Current product overview

A static React 19 + Vite + Tailwind v4 site on GitHub Pages (HashRouter, `base: './'`). There's no backend: all content is in the repo, and progress is kept in `localStorage['prep-progress-v1']`.

| Area | Routes | Content |
|---|---|---|
| Home | `/` | Profile hero, current-class strip, LeetCode strip, 4 section cards, 60-second pitch, "Up next in DSA" |
| DSA | `/dsa`, `/dsa/:topic`, `/dsa/:topic/:q` | 19 topics · 215 problems · 896 runnable tests · step-through diagrams · KaTeX proofs |
| Classes | `/classes`, `/classes/:id` | 29 Bosscoder Module 1 classes → 132 linked problems |
| UI / Agentic AI / Backend | `/ui/:cat?`, `/ai/:cat?`, `/backend/:cat?` | 168 Q&A items parsed from `src/data/content/*.md` |
| My LeetCode | `/leetcode` | 74 accepted submissions, 3 to retry, topic coverage |
| ★ Revision | `/starred` | Starred DSA problems + Q&A items |

**Health check:**
- 0 broken internal links.
- 0 console errors.
- 0 "not found" pages.
- All 896 solution tests pass.

**What's genuinely good:**
- The content is deep: runnable JS, brute-force → optimal approaches, diagrams and proofs.
- Problems are linked to real classes.
- Your own accepted LeetCode solutions are kept verbatim.

Keep all of that.

## 2. Existing features and user journeys

1. **"What do I do today?"** You land on Home, then pick between three unrelated "next" prompts:
   - the IL9 class strip;
   - "3 to retry" on LeetCode;
   - "Up next in DSA", which suggests *Maximum of |arr[i]−arr[j]|…*. That's the first unsolved problem in curriculum order and has nothing to do with the Linked List class you're on.
2. **Practise a class problem:** Home or Classes → class → problem → read, step through the diagram, run tests → ✓.
3. **Study a concept:** UI / AI / Backend → category → expand a question → ✓ / ★.
4. **Revise before an interview:** ★ Revision → a flat list of starred items.
5. **Record a real interview:** *not possible.* The only interview data is a "Walmart SDE-3 loop" category inside `ui.md`, which is someone else's reported loop.

## 3. UX problems

| # | Problem | Where | Severity |
|---|---|---|---|
| U1 | **7 top-level nav items + 2 external links.** They mix knowledge areas (DSA, UI, AI, Backend) with *alternative views of the same 215 problems* (Classes, My LeetCode) and a workflow (Revision). On mobile all of it is hidden behind ☰. | `App.jsx` `nav` | P0 |
| U2 | **Home doesn't say what to do next.** The hero is about *you* (you know who you are): about 1/3 of the desktop view and the whole first mobile screen. Three competing "next" prompts, one of them wrong. | `Home.jsx` | P0 |
| U3 | **Progress is ambiguous.** ✓ (done) and ★ (star) are independent. "Done" is also set automatically for any LeetCode AC, so 77/215 "done" doesn't mean understood. There's no way to say "mastered" or "shaky". | `lib/progress.js`, `DoneToggle`, `StarToggle` | P0 |
| U4 | **Progress can be lost.** It lives only in this browser. Clearing site data, switching laptop or opening on a phone loses everything, and there's no export or backup. | `lib/progress.js` | P0 |
| U5 | **Nowhere to capture real interview questions** (company, round, date, technology): the #1 goal in the vision. | — | P1 |
| U6 | **No personal notes.** You can't write "I forgot `slow.next = null` last time" against a problem. | — | P1 |
| U7 | **Three separate search boxes** (DSA home, each Q&A area, Classes) and no global search. | `DsaHome.jsx`, `QnaSection.jsx`, `Classes.jsx` | P1 |
| U8 | **Weak areas aren't visible.** Topic coverage exists only on the LeetCode page, and only counts LeetCode submissions. | `LeetCode.jsx` | P1 |
| U9 | Wide diagrams need sideways scrolling on phones (`min-w-[560px]`), with no hint. | `LinkedListVisual.jsx` | P2 |
| U10 | "JS challenges" shows under "Coming up" / "Not covered in class yet", which is the wrong label. | `m1/leetcode-extra-2.js` | P2 |

## 4. Design inconsistencies

- **Three gradient hero blocks with different palettes:** indigo→violet on Home, orange→amber full-bleed on My LeetCode, indigo→violet on the current-class strip. Each page invents its own look.
- **Roughly ten badge colours:**
  - difficulty (3);
  - Q&A level (Core sky, Deep dive violet, From resume amber, Design rose, Coding emerald);
  - class code (indigo / violet);
  - LeetCode status (emerald / orange);
  - notes (indigo).

  Colour no longer means anything.
- **Emoji as iconography:** topic icons (📊 🔢 ➗ 🔍 🌀 ♟ 📶 👉 #️⃣), 📒 🧑‍🏫 📝 📍 🎨 🤖 ⚙️. They render differently per OS and add noise.
- **Cards everywhere,** including cards inside cards. Every list item on Q&A pages is its own bordered card.
- **Uppercase tracked micro-labels** in `text-slate-400` on most cards. They fail contrast and compete with real headings.
- **Font:** `--font-sans` names *Inter*, but Inter is never loaded, so the site renders in whatever font each device happens to have.

## 5. Accessibility (WCAG 2.1 AA)

| Finding | Criterion | Scope | Severity |
|---|---|---|---|
| Text contrast: `#90a1b9` on `#f8fafc` = **2.51:1**; dark mode `#62748e` on `#0f172b` = 3.74:1 | 1.4.3 | 217 nodes / 8 pages (light), 148 / 11 (dark) | 🔴 |
| Tap targets: ✓ toggle 20×20, ★ 17×16, Q&A chevron **6×24** | 2.5.5 (2.5.8 min 24) | ~200 per Q&A page on mobile | 🔴 |
| ✓ / ★ toggles have no `aria-pressed`; ★ is named only by `title` | 4.1.2 | every list | 🟡 |
| Links inside text are identified only by colour (1.35:1 against text) | 1.4.1 | Classes / ClassDetail footers | 🟡 |
| No skip link; focus ring is the faint browser default | 2.4.1 / 2.4.7 | global | 🟡 |
| Empty `<th>` in the LeetCode table; `h4` after `h2` in markdown | 1.3.1 | LeetCode, Q&A | 🟢 |

## 6. Unnecessary complexity

- **Classes, Topics and My LeetCode** are three top-level destinations for **one** set of problems. They should be three *views* inside Practice.
- **UI / Agentic AI / Backend** are three top-level destinations for **one** kind of content (concept Q&A). They should be one section with an area switcher.
- **✓ + ★ + LeetCode badge + 📒 class tag** on every row: four signals where one status would do.
- **Home's four section cards** repeat the nav with a progress bar each.
- **LeetCode / GitHub links in the header** are useful once a week but take prime space on every page.

## 7. Product opportunities (with a value check)

| Idea | Verdict | Why |
|---|---|---|
| **Interview log**: capture questions by company, round, date and technology; link to existing problems | **Build** | It's the missing first step of *capture → organize → learn → revise*, and the thing no question bank gives you. |
| **One status per item: To do / Solved / Revise / Mastered** | **Build** | It answers "what have I mastered vs what needs revision" with one control instead of two. |
| **Personal notes** on every problem and concept | **Build** | Your own mistakes are the most valuable revision material. |
| **Backup: export / import** | **Build** | It's the cheapest way to make browser-only data safe, and it carries interview logs between phone and laptop. |
| **Global search (⌘K / Ctrl K)** | **Build** | 383 items across 5 areas; one box beats three. |
| **Revise queue** with weak areas | **Build** (upgrade ★ Revision) | Turns stars into a real "night before" list. |
| Spaced-repetition scheduler, streaks, gamification | **Don't build** | Needs notifications or a backend to be meaningful; a Revise queue with "last touched" is enough at this scale. |
| Accounts / cloud sync | **Don't build (now)** | GitHub Pages has no backend. Export / import, plus committing your interview log to the repo through Claude, covers it. |
| In-app AI answers | **Don't build** | You already get them here, in chat, and they land in the repo reviewed. |

## 8. Recommended information architecture

Five destinations, each with one job:

```
Today        /            What should I do next?  Continue class · revise queue · recent interviews · backup
Practice     /classes     DSA.   Tabs: By class (default) · By topic (/dsa) · LeetCode (/leetcode)
Concepts     /ui          Q&A.   Tabs: Frontend (/ui) · Agentic AI (/ai) · Backend (/backend)
Interviews   /interviews  Capture & review real interviews by company → round; your 60-second pitch
Revise       /revise      Everything marked Revise, notes, LeetCode retries, weak areas
+ ⌘K search · theme toggle      (LeetCode / GitHub / LinkedIn links move to the footer)
```

- Every old URL keeps working: `/starred` redirects to `/revise`, and `/dsa/*`, `/classes/*`, `/leetcode`, `/ui|ai|backend/*` are unchanged.
- **Mobile:** a 5-item bottom tab bar replaces the ☰ menu, so the main destinations are always one tap away.

## 9. Redesign direction

- **Calm, neutral canvas:**
  - white or near-black surfaces with `slate` neutrals and **one** accent (indigo) for primary actions and the current state;
  - colour is kept for meaning only: difficulty and status.
- **No gradients, no emoji icons, fewer cards:**
  - lists become simple rows on one surface, separated by hairlines (Linear-style);
  - cards are kept only for distinct objects (a class, an interview).
- **Typography:**
  - the system UI font stack (SF Pro on Apple, Segoe UI on Windows), so it looks native and costs no download;
  - a clear scale: 28 / 20 / 16 / 14 / 12;
  - sentence-case section labels instead of tracked uppercase.
- **Accessible by default:**
  - every text token at least 4.5:1;
  - tap targets 24 px minimum (36–44 px on mobile);
  - visible focus ring, `aria-pressed` on toggles, skip link.
- **One status control** on detail pages (To do · Solved · Revise · Mastered), and a compact status dot in lists.

## 10. Prioritized roadmap

| P | Item | Files |
|---|---|---|
| **P0** | 1. New IA: 5-item header + mobile tab bar, Practice and Concepts tabs, `/starred` → `/revise` | `App.jsx`, new `components/SectionTabs.jsx` |
| **P0** | 2. Today dashboard replaces Home | `pages/Home.jsx` |
| **P0** | 3. Status model + migration (no data lost) + export / import backup | `lib/progress.js`, `components/ui.jsx` |
| **P0** | 4. Accessibility pass: contrast tokens, tap targets, ARIA, focus, skip link | `index.css`, `ui.jsx`, pages |
| **P1** | 5. Interview log (`/interviews`), with your 60-second pitch | new `pages/Interviews.jsx`, `lib/interviews.js` |
| **P1** | 6. Personal notes on problems and concept questions | `ui.jsx` `NotesBox`, `DsaQuestion.jsx`, `QnaSection.jsx` |
| **P1** | 7. ⌘K global search | new `components/CommandSearch.jsx` |
| **P1** | 8. Visual system cleanup (gradients, emoji, badges, font, cards) | all pages |
| **P1** | 9. Revise page: queue + notes + retries + weak areas | `pages/Revise.jsx` (replaces `Starred.jsx`) |
| **P2** | 10. Lazy-load the problem page (KaTeX / highlight.js out of the first load) | `App.jsx` |
| **P2** | 11. "Scroll →" hint on wide diagrams on phones; fix the JS challenges label; fix markdown heading levels | `LinkedListVisual.jsx`, data |

### Data-safety rules for the implementation

- Existing `done` and `star` maps in `prep-progress-v1` are **never rewritten or deleted**. The new `status` map takes priority; when an item has no status yet, it's derived from the old maps:
  - ★ → Revise;
  - ✓ or LeetCode AC → Solved;
  - otherwise To do.
- Nothing is removed from the product without a home: the profile summary and links move to the footer, and the 60-second pitch moves to Interviews.
