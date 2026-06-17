<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/7862ad37a79570dfcb72a06cf8338be3399b6c6e">7862ad3</a>: fix(ai): set CLAUDE_CONFIG_DIR so account/org state persists on PVC

Root cause of remote-control 'Unable to determine your organization': Claude
splits config between $HOME/.claude.json (HOME root — EPHEMERAL, only .claude
is the PVC mount) and $HOME/.claude/. Account/org state landed on ephemeral fs
and vanished on pod restart. Pin CLAUDE_CONFIG_DIR=/home/claude/.claude
(daemon app+bootstrap + runner) so ALL config persists on the volume.

Refs #423
- <a href="https://github.com/j0sh3rs/home-ops/commit/ae572e8310999a78a5c84361a90928d1487e53ff">ae572e8</a>: fix(ai): runner Job uid 1024:100 to match baked image user

Align headless runner Job securityContext with the claude-code image's
pinned user (1024:100). Keeps image == pod across both daemon and runner.

Refs #423
- <a href="https://github.com/j0sh3rs/home-ops/commit/910c74174dcfc2e7b4ade4b65e86e5a72a95142c">910c741</a>: fix(ai): claude-code gid 100 (users) to match NFS admin:users ownership

NFS mount owns files as admin:users = uid 1024, gid 100 (not gid 1024 as
previously set). Align pod + both containers + fsGroup to 1024:100 so the
process fully owns its state files. Sleep override retained until a fresh
claude auth login on the purged mount verifies as 1024:100.

Refs #423


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>