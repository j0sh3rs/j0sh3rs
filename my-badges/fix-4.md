<img src="https://my-badges.github.io/my-badges/fix-4.png" alt="I did 4 sequential fixes." title="I did 4 sequential fixes." width="128">
<strong>I did 4 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/01fd483a56deefb57c03e334943de829d7a9a340">01fd483</a>: fix(security): set AUTHENTIK_COOKIE_DOMAIN, add X-authentik-entitlements header (#385)
- <a href="https://github.com/j0sh3rs/home-ops/commit/cbb6f18a4ca6d95f6c9c36837a9ba720999fdb38">cbb6f18</a>: fix(security): add AUTHENTIK_AUTHENTIK__DOMAIN env var to fix outpost redirect URL (#384)
- <a href="https://github.com/j0sh3rs/home-ops/commit/81ed60aaad0dd61a1d80f28f4911048f73c30bd5">81ed60a</a>: fix(network): raise rate limit burst for Authentik SPA + WebSocket (200 burst, depth 1) (#383)
- <a href="https://github.com/j0sh3rs/home-ops/commit/a41ed0144dffb7146a84bbe3ef3f671bb98d1cf6">a41ed01</a>: fix(databases): move serverName off ObjectStore + add kubectl-cnpg (#382)

Two issues post-merge of barman plugin migration (#381):

1. Flux ks 'cloudnative-pg-cluster' stuck in dry-run-failed loop:
   ObjectStore.spec.configuration.serverName: Forbidden: use the
   'serverName' plugin parameter in the Cluster resource

   The plugin's webhook rejects serverName at the ObjectStore level —
   it lives on Cluster.spec.plugins[].parameters.serverName instead.
   Fix: drop serverName from both ObjectStore CRs (postgres17-v3 and
   postgres17-v4); add serverName to the Cluster's plugin parameters
   for both the live cluster (postgres17-v4) and the recovery source
   (postgres17-v3 in externalClusters).

   Same S3 path semantics: plugin reads/writes
   s3://cloudnative-pg/postgres17-v4/ as before. The ObjectStore now
   carries only the S3 location + creds + retention; per-cluster
   path differentiation is the cluster's job. This shape is what the
   official cluster-example.yaml in cnpg/plugin-barman-cloud demos.

   Live cluster's in-tree spec.backup.barmanObjectStore is still
   active because Flux never applied the new cluster17.yaml — backups
   continued working throughout the partial-merge state.

2. 'kubectl cnpg' command not found locally.

   Add kubectl-cnpg CLI plugin via mise/aqua:
     aqua:cloudnative-pg/cloudnative-pg/kubectl-cnpg = 1.29.1

   Tracks cnpg operator chart version (currently 1.29.1). Renovate
   auto-bump silently no-ops on this entry due to a 3-segment vs
   2-segment depName mismatch (aqua identifier has the binary name as
   third segment; GitHub repo is 2 segments). Documented inline.
   Bump manually alongside the cnpg operator HelmRelease.

Server-side dry-run with --field-manager=kustomize-controller now
clean for the cluster CR + both ObjectStore CRs.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>