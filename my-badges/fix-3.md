<img src="https://my-badges.github.io/my-badges/fix-3.png" alt="I did 3 sequential fixes." title="I did 3 sequential fixes." width="128">
<strong>I did 3 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/fec15e8a198d0546c65c74ea33bb22b580c12011">fec15e8</a>: fix(ai): redirect git global config to PVC path in claude-code bootstrap

/home/claude/.gitconfig is read-only in the container image layer.
GIT_CONFIG_GLOBAL redirects to the NFS PVC which is writable by uid 1001.
- <a href="https://github.com/j0sh3rs/home-ops/commit/9167fa0c77526f03abd3b3e121669968c3662f45">9167fa0</a>: fix(ai): run claude-code bootstrap as uid 1001, drop debian init

NFS root_squash prevents chown from root. Switch init to main image
(already has git+bash), run as 1001 throughout. Replace envsubst with
sed (no gettext-base needed on alpine).
- <a href="https://github.com/j0sh3rs/home-ops/commit/26e2fc25666cc1f719b30d5eedb92942d592d851">26e2fc2</a>: fix(ai): fix git safe.directory in claude-code bootstrap init

Init runs as root; workspace owned 1001:1001 from prior run triggers
git 2.35+ dubious ownership rejection on fetch/reset.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>