<img src="https://my-badges.github.io/my-badges/fix-5.png" alt="I did 5 sequential fixes." title="I did 5 sequential fixes." width="128">
<strong>I did 5 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/539fd6eafddd7b390f8d59dbac9ed195c320f10d">539fd6e</a>: fix(databases): allow cross-namespace clients to dragonfly 6379

The dragonfly operator's auto-created NetworkPolicy only permits port
6379 ingress from pods inside the databases namespace (podSelector: {}
with no namespaceSelector). Our Redis clients live in other namespaces:
ai (litellm db4, langfuse db6, open-webui) and services (paperless db2).

When the operator deletes+recreates the Dragonfly instance (e.g. on a
VolumeClaimTemplates change, which happened 2026-06-22) it re-applies
that lockdown, severing every cross-namespace client. litellm then
blocked ~270s on Redis connect during FastAPI startup and crashlooped
past its 300s startup-probe budget — full ai-namespace LLM outage.

NetworkPolicies are additive, so this sibling policy (mirroring the
existing dragonflydb-allow-monitoring-scrape pattern for 9999) unions
with the operator-managed one to allow ai + services clients on 6379.
- <a href="https://github.com/j0sh3rs/home-ops/commit/8a03f88dca6ca3a2a1d0e8de19f9d98aec97ee8c">8a03f88</a>: fix(ai): add 15m HelmRelease timeout to litellm

The v1.89.3 upgrade ran the Prisma migrationJob (helm pre-upgrade hook)
then the Deployment rollout exceeded Helm's default 5m wait window. Helm
auto-rolled-back the Deployment to v1.88.1 but NOT the applied migration,
leaving v1.88.1 booting against a 1.89.3 DB schema — it hangs at 'Waiting
for application startup' and the startup probe crashloops it (no Ready
endpoints, every consumer gets EHOSTUNREACH).

A generous spec.timeout lets the rollout finish inside the wait window so
the rollback never fires. DB is already at 1.89.3, so rolling forward is
the correct, lower-risk resolution.
- <a href="https://github.com/j0sh3rs/home-ops/commit/9d95a8590322e993b4db155da8d253dba1075e61">9d95a85</a>: fix(monitoring): bump netdata parent+k8s-state mem limits

k8s-state at 96% of 256Mi limit (246Mi used) — imminent OOM.
parent at 90% of 1Gi (920Mi used). Raise headroom:
- k8sState: req 64->192Mi, limit 256->512Mi
- parent: req 512->768Mi, limit 1Gi->1536Mi
- <a href="https://github.com/j0sh3rs/home-ops/commit/2764c8925ddcd145d73a27f1b8e4626a3b231068">2764c89</a>: fix(monitoring): retune noisy alerts to kill false positives

DragonflyDB (instance/prometheusrule.yaml) — instance is healthy/idle:
- AvgCommandLatencyHigh: exclude bzpopmin/bzpopmax/blmpop/bzmpop (Celery/Kombu
  blocking pops). Was firing at 114ms; real cmds sub-ms, expr now ~24us.
- BlockedClients: threshold 5->50, for 10m->15m. Baseline is a flat 30 idle
  broker consumers (Paperless+Authentik+Kombu), not a leak.
- HitRatioLow: add >1 op/s volume gate. db4 LiteLLM cache runs ~0.01 op/s idle,
  so a single miss swung the ratio across 70% — pure sampling noise.

Tetragon — both firings confirmed benign:
- ContainerEscape: exclude netdata-child binaries (privileged host /proc,/sys
  mounts + cgroup-network netns entry).
- ShellSpawn: exclude linkwarden (yarn/concurrently sh entrypoint).

Dockerhub (kube-prometheus-stack): DockerhubRateLimitRisk critical->warning;
soft capacity signal, Spegel caching blunts the real risk.
- <a href="https://github.com/j0sh3rs/home-ops/commit/7574fdaa3956adb9238ee24c04243d075d3b2ffa">7574fda</a>: fix(monitoring): stop netdata crashloop (parent opt-out write, child OOM)

- Remove DO_NOT_TRACK from parent: entrypoint touches
  /etc/netdata/.opt-out-from-anonymous-statistics, but parent runs as uid 201
  against root-owned /etc/netdata -> write fails, container exits 1. Opt-out is
  moot with Netdata Cloud claiming already enabled.
- Remove DO_NOT_TRACK from child for consistency.
- Bump child memory 256Mi->512Mi limit, 64Mi->256Mi request (was OOMKilled
  137; running children measured at 207-242Mi, over the old limit).


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>