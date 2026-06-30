<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

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