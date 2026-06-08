<img src="https://my-badges.github.io/my-badges/fix-4.png" alt="I did 4 sequential fixes." title="I did 4 sequential fixes." width="128">
<strong>I did 4 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/ecc048b7dc734ee9a6fe22c19a270b17e255d49b">ecc048b</a>: fix(renovate): group traefik chart + image, disable automerge

Chart 40.x gates the proxy image version via requirements.yaml; independent
auto-merge of the image bump breaks HelmRelease reconciliation. Grouping
both under matchPackageNames ["/traefik/"] ensures chart + image land in the
same PR, reviewed manually before merge.
- <a href="https://github.com/j0sh3rs/home-ops/commit/be18cedbcd33c21b418f5961cbbaccc4fd6fadaf">be18ced</a>: fix(network): downgrade traefik image to v3.7.1, fix victoria-logs syslog port conflict

Chart traefik@40.2.0 caps Traefik Proxy at v3.7.1 via requirements.yaml gate;
both traefik-external and traefik-internal were pinned to v3.7.4 causing
HelmRelease upgrade failures.

victoria-logs-single@0.13.x auto-adds syslog service ports when
syslog.listenAddr.tcp/udp args are set; manual extraPorts for port 514
(TCP+UDP) produced duplicate key errors in server-side apply.

Also deleted orphaned kube-system/vector Kustomization (no repo path,
depends on non-existent flux-system/helm-repos; vector runs as
victoria-logs-vector under victoria-logs chart).
- <a href="https://github.com/j0sh3rs/home-ops/commit/c3137598bc76c107a5cfea30c3a0a93fe33595be">c313759</a>: fix(renovate): Add renovate tags to proper k8tz upstream, add gh override for token usage
- <a href="https://github.com/j0sh3rs/home-ops/commit/adeacca75619e25324adaefdc92a48567c66fad6">adeacca</a>: fix(mirrors): Update removed mirrors to native oci, or direct upstream for better uptaking


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>