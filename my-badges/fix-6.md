<img src="https://my-badges.github.io/my-badges/fix-6.png" alt="I did 6 sequential fixes." title="I did 6 sequential fixes." width="128">
<strong>I did 6 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/6be4c6f7151ecbfbc08cf2882e263a5b32e10adf">6be4c6f</a>: fix(kelos): correct mcpjungle port, add cross-ns netpol, fix renovate annotation (#484)

- AgentConfig mcpjungle URLs: port 3000 → 8080 (confirmed via kubectl get svc)
- NetworkPolicy allow-kelos-to-mcpjungle in ai ns: permits kelos-system
  Task pods to reach mcpjungle:8080 (Cilium blocks cross-ns by default)
- helmrelease.yaml opencodeImage renovate annotation: datasource=docker
  depName=ghcr.io/kelos-dev/opencode (was tracking wrong chart releases)

Closes #468
- <a href="https://github.com/j0sh3rs/home-ops/commit/9f4c41fbeed7800361f7f75b112a6888ee4c28e8">9f4c41f</a>: fix(litellm): scope cache to embeddings, add github-fallback/retries/concurrency cap (#483)

Implements #466 — LiteLLM proxy_config hardening from the 2026-06-29
AI-stack config review.

Caching:
- Restrict cache_params.supported_call_types to embedding/rerank only.
  Chat completions were cached at 600s TTL, serving stale answers to
  coding agents (a 0.9-similar prompt with a 1-line diff returned the
  wrong cached output).
- Documented that REDIS_URL already targets DB 4 (cache isolation
  VERIFY item from the issue — confirmed via keyspace, no fix needed).

Routing / resilience:
- num_retries: 1 — absorb transient llama-swap cold-swap 5xx.
- timeout: 300 (router) + request_timeout: 300 (client-facing) — wedged
  swaps become clean timeouts instead of indefinite hangs.
- fallbacks: local-coder/-heavy/-balanced/-reason/-large -> github-fallback
  (free GitHub Models tier) for Vulkan-segfault / OOM hard-failure
  degradation. Keeps coding agents alive WITHOUT spending Anthropic credit;
  free-tier 150 req/day cap makes this a crash cushion, not a routine route.
- context_window_fallbacks: local-coder/local-reason -> local-large (24k).
  github-fallback is NOT eligible (8k input cap < the 16k ceiling we are
  escaping). Prompts beyond 24k hard-fail 400 by design — no cloud spend
  on oversized repo dumps.

New model:
- github-fallback -> github/gpt-4o-mini, api_key os.environ/GITHUB_TOKEN
  (injected via environmentSecrets). max_input_tokens 8000, 5 concurrent
  to match free-tier limits.
  VERIFY: GITHUB_TOKEN needs `models:read` scope or these 403.

Concurrency:
- max_parallel_requests: 2 on each local-* deployment — guards the single
  16 GiB GPU. Resident embed/rerank left uncapped (batch RAG, no swap).

Verified: kustomize build, yamllint, embedded config.yaml parse.
- <a href="https://github.com/j0sh3rs/home-ops/commit/09fad4a215c93e8151c1ac8309bad4981ab76de3">09fad4a</a>: fix(ai): Add Perplexity and GH to litellm
- <a href="https://github.com/j0sh3rs/home-ops/commit/a3a12b0ba8790cbe766b630df7d823f1fdb6ced5">a3a12b0</a>: fix(llama-swap): raise HelmRelease timeout to 30m for cold model fetch (#482)

The #474 upgrade failed and rolled back: the model-fetch init container
needs to download the new Q3_K_S coder GGUF (~13.7G) off HuggingFace, but
the Helm default 5m timeout tripped first ('timeout waiting for:
Deployment status InProgress', 4 attempts -> Stalled -> rollback to v61).
The reloader-managed ConfigMap still updated to reference Q3_K_S, leaving
a split brain: running pod served a config pointing at a file the rolled-
back deployment never finished downloading -> agentic-coder load 500s ->
Kelos/OpenCode agents hang on local-coder.

Set spec.timeout: 30m so a cold multi-model fetch (up to ~60 GiB) can
complete within the Helm window instead of failing the release.

Refs #465, #470
- <a href="https://github.com/j0sh3rs/home-ops/commit/47b4857181ae2934699a40ff1edb083d092a905e">47b4857</a>: fix(llama-swap): de-thrash chat group — coder Q3_K_S + router always-on (#474)

Actually implements the #465 de-thrash that was closed without landing
(the prior change moved qwen3-1.7b the WRONG way — into swap — to fit
Qwen3.6-27B). On-node bench (bigboi, image b9803, 16k ctx, q8_0 KV,
FA on) settled the tradeoff:

  agentic-coder Q3_K_M: 15.6 GB VRAM, 148 tok/s gen, 253 prefill
  agentic-coder Q3_K_S: 14.19 GB VRAM, 152 tok/s gen, 233 prefill

Gen speed is a wash; Q3_K_S frees ~1.4 GB. Total GPU is 17.1 GB, and the
always-on group needs ~2.6 GB (embed+rerank+router/voice). Only Q3_K_S
fits the coder resident alongside it (14.19+2.6=16.8 < 17.1); Q3_K_M did
not (15.6+2.6=18.2), which is why router/voice calls evicted the coder.

Changes:
- agentic-coder: Q3_K_M -> Q3_K_S (configmap cmd + init-container fetch
  URL/filename + min-bytes guard 14.5G->13.3G).
- qwen3-1.7b: moved OUT of exclusive 'chat' group, INTO persistent
  'always-on' (now embed+rerank+qwen3-1.7b). Routing, opencode
  small_model title-gen, and Home Assistant voice no longer evict the
  resident coder.
- litellm: add local-coder-heavy -> qwen3.6-27b. Higher coding quality
  (SWE-bench Verified 77.2) but dense 27B = slow decode (~20-30 vs MoE
  ~150 tok/s); for hard one-shot/visual escalation, not the default loop.
  llama.cpp #22384 hybrid checkpoint fix confirmed present in b9803.
- fix stale comments (always-on ~3->2.6 GiB; local-coder Q3_K_M->Q3_K_S).

Verified: kustomize build (both apps) OK; flux-manifest-reviewer pass
(filename consistency, group integrity, fetch guard, alias targets).

Closes #465
- <a href="https://github.com/j0sh3rs/home-ops/commit/3608ea0a4d108e201114143db6b1894f411688fa">3608ea0</a>: fix(litellm): add max_input_tokens + context_window_fallbacks for all tight-ctx models


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>