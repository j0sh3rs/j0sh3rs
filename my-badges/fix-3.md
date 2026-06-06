<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/d051bcbefb1330c076bd91548ff494c636407106">d051bcb</a>: fix(monitoring): tune GPU thermal thresholds from load-verified data

Idle: 27-29C. Sustained inference (1.5B Q4_K_M, 20-parallel, Vulkan): 53C
peak, 161W. Navi 21 throttle at ~100C edge.

Warn: 90C -> 75C (22C above load peak)
Crit: 100C -> 90C (pre-throttle, 37C headroom above load peak)
- <a href="https://github.com/j0sh3rs/home-ops/commit/b76b26f176aa6115e89a74f6f5ab891aa8e5e7de">b76b26f</a>: fix(monitoring): use real gpu power metric, drop dead junction alert

Live exporter on bigboi (Navi 21 / RX 6900 XT) confirmed amd_gpu_package_power
is empty on this consumer card; it reports amd_gpu_average_package_power instead
(idle ~60W). Point GPUPackagePowerHigh at the metric that actually exists.

Drop GPUJunctionTemperatureCritical: amd_gpu_junction_temperature is gated to
Instinct card_models in the exporter and the 6900 XT reports card_model="", so
the metric never populates and the alert was permanently dead. Edge temperature
is the authoritative thermal signal for this card (verified idle 27C).
- <a href="https://github.com/j0sh3rs/home-ops/commit/3a8f9e8abb9bf206f50c220171ef80c833bf2b4b">3a8f9e8</a>: fix(monitoring): target amd gpu exporter at dgpu node + add gpu alerts

amd-device-metrics-exporter was scheduled via nodeSelector amd.com/gpu.family=RV,
landing on the three bee APU nodes where the bundled gpuagent cannot reach the
integrated GPU (gpuagent.sock connection refused, ~11400 consecutive failures;
/metrics served only promhttp internals). amd-smi does not enumerate the
Raven/Cezanne iGPUs. Retarget to node.kubernetes.io/gpu-tier=dgpu so the
DaemonSet runs only on bigboi-jms-01 (Navi 21 / RX 6900 XT), the one node amd-smi
supports, and the three dead bee pods are removed.

Add a gpu PrometheusRule group (edge temp high/critical, junction temp critical,
package power high, exporter-down). Metric names and label set (hostname, not the
kube node label) verified against the bundled AMD dashboards. Edge temperature is
the critical path because junction temp is gated to Instinct card models in the
exporter and the 6900 XT is a consumer card.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>