<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/81cd538356cbfe4f771f6c3d47726fbc38e7cc42">81cd538</a>: fix(security): migrate crowdsec-db-pvc to openebs-hostpath

SQLite on NFS (nfs-client) causes WAL lock contention when agents and
LAPI read/write concurrently, resulting in "database is locked" errors
and 403s to bouncers (CrowdSecBouncerNotConnected alert).

openebs-hostpath provides local NVMe I/O; LAPI is single-replica with
Recreate strategy, so node-pinning is acceptable. Config PVC stays on
nfs-client (read-mostly, survives reschedule).
- <a href="https://github.com/j0sh3rs/home-ops/commit/7986dde84d978b5bb529039d38f8905b7a8c6439">7986dde</a>: fix(n8n): Disable user management since gated by SSO
- <a href="https://github.com/j0sh3rs/home-ops/commit/60bee1e62900dd05daf441bf5ee257daf7ea0d0f">60bee1e</a>: fix(ai): correct LiteLLM OIDC endpoints — remove app-slug from path


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>