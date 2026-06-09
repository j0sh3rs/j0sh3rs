<img src="https://my-badges.github.io/my-badges/chore-commit.png" alt="I did a little housekeeping! 🧹" title="I did a little housekeeping! 🧹" width="128">
<strong>I did a little housekeeping! 🧹</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/d087373ef6b51374578d60f2a56e798d0c82d645">d087373</a>: chore(ai): Phase 0 cleanup — renovate pins, mem0 removal, dead env strip

- Add Renovate packageRule pinning llama-swap to -vulkan-b suffix only,
  automerge:false, removed from AI Stack group (prevents silent auto-merge
  of -rocm/-cuda tags that are non-functional on Talos Vulkan-only cluster)
- Add Renovate packageRule pinning n8n to 2.23.x (blocks 2.24+ beta)
- Delete kubernetes/apps/ai/mem0/ (image permanently 404, no viable
  self-host path; cross-app shared memory layer dropped by design decision)
- Remove mem0 kustomization entry from ai/kustomization.yaml
- Strip dead MEMORY_PROVIDER/MEM0_API_BASE_URL/MEM0_API_KEY env vars from
  open-webui HelmRelease (OWUI upstream has no external memory provider)
- Fix stale llama-swap configmap comment: Cezanne APU → Navi 21 dGPU on
  bigboi-jms-01
- Fix CLAUDE.md: MetaMCP moved from disabled → active services; llama-swap
  node ref updated bee-jms-03 → bigboi-jms-01


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>