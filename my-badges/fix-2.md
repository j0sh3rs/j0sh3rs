<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/275e92537cf494f68ad032e7767a08872850ad95">275e925</a>: fix(drm-exporter): run privileged, EPERM persists with caps + root

Reverting to chart defaults (root + PERFMON/SYS_RAWIO) fixed nothing —
still "discovering DRM devices: Operation not permitted" on every node.
Root cause: a hostPath bind mount of /dev/dri does not grant a cgroup
device-access rule by itself; that only happens via `privileged: true`
or a device plugin/DRA claim that injects the device node. This
cluster's amd-gpu device-plugin is legacy-style (not DRA), so it can't
back the chart's `dra.enabled` option for a non-privileged path.

Verified live: patched the DaemonSet directly before writing this
commit — all 4 pods went Running and /metrics serves real drm_* series
(engine utilization, frequency, memory, info) on both an APU node and
the dGPU node.
- <a href="https://github.com/j0sh3rs/home-ops/commit/4f0b6b634bc211c654c645c61ec6abbaa8b6e6e2">4f0b6b6</a>: fix(drm-exporter): revert securityContext override causing EPERM crashloop

The chart README claims AMD GPUs need neither PERFMON nor SYS_RAWIO and
can run unprivileged, but that only holds for reading hwmon/sysfs stats
after devices are discovered. DRM device discovery itself failed with
EPERM on every node (including the dGPU node) once capabilities were
dropped and the pod ran as a non-root user. Revert to the chart's
default securityContext/podSecurityContext (root + PERFMON/SYS_RAWIO).


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>