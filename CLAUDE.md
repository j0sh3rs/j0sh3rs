# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the GitHub **profile README** repository (`j0sh3rs/j0sh3rs` — a repo whose name matches the owner renders its `README.md` on the user's GitHub profile page). There is no application code, build system, or test suite. The work here is editing Markdown/HTML content and the single GitHub Action that maintains it.

## Architecture

- **`README.md`** — the rendered profile page. Hand-authored HTML/Markdown (hero typing-SVG, personality sections, themed strengths, social links, language/tool icons, GitHub stats widgets) plus **two machine-managed marker blocks**: the badge block (`<!-- my-badges start/end -->`) and the daily quote block (`<!-- quote start/end -->`).
- **`my-badges/`** — output of the [my-badges](https://github.com/my-badges/my-badges) tool. `my-badges.json` is the source of truth (one entry per earned badge: `id`, `tier`, `desc`, `body`, `image`); each `*.md` is the detail page a badge image links to. Badges are computed from the owner's commit/PR history **across all their repos** (e.g. `home-ops`, `k3s-at-home`), not just this one.
- **`quotes.json`** — source of truth for the rotating philosophy quote. Array of `{ "quote", "author" }`. Add/remove entries freely.
- **`.github/scripts/rotate-quote.mjs`** — picks a quote **deterministically by UTC day-of-year** (`dayOfYear % quotes.length`) and rewrites the `<!-- quote start/end -->` block in `README.md`. Idempotent: same day → identical output → no commit. Run locally with `node .github/scripts/rotate-quote.mjs`.
- **`.github/workflows/badges.yaml`** — runs `npx update-my-badges <owner>` daily (cron `0 0 * * *`) and on `workflow_dispatch`. Regenerates `my-badges/`, rewrites the badge block, commits (`permissions: contents: write`, `secrets.GITHUB_TOKEN`).
- **`.github/workflows/quote.yaml`** — runs `rotate-quote.mjs` daily (cron `5 0 * * *`) and on `workflow_dispatch`; commits `README.md` only if the quote block changed.
- **`.github/workflows/snake.yaml`** — `Platane/snk` generates a contribution-graph snake SVG (`snake.svg` + `snake-dark.svg`) and pushes it to the **`output` branch**. README references the raw SVG from that branch via a `<picture>` element. The image only renders after the first successful run — trigger `workflow_dispatch` once after merge.
- **`renovate.json`** — Renovate config extending `config:recommended` for dependency update PRs.

## Critical conventions

- **Never hand-edit either marker block** in `README.md`. The badge block (`<!-- my-badges start/end -->`) is owned by `update-my-badges`; the quote block (`<!-- quote start/end -->`) is owned by `rotate-quote.mjs`. Both Actions overwrite on every run — manual changes are lost. To change content, change the tool/inputs (`my-badges.json` is auto-generated; edit `quotes.json` for quotes).
- **Hand-edit freely** everything in `README.md` *outside* the two marker blocks.
- The three content Actions (`badges`, `quote`, `snake`) are independent — one failing doesn't affect the others.
- Preview badge regeneration locally: `npx update-my-badges j0sh3rs` (needs `GITHUB_TOKEN` env var with repo read scope).
