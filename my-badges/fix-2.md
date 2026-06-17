<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/9f26bd8b325bab92b9ce92f618ea3e72c28220ef">9f26bd8</a>: Fix/claude code auth split (#431)

* temp(ai): re-sleep claude-code for 'claude auth login'

Prior 'claude login' left remote-control failing org-eligibility lookup.
Re-sleep so operator runs 'claude auth login' (the command the error names).
Token persists on claude-home PVC (nfs-client, confirmed network-backed).
Revert after.

Refs #423

* fix(ai): run claude-code as uid 1024 to match NFS squash

Root cause of remote-control org-eligibility failure: nfs-client squashes
all writes to uid/gid 1024, but the pod ran as 1001 — so it could not read
its own NFS-owned 0600 state file ~/.claude/.claude.json (org/account info),
breaking the eligibility lookup. Run AS 1024 (pod + both containers) +
fsGroup 1024 so the process owns and can read/write its state. Sleep override
retained: a fresh 'claude auth login' as 1024 is needed to finally write the
org block into .claude.json (prior logins as 1001 could not).

Refs #423
- <a href="https://github.com/j0sh3rs/home-ops/commit/c3ab4ec25180483858e0ae3e49a093c9f7693792">c3ab4ec</a>: Fix/claude code auth split (#430)

* revert(ai): claude-code daemon back to remote-control after OAuth login

OAuth token confirmed on claude-home PVC (.credentials.json). Restore the
remote-control command + re-enable liveness. Daemon now authenticates via
the persisted claude.ai subscription token.

Refs #423

* temp(ai): re-sleep claude-code for 'claude auth login'

Prior 'claude login' left remote-control failing org-eligibility lookup.
Re-sleep so operator runs 'claude auth login' (the command the error names).
Token persists on claude-home PVC (nfs-client, confirmed network-backed).
Revert after.

Refs #423


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>