# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

This is the GitHub **profile README** repository (`j0sh3rs/j0sh3rs` — a repo whose name matches the owner renders its `README.md` on the user's GitHub profile page). There is no application code, build system, or test suite. The work here is editing Markdown/HTML content and the single GitHub Action that maintains it.

## Architecture

- **`README.md`** — the rendered profile page. Hand-authored HTML/Markdown (intro, social links, language/tool icons, GitHub stats widgets) plus a **machine-managed badge block** delimited by `<!-- my-badges start -->` and `<!-- my-badges end -->`.
- **`my-badges/`** — output of the [my-badges](https://github.com/my-badges/my-badges) tool. `my-badges.json` is the source of truth (one entry per earned badge: `id`, `tier`, `desc`, `body`, `image`); each `*.md` is the detail page a badge image links to. Badges are computed from the owner's commit/PR history **across all their repos** (e.g. `home-ops`, `k3s-at-home`), not just this one.
- **`.github/workflows/badges.yaml`** — runs `npx update-my-badges <owner>` daily (cron `0 0 * * *`) and on manual `workflow_dispatch`. It regenerates `my-badges/`, rewrites the badge block in `README.md`, and commits the result (`permissions: contents: write`, using `secrets.GITHUB_TOKEN`).
- **`renovate.json`** — Renovate config extending `config:recommended` for dependency update PRs.

## Critical conventions

- **Never hand-edit the badge block** in `README.md` (between the `my-badges` start/end markers) or any file under `my-badges/`. The `update-my-badges` Action overwrites both on every run — manual changes will be lost. To change badge content, change the tool/inputs, not the output.
- **Hand-edit freely** everything in `README.md` *outside* the badge markers (intro text, social links, tools section, stats widgets).
- To preview badge regeneration locally without waiting for cron: `npx update-my-badges j0sh3rs` (requires a `GITHUB_TOKEN` env var with repo read scope).
