<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/fae7eb28af78026f3fcabf98279ba1fa0cd53207">fae7eb2</a>: fix(talos): correct ARC namespace typo in kubernetesTalosAPIAccess

allowedKubernetesNamespaces listed 'action-runner-system' (singular), but the
deployed namespace is 'actions-runner-system' (plural). Talos rejected the
runner's os:admin ServiceAccount with 'Namespace is not allowed'. Applied to
all 3 control-plane nodes (no reboot); recreated the talos.dev SA CR to clear
the cached rejection and the home-ops-runner secret now mints.
- <a href="https://github.com/j0sh3rs/home-ops/commit/c3f6503be6bdbd85bb76cd5f409355b91ded57da">c3f6503</a>: fix(ci): pin ARC charts to 0.14.2, track chart OCI not controller releases (#460)

Renovate bumped both gha-runner-scale-set ocirepos to v0.27.6 (the
actions-runner-controller APP release tag), but the Helm chart is versioned
separately (0.14.x) and v0.27.6 does not exist at the chart OCI path -> 404,
reconcile fails. Switch datasource from github-releases to docker pointing at
the actual chart OCI repos so Renovate tracks chart tags.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>