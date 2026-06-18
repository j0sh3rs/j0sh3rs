<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

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