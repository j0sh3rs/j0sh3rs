<img src="https://my-badges.github.io/my-badges/fix-5.png" alt="I did 5 sequential fixes." title="I did 5 sequential fixes." width="128">
<strong>I did 5 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/9bebca4fb4dc5d20712a3167024956984b01c528">9bebca4</a>: fix(ai): restore langfuse init-db to helm extraManifests for correct hook ordering
- <a href="https://github.com/j0sh3rs/home-ops/commit/f694c21ea8dedbf2eec4508db8203ad223b3f059">f694c21</a>: fix(ai): pin voice stack image tags to versioned releases
- <a href="https://github.com/j0sh3rs/home-ops/commit/4a49a051cc1bb8f23dbb5d2c791ccdbb96052a6a">4a49a05</a>: fix(ai): wire LangFuse Redis auth via REDIS_CONNECTION_STRING

The previous config set redis.auth.existingSecret without a matching
existingSecretPasswordKey, which trips the chart's required guard in
_helpers.tpl:311 and causes reconcile failure.

The chart's getEnvVar helper only inspects additionalEnv (not
additionalEnvFrom) at render time. Injecting REDIS_CONNECTION_STRING via
additionalEnv.valueFrom.secretKeyRef satisfies the guard at line 388 so
the chart skips building its own connection string. The full DSN
(redis://:password@dragonflydb...:6379/6) comes from
langfuse-secrets.REDIS_URL, which is the existing secret already mounted
via additionalEnvFrom.
- <a href="https://github.com/j0sh3rs/home-ops/commit/b2ea94706a817231b3a38a11a0e760cb2ce632f3">b2ea947</a>: fix(ai): mem0 — suspend HR (no public image), fix API key name, remove redundant env

- Add suspend: true to HelmRelease; ghcr.io/mem0ai/mem0-server has no
  public CI publish workflow (Dockerfile exists in repo but is not pushed)
- Rename ADMIN_API_KEY -> MEM0_API_KEY in secret (re-encrypted)
- Remove APP_DB_NAME plain env var; POSTGRES_DB in secret already carries
  the database name
- <a href="https://github.com/j0sh3rs/home-ops/commit/b014e3dffc4c3dbe9f76113230d76dee8e7559b5">b014e3d</a>: fix(ai): move langfuse init-db + httproute to standalone manifests, document OCI exception

- Add OCI exception comment to helmrelease.yaml explaining why HelmRepository
  sourceRef is used (ghcr.io/langfuse/helm-charts/langfuse returns 403)
- Extract init-db Job to init-db-job.yaml so helm.sh/hook annotations are
  applied by Flux/kustomize directly rather than via extraResources values key
- Extract HTTPRoute to httproute.yaml for the same reason
- Remove extraResources block from helmrelease.yaml
- Add new files to kustomization.yaml resources list


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>