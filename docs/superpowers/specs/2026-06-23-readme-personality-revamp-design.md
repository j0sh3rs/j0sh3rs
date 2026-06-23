# README Personality Revamp — Design

**Date:** 2026-06-23
**Repo:** `j0sh3rs/j0sh3rs` (GitHub profile README)
**Goal:** Make the profile README more fun and personally telling — surface what Josh
enjoys (Marvel, soccer, existential philosophy, homelab) and what his repos prove he's
strong at (Kubernetes/GitOps, self-hosted AI, networking/TLS, monitoring) — without
reading like a resume.

## Decisions (locked during brainstorming)

- **Vibe:** Playful hybrid — punchy human intro, then "what I'm into" + "what I tinker
  with", badges retained.
- **Strengths presentation:** Themed brag list (grouped bullets, honest, no resume-speak).
- **Personal topics to feature:** Homelab-as-hobby, spread-joy/mentorship, Marvel Comics
  (X-Men, Spider-Man, Legion, Nightcrawler), soccer (World Cup, Messi > Ronaldo),
  existential philosophy (Wittgenstein, Heidegger, Gadamer).
- **Existing widgets:** Keep ALL (tool icons, top-langs, stats, streak, profile views) but
  restyle/reorganize so they support the narrative instead of floating at the bottom.
- **Format ambition:** Rich static HTML + a curated set of dynamic widgets (Approach A —
  curated & resilient, not the maximalist toybox).

## Page structure (top → bottom)

1. **Hero** — centered name + animated typing-SVG cycling personality lines.
2. **Who I am** — short punchy human intro prose (Marvel, soccer, philosophy, joy/mentorship).
3. **What I'm into** — themed personal mini-rows: 🦾 Marvel · ⚽ Soccer · 🧠 Philosophy ·
   🏠 Homelab-as-hobby.
4. **What I tinker with** — themed brag list grouped by: Kubernetes & GitOps / Self-hosted
   AI / Networking & TLS / Monitoring.
5. **Badges** — machine-managed block, untouched (`<!-- my-badges start/end -->`).
6. **The Stats** — restyled: curated quote block + top-langs + stats + streak + tool icons,
   grouped under one banner with dividers.
7. **Snake** — self-hosted contribution-graph animation.
8. **Connect** — socials (dev.to, LinkedIn) + profile-view counter.

## Dynamic widgets (Approach A — curated & resilient)

### 1. Typing-SVG hero
- Source: `readme-typing-svg` (DenverCoder1) rendered as a single `<img>`.
- Cycles personality lines, e.g.:
  - "DevOps & Platform Engineer who'd rather be in the homelab"
  - "Kubernetes at home because why not"
  - "Messi > Ronaldo. This is not a debate."
  - "Commits at midnight. Swears at YAML. Fixes it 6 times."
  - "X-Men > everyone. Nightcrawler enjoyer."
- Config (colors/speed/font) via URL query params. Degrades to alt text if the service
  dies. No build step.

### 2. Curated philosophy quote (daily rotation)
- **Source of truth:** `quotes.json` — array of objects:
  ```json
  [
    { "quote": "Whereof one cannot speak, thereof one must be silent.", "author": "Wittgenstein" },
    { "quote": "We are ourselves the entities to be analyzed.", "author": "Heidegger" }
  ]
  ```
  (values above are synthetic seed examples; real list seeded at build time)
- **Render target:** plain Markdown blockquote inside a marker block in `README.md`:
  ```
  <!-- quote start -->
  > "..." — Author
  <!-- quote end -->
  ```
- **Mechanism:** `.github/workflows/quote.yaml`, cron daily + `workflow_dispatch`. Inline
  script selects a quote **deterministically by day-of-year** (idempotent — reruns same day
  produce no diff), rewrites the marker block, commits only if changed.
- **Rationale for marker-block over SVG:** crisp/theme-aware/accessible Markdown, and mirrors
  the existing `my-badges` convention for repo consistency.

### 3. Snake contribution animation
- Source: `Platane/snk` GitHub Action → `.github/workflows/snake.yaml`.
- Runs on schedule + push; generates an SVG committed to an `output` branch.
- README references the raw SVG from that branch. Self-hosted → no third-party uptime risk.

## Files touched / created

| File | Action |
|------|--------|
| `README.md` | Restructured into the 8 sections; adds `<!-- quote start/end -->` markers; regroups widgets; keeps `<!-- my-badges start/end -->` byte-identical and in place. |
| `quotes.json` | New — seed philosophy quotes. |
| `.github/workflows/quote.yaml` | New — daily quote rotation. |
| `.github/workflows/snake.yaml` | New — contribution snake → `output` branch. |
| `CLAUDE.md` | Update — document the new marker block + two workflows. |

## Conventions (critical)

- **Marker blocks are machine-owned. Never hand-edit:**
  - `<!-- my-badges start/end -->` → owned by `update-my-badges`.
  - `<!-- quote start/end -->` → owned by `quote.yaml`.
- Everything else in `README.md` → hand-edit freely.
- Two **separate** workflow files (not one combined) — distinct concerns, distinct failure
  modes, independently disableable.

## Risks & mitigations

- **Typing-SVG third-party rot:** single `<img>`, degrades to alt text. Acceptable per
  Approach A.
- **Snake needs `output` branch + `permissions: contents: write`:** README image won't
  render until the first successful run. Mitigation: trigger `workflow_dispatch` once after
  merge.
- **Quote commit spam:** prevented by deterministic-by-day selection + commit-only-if-changed.
- **Cascade failure:** all three Actions are independent; one breaking doesn't affect the
  others or the `my-badges` Action.

## Testing approach

- `quote.yaml` logic: run locally against seed `quotes.json` → verify marker block rewrites
  correctly and is idempotent on rerun; validate JSON parses.
- Workflows: `actionlint` / YAML lint before commit; manual `workflow_dispatch` post-merge to
  confirm snake + quote generate.
- `README.md`: local Markdown render-check; verify badge markers are byte-identical to current
  so the `update-my-badges` diff stays clean.
- No unit-test framework (content repo) — verification is lint + manual dispatch + visual render.

## Out of scope (YAGNI)

Trophy case, activity-graph card, dev-joke cards, animated section GIFs, CSS/JS hacks,
self-hosted custom stats SVG.
