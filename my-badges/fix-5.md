<img src="https://my-badges.github.io/my-badges/fix-5.png" alt="I did 5 sequential fixes." title="I did 5 sequential fixes." width="128">
<strong>I did 5 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/b9904fc341bc1a211dfeb9e9300f4bd439710b51">b9904fc</a>: fix(ai): fixup the mcpjungle to non-enterprise mode
- <a href="https://github.com/j0sh3rs/home-ops/commit/bae17884204c671c610ccefd4527923b4768335d">bae1788</a>: fix(ai): mcpjungle bump for n8n secrets
- <a href="https://github.com/j0sh3rs/home-ops/commit/60602269a525417cdaa753773ed76891473cc287">6060226</a>: fix(ai): GitHub webhook HMAC-SHA256 verification + n8n SA token mount (#436)

* fix(ai): GitHub webhook HMAC-SHA256 signature verification

helmrelease.yaml: env N8N_GITHUB_WEBHOOK_SECRET from n8n-secrets key
loop-orchestrator.json:
  - webhook node: rawBody: true (required for HMAC over exact payload)
  - new node "Verify GitHub Signature": computes HMAC-SHA256 with
    timingSafeEqual, throws on mismatch → n8n returns 500, drops request
  - connections: webhook → verify → normalize (was webhook → normalize)

Manual step: add GITHUB_WEBHOOK_SECRET to n8n-secrets via sops:edit,
then set the same value in GitHub Settings → Webhooks for the hook.

* Add github webhook secret for verification
- <a href="https://github.com/j0sh3rs/home-ops/commit/6b3528aa89b91ce5fd8a252a37137491423933d9">6b3528a</a>: fix(ai): mount n8n SA token in-pod instead of static K8S_SA_TOKEN var

K8s auto-populates the service-account-token Secret; n8n reads it as
$env.N8N_K8S_TOKEN in Code nodes.

- n8n/app/sa-token.sops.yaml: SOPS-encrypted k8s SA token Secret
- n8n/app/kustomization.yaml: adds sa-token.sops.yaml
- n8n/app/helmrelease.yaml: env N8N_K8S_TOKEN from secretKeyRef
- loop-orchestrator.json: $vars.K8S_SA_TOKEN → $env.N8N_K8S_TOKEN
- <a href="https://github.com/j0sh3rs/home-ops/commit/66d216bfca9d3e6349647546ddcd7dd30793cb9a">66d216b</a>: fix(traefik): revert CF-Connecting-IP keying — 403s LAN-direct traffic

PR #434 keyed rate-limit + CrowdSec on CF-Connecting-IP. That header only
exists on Cloudflare-tunneled requests. LAN clients resolve external-gateway
hosts (e.g. n8n.68cc.io) to VIP 192.168.35.15 via unifi-dns split-horizon and
hit Traefik directly, bypassing Cloudflare — so no CF-Connecting-IP header.
The crowdsec-bouncer then 403'd every LAN-direct request (remediationStatusCode
403). Revert both middlewares to ipStrategy.depth:1 (XFF) to restore service.

Proper fix (per-path IP strategy for tunnel vs LAN) deferred — needs testing.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>