<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/835c11054315f0c4151ccb7f5d12db8735905a3b">835c110</a>: fix(mcpjungle): broaden netpol to same-ns + network, unstick bootstrap

The single-source netpol added in 6be4c6f7 (kelos-system only) flipped
mcpjungle ingress to Cilium default-deny for ALL other sources. That
silently broke:
- the same-ns bootstrap Job (hung 4h at the wait-for-mcpjungle init curl)
- LiteLLM's MCP aggregator (http://mcpjungle:8080/mcp)
- Open WebUI / n8n direct MCP connections
- traefik (network ns) serving mcp.68cc.io

App pod stayed healthy because localhost health probes bypass netpol,
masking the breakage.

Enumerate every legitimate ingress source: ai (same-ns clients +
bootstrap), kelos-system (cross-ns, original intent), network (traefik
route). Same class as project_dragonfly_cross_ns_netpol.
- <a href="https://github.com/j0sh3rs/home-ops/commit/0bdda4c282b3b6c7b5b7da98e5614a6fa089af18">0bdda4c</a>: fix(opencode): allowlist ECC skills to stop compaction loop

Real root cause of the constant compaction (not the per-model token
limits): skills-init installed the full ECC bundle (277 skills). OpenCode
injects every installed SKILL.md's name+description into the system prompt
on every request for skill discovery — ~217K of frontmatter, roughly 54k
tokens. That fixed, non-compactable floor exceeds every served context
window (max 32k), so each request overflowed and the client wedged in an
unrecoverable compaction loop on all models (faster on bigger windows
because more history was kept before the inevitable compact).

- skills-init: add optional 5th `allow` field (comma-separated skill-dir
  allowlist) to each bundles.txt line; empty = install all (unchanged
  behavior for caveman).
- skills-install: scope ECC to 16 k8s/GitOps + coding skills.

Floor drops from ~275 skills (~54k tok) to 23 (~5k tok).
- <a href="https://github.com/j0sh3rs/home-ops/commit/ac8010949e0000358faa29aa2a9aaa8e1b852ab3">ac80109</a>: fix(opencode): default to local-balanced, cut local-coder output reserve

local-coder (16k ctx, VRAM-pinned by #465) reserved 8k for output,
leaving only 8k usable input. /init system prompt + MCP tool schemas
exceeded the ~90% compaction trigger before any turn, causing an
infinite compaction loop in the webui.

- model: local-coder -> local-balanced (32k ctx; matches its
  designated default chat/tool-use role, 24k usable input)
- local-coder limit.output 8192 -> 4096 (12k usable when picked)


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>