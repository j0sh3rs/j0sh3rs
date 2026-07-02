<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/904d3ab39b43cd3d9f05e43f2a25d0400754a663">904d3ab</a>: fix(ai): archive claude-code — superseded by OpenCode

claude-code (headless engine daemon + runner Job template) has been
disabled since 2026-06-16 (remote-control OAuth-only, never worked
usefully in-cluster) and its successor Goose was itself dropped the
same day the ai-stack was pruned. OpenCode covers the interactive
coding-assistant role now. Moved to archive/claude-code/ for possible
future reference; dropped the dangling app-template component ref
(archived dirs aren't Flux-built) and the disabled-reference comment
block in ai/kustomization.yaml.
- <a href="https://github.com/j0sh3rs/home-ops/commit/2af48755d3313a43e17f7c38537f3527e6c700fc">2af4875</a>: fix(various): Rotate gh pat


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>