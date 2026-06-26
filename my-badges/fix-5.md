<img src="https://my-badges.github.io/my-badges/fix-5.png" alt="I did 5 sequential fixes." title="I did 5 sequential fixes." width="128">
<strong>I did 5 sequential fixes.</strong>
<br><br>

Commits:

- <a href="https://github.com/j0sh3rs/home-ops/commit/77e78a676b83ab94bc90743a39a13d24c5bb5130">77e78a6</a>: fix(omega-mcp): bump to 1.5.4-r5 (MAC-independent license fingerprint)

Picks up the sitecustomize.py uuid.getnode() pin from
j0sh3rs/containers (commit 2dc0ccb). Also reverts the hostNetwork
stopgap from the manifest (fix A) now that the image-side fix (B)
handles the fingerprint. Stable hostname retained.
- <a href="https://github.com/j0sh3rs/home-ops/commit/a4925144c24cccfa29b801e2206fd4e45ad0120c">a492514</a>: fix(omega-mcp): hostNetwork to stabilize license MAC fingerprint

The OMEGA Pro license fingerprint includes uuid.getnode() (the pod
eth0 MAC). Cilium 1.19 assigns a random MAC per pod and has no static
MAC annotation, so the fingerprint changed every rollout and the
pro_tools init gate failed (CrashLoopBackOff) even after a successful
omega activate. Run on the host network so uuid.getnode() resolves the
node's stable NIC MAC; the pod is already node-pinned via openebs RWO.

Stopgap (fix A). Clean fix (B) is a sitecustomize.py in the
j0sh3rs/containers omega-mcp image pinning uuid.getnode() from
device_id; revert hostNetwork once that -r5 image ships.
- <a href="https://github.com/j0sh3rs/home-ops/commit/003afbdcf2498d0dc40909f18345dfc07658f1c1">003afbd</a>: fix(omega-mcp): pin stable pod hostname for license fingerprint

OMEGA Pro license is machine-fingerprint bound and the vendor wheel
computes the fingerprint from the pod hostname. On a Deployment the
hostname defaults to the random pod name, so every rollout produced a
new fingerprint and the pro_tools init gate failed (init-omega exit 1
-> CrashLoopBackOff) even after a successful 'omega activate'. Pin
hostname=omega-mcp so one activation persists across rollouts.

Node identity was never the cause: openebs-hostpath RWO already pins
the pod to bee-jms-01.
- <a href="https://github.com/j0sh3rs/home-ops/commit/46ccc9c8c5faa89d5304dbc621d7a1eb375141be">46ccc9c</a>: fix(ai): omega-mcp renovate tag fix to keep the build portion of release
- <a href="https://github.com/j0sh3rs/home-ops/commit/4f3e6b7c00f3f6d3283de322d9237e730d79a964">4f3e6b7</a>: fix(omega): Bump omega to proper r version with pro fixes"
"


Created by <a href="https://github.com/my-badges/my-badges">My Badges</a>