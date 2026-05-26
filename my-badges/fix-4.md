<img src="https://my-badges.github.io/my-badges/fix-4.png" alt="I did 4 sequential fixes." title="I did 4 sequential fixes." width="128">
<strong>I did 4 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/49b3407a57fe5e980d54e2489274b81b7e4209a0">49b3407</a>: fix(security): update Authentik HelmRelease for chart 2026.5 (global.envFrom, drop redis subchart) (#378)
- <a href="https://github.com/j0sh3rs/home-ops/commit/145ac122eb5e0ff779b1c2a265287dbffbb3f67f">145ac12</a>: fix(security): update Authentik HelmRelease for chart 2026.5 (global.envFrom, drop redis subchart) (#376)
- <a href="https://github.com/j0sh3rs/home-ops/commit/6706e1dcc6a3776a1512f91eb192d07999113990">6706e1d</a>: fix(security): correct Authentik OCI chart URL (helm-charts not helm) (#375)

Co-authored-by: joshAtRula <josh.simmonds@rula.com>
- <a href="https://github.com/j0sh3rs/home-ops/commit/78b68834b255d1d197253f47bf50a4729d36b4ef">78b6883</a>: fix(ai): unauthenticated /metrics on litellm + import upstream grafana dashboard (#374)

LiteLLM v1.85+ defaults require_auth_for_metrics_endpoint=true, which
bounces vmagent's anonymous scrape with 401. Set
litellm_settings.require_auth_for_metrics_endpoint: false in the
proxy_config ConfigMap. /metrics is on a ClusterIP-only Service (no
external exposure) and only carries usage stats. /v1/* endpoints stay
auth-on.

Also import the upstream LiteLLM Prod v2 Grafana dashboard
(BerriAI/litellm@main, 22 KB, 10 panels) as a ConfigMap-generated
GrafanaDashboard CR, matching the tetragon / amd-gpu / dragonflydb
pattern.

Co-authored-by: joshAtRula <josh.simmonds@rula.com>


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>