<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/f758e4cda3ef487438ddd0e9e55f6218f7708586">f758e4c</a>: fix(services): paperless route backendRef service name

app-template names services <app>-<controller>. The controller is
named 'paperless' so the service is 'paperless-app', not 'paperless'.
*app anchor resolved to 'paperless' which doesn't exist, causing
ResolvedRefs: False on the HTTPRoute.
- <a href="https://github.com/j0sh3rs/home-ops/commit/c9178672f6a852c051a0e74c92dabf9758aaa7d6">c917867</a>: fix(services): paperless Redis URL — move to secret, drop broken $(VAR) expansion

Kubernetes only substitutes $(VAR) in env values when the source var
uses plain value:, not valueFrom: secretKeyRef. DRAGONFLYDB_PASSWORD
used valueFrom, so $(DRAGONFLYDB_PASSWORD) was passed verbatim to the
container. Python's URL parser then tried to parse '807jXKr' as a port.

Fix: pre-build the full Redis URL with URL-encoded password in
paperless-secrets and let envFrom inject PAPERLESS_REDIS directly.
Remove PAPERLESS_REDIS and DRAGONFLYDB_PASSWORD from the helmrelease
env block entirely. DB /2 selector preserved in the URL.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>