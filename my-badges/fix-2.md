<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/76f7999502b7c4e8dbdf7d09183d2192519b84d5">76f7999</a>: fix(tetragon): drop noisy security_kernel_module_request hook (#344)

TetragonKernelModuleLoadAttempt alert has been firing constantly (1192
events in 24h cluster-wide, ~62/hour sustained). Investigation:

- Counter `tetragon_policy_events_total{policy="monitor-kernel-integrity"}`
  attributable to hook `kprobe:security_kernel_module_request` only;
  sibling `__x64_sys_bpf` hook is silent (0 events), so the bpf()
  allowlist is working perfectly.
- security_kernel_module_request fires on legit kernel-driven auto-loads
  (netfilter/iptables modules, filesystem drivers, protocol handlers)
  initiated by Talos userspace during normal operation. The kernel BLOCKS
  the actual load (Talos ships with a locked, signed kernel), but the
  REQUEST callback still executes.
- Alert label grouping (namespace, pod, workload) ends up empty because
  the caller is a host-level binary; AM deduplication fails.
- Zero actionable signal: every event is noise, not a compromise indicator.

Drop the security_kernel_module_request kprobe block from the policy.
Keep __x64_sys_bpf — real supply-chain / rootkit signal with near-zero
false-positive rate.

The TetragonKernelModuleLoadAttempt alert rule in prometheusrule.yaml
keeps the same expression; counter rate will drop to zero once the
policy reload takes effect, alert goes inactive.

Refs: home-ops-jsl, home-ops-y5m

Co-authored-by: joshAtRula <josh.simmonds@rula.com>
- <a href="https://github.com/j0sh3rs/home-ops/commit/5a77dc90f14372e44be04ba0d4e3a83d13bfecb4">5a77dc9</a>: fix(tetragon): drop exportFilename override so sidecar re-emits to VL (#343)

Current config set `exportFilename: /dev/stdout` on the agent, which
bypasses the chart's export-stdout sidecar. That sidecar is deployed
to tail the file `/var/run/cilium/tetragon/tetragon.log` and re-emit
it to pod stdout for log-shipper capture. Our override made the agent
skip the file entirely, so the sidecar ran forever with nothing to
tail. Result: agent operational warnings reached VictoriaLogs via
Vector (captured from the tetragon container's own stdout), but
PROCESS_EXEC / PROCESS_KPROBE / PROCESS_LSM structured events never
reached VL — defeating the purpose of every monitor-only Post policy
for forensics.

Drop `exportFilename` + `exportRateLimit` overrides. Chart defaults
are `exportFilename: tetragon.log` in `exportDirectory:
/var/run/cilium/tetragon` with unlimited rate. With defaults:
  agent → /var/run/cilium/tetragon/tetragon.log (rotating, 10MB x 5)
  export-stdout sidecar tails file → pod stdout
  Vector captures /var/log/containers/*.log → VictoriaLogs
  LogsQL query: kubernetes.container_name:=export-stdout "process_kprobe"

Refs: home-ops-clc, home-ops-y5m

Co-authored-by: joshAtRula <josh.simmonds@rula.com>


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>