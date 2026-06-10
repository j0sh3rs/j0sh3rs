<img src="https://my-badges.github.io/my-badges/fix-4.png" alt="I did 4 sequential fixes." title="I did 4 sequential fixes." width="128">
<strong>I did 4 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/a187e66daa0eb8e489a856313b16217018a6ebc9">a187e66</a>: fix(ai): fix cloudflare MCP server registration args

@cloudflare/mcp-server-cloudflare requires `run <account_id>` subcommand.
Add CLOUDFLARE_ACCOUNT_ID to secret (BTH Account) and pass it as arg.
- <a href="https://github.com/j0sh3rs/home-ops/commit/245803f59d21ca05864cbce51b54ec8b70887885">245803f</a>: fix(ai): write mcpjungle conf directly from stored admin token

init-server only writes ~/.mcpjungle.conf on first run; subsequent runs
("already initialized") exit non-zero without writing the file, leaving
no access token for register calls. Write the conf directly from
MCPJUNGLE_ADMIN_TOKEN (stored in secret) — idempotent across all runs.
- <a href="https://github.com/j0sh3rs/home-ops/commit/051630b22522a98e7ab5f7f9ec2b8adfee3839ae">051630b</a>: fix(ai): add explicit login after init-server in bootstrap job

init-server does not write ~/.mcpjungle.conf when server is already
initialized, leaving no access token for subsequent CLI calls. Always
run `login MCPJUNGLE_API_KEY` after init-server to ensure conf file
is present regardless of init-server outcome.
- <a href="https://github.com/j0sh3rs/home-ops/commit/ec45df329e6a328647d75ea15bb7da4b874da1db">ec45df3</a>: fix(ai): fix mcpjungle bootstrap job for v0.4.5 CLI

Binary is /mcpjungle (not on PATH). init-server has no --admin-email/
--admin-password flags in v0.4.5 (reads env automatically). `list`
requires `list servers` subcommand. grep pattern updated to match
plain-text output format ("1. name\n...") not JSON.


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>