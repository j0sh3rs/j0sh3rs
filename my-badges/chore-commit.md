<img src="https://my-badges.github.io/my-badges/chore-commit.png" alt="I did a little housekeeping! 🧹" title="I did a little housekeeping! 🧹" width="128">
<strong>I did a little housekeeping! 🧹</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/2e03c71ebe6f04cc4107bb2b0a2dd88bdf418274">2e03c71</a>: chore(ai): disable claude-code daemon — remote-control not viable in-cluster

Auth + persistence fully resolved (CLAUDE_CONFIG_DIR, uid 1024:100, OAuth on
PVC), but remote-control did not work usefully in-cluster and further effort
isn't worth it. The autonomous code-automation loop does NOT depend on this
daemon — it uses headless 'claude -p' Jobs (claude-code/runner/). Manifests
retained, just not reconciled.

Refs #423


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>