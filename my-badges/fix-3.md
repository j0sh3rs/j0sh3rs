<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/af16b3e4c84ace6b3bdc90817ce3d7d021b798ad">af16b3e</a>: fix(ai): goose runner — correct image+provider+flags for headless P1

Working config after iterative probe:
- Image: ghcr.io/block/goose:latest (main branch); v1.9.0 has
  token_counter.rs:93 panic on tools with no properties field; fix
  landed on main, no semver tag available yet
- Provider: GOOSE_PROVIDER=litellm + LITELLM_HOST (native provider);
  GOOSE_PROVIDER=openai + OPENAI_BASE_URL was wrong — openai provider
  defaults to api.openai.com regardless of BASE_URL in v1.9.0
- LITELLM_API_KEY aliased from OPENAI_API_KEY secret key
- Flags: --no-session --with-builtin developer; --no-profile removed
  (flag does not exist in v1.9.0+)
- RUST_BACKTRACE removed (debug only)

P1 verified: PROBE_OK.md written, git diff shows untracked file, rc=0
- <a href="https://github.com/j0sh3rs/home-ops/commit/475014c6d8d30e3c025eddb93f9820ea956c28bb">475014c</a>: fix(traefik): harden edge IP keying, zero-downtime rollout, drop Dolt listener (#434)

- Key rate-limit + CrowdSec on CF-Connecting-IP (XFF unreliable behind CF tunnel)
- Add DaemonSet maxSurge:1/maxUnavailable:0 to both instances (externalTrafficPolicy:Local zero-downtime)
- Open postgres 5432 + syslog 514 in traefik-internal CiliumNetworkPolicy (listeners were being dropped)
- Disable HTTP/3 on traefik-external (CF terminates h3 at edge; was opening UDP/443 on public VIP)
- Remove decommissioned Dolt mysql 3306 listener
- Fix stale rate-limit throughput comment (300 not 180 req/s)
- <a href="https://github.com/j0sh3rs/home-ops/commit/f516c41508148ae8fee24bfcf2ae97476e87a634">f516c41</a>: fix(traefik): Setup for the chart bump


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>