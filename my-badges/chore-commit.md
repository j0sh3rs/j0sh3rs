<img src="https://my-badges.github.io/my-badges/chore-commit.png" alt="I did a little housekeeping! 🧹" title="I did a little housekeeping! 🧹" width="128">
<strong>I did a little housekeeping! 🧹</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/781e4e26369a1ae60fa0714957381c4826a851f8">781e4e2</a>: chore: replace google-oidc-secure with authentik-forwardauth in stale comments (#394)

Three files had leftover references to the old traefikoidc plugin name
(google-oidc-secure) in comments. No live route filters were affected —
all routes already used authentik-forwardauth. Pure comment hygiene to
avoid copy-paste confusion when adding future routes.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>