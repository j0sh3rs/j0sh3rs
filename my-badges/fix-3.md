<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/89d6a99cdc339602e6d7a9529f0fe567fbb5a25c">89d6a99</a>: fix(ai): remove unused Langfuse, ClickHouse, Goose, AnythingLLM, Open WebUI

Langfuse never delivered a trace (S3 upload creds broken; 0 rows in
Postgres); ClickHouse existed solely to back it. Goose's autonomous-loop
experiment (app, indexer, n8n dispatch wiring) is archived for possible
reuse per request. AnythingLLM and Open WebUI removed after confirming
neither has a real consumer beyond a chat UI that isn't used day to day.

Strips dead LiteLLM Langfuse callback config/secrets, n8n's Goose-only
RBAC/SA-token/webhook env vars, and fixes two dangling kustomize
references (databases/clickhouse, flux/meta/repos/langfuse) that would
have broken `kustomize build`. All five removed apps copied to
archive/ before deletion. Adds docs/runbooks/anythingllm-role-and-overlap.md
recording the removal rationale.
- <a href="https://github.com/j0sh3rs/home-ops/commit/f05f938d289f7d1006d683c5a97cceb20bc0f7a5">f05f938</a>: fix(omniroute): pin renovate regex to -web tag family

Plain versioning=semver treated 3.8.42 as outranking 3.8.42-web (semver
reads -web as a pre-release), so renovate silently downgraded to the
non-Playwright image and broke the web-cookie providers. Same fix
pattern as anythingllm's pg-* tag pin.
- <a href="https://github.com/j0sh3rs/home-ops/commit/9353a7323024c423ae405ae004cd4a94a259ca9f">9353a73</a>: fix(omniroute): correct cliproxyapi image and add required config file

ghcr.io/router-for-me/cliproxyapi doesn't exist — OmniRoute's own
docker-compose.yml cites a stale/wrong image. Verified via upstream's own
CI workflow (docker-image.yml): the real publish target is Docker Hub
eceasy/cli-proxy-api, same source, official multi-arch build.

Also: this binary has no PORT/HOST env support at all (verified via
cmd/server/main.go + internal/config/config.go) — config is file-only,
and LoadConfigOptional hard-errors on startup if config.yaml is missing.
Added it as a mounted secret key (host/port/auth-dir/api-keys/management
key), matching upstream's own reference docker-compose.yml volume mount.
Dropped the dead PORT/HOST env vars.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>