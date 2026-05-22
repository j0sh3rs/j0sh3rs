<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/62e760b7f1ec0590acf06cafda0ea230baff8b96">62e760b</a>: fix(databases): use home-ops/role label for dragonfly metrics svc/SM selector (#369)

Flux's parent Kustomization at kubernetes/apps/databases/dragonflydb/ks.yaml
injects `commonMetadata.labels` cluster-wide, including
`app.kubernetes.io/name: dragonflydb-instance`. That OVERWRITES the
`app.kubernetes.io/name: dragonfly-metrics` we set on the metrics Service,
so the ServiceMonitor's `selector.matchLabels` finds zero Services.
Symptom: vmagent target reports `(0/0 up)` despite Service + EndpointSlice
being healthy.

Switch to a distinct `home-ops/role: dragonfly-metrics` label that Flux
won't clobber. Both the Service and ServiceMonitor use it.

Verified live: pre-fix `kubectl get svc -l app.kubernetes.io/name=dragonfly-metrics`
returned 0 Services. Post-fix the SM selector matches via the unique label.

Co-authored-by: joshAtRula <josh.simmonds@rula.com>
- <a href="https://github.com/j0sh3rs/home-ops/commit/51a20e7d67b42376ed2602dca9577910546a8c72">51a20e7</a>: fix(databases): allow vmagent to scrape dragonfly admin port (9999) (#368)

The dragonfly operator auto-creates a NetworkPolicy that locks port
9999 to operator + peer pods only. After the StatefulSet recreate
(needed for the snapshot PVC to land), vmagent silently lost its
scrape — same restriction was always there but the original audit
missed it because metrics had been flowing pre-restart for an
unrelated reason (operator CR's serviceMonitor: enabled was scraping
the OPERATOR's metrics, not dragonfly itself).

Add a sibling NetworkPolicy in `databases` that allows
`monitoring/vmagent` → `:9999`. NetworkPolicy ingress rules are
additive, so the operator's lockdown remains for everything else.

Verified vmagent reaches the pod IP after this lands; before the
fix `wget --timeout=5 http://<pod-ip>:9999/metrics` from inside the
vmagent container hangs. After the fix metrics flow within ~30s
via vmagent's normal scrape interval.

Co-authored-by: joshAtRula <josh.simmonds@rula.com>


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>