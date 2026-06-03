<img src="https://my-badges.github.io/my-badges/fix-2.png" alt="I did 2 sequential fixes." title="I did 2 sequential fixes." width="128">
<strong>I did 2 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/6571582c664e5724a4fc1b4009ed07702138fb41">6571582</a>: fix(ai): wyoming STT image + tune vmsingle/HA query load

- faster-whisper: swap fedirz/faster-whisper-server (OpenAI HTTP, no
  Wyoming) for rhasspy/wyoming-whisper:3.1.0 — real Wyoming TCP server
  on :10300 that HA's Wyoming integration can actually connect to.
  Drop dead :8000 http port; remount PVC at /data.
- vmsingle: raise search.maxConcurrentRequests 16->24, maxQueueDuration
  10s->30s to stop 429-flooding query clients.
- home-assistant: back off cluster REST sensors 30/60s->120s, add
  value_json guards + 25s timeout to kill the 429-driven template-error
  spam.
- <a href="https://github.com/j0sh3rs/home-ops/commit/b8ad4f48e3e1fe375d503499c7622d9861fd1b2b">b8ad4f4</a>: fix(ai): use chart structured auth (CUSTOM provider) for langfuse OIDC — additionalEnv AUTH_* duplicated chart-emitted keys


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>