<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

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