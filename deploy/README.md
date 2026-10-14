# Deploying NullHawk

`run.sh` builds **your** NullHawk image from this repo (rebrand + target verification) and brings up the whole stack with one command. It does not run upstream PentAGI — it builds the code in this branch.

## Requirements
- Docker + Docker Compose
- **Virtualization enabled.** On a server/VPS this is on by default. On a laptop you must enable VT-x (Intel) / SVM (AMD) in BIOS and the "Virtual Machine Platform" Windows feature — otherwise Docker's engine will not start.

## Fastest path: a cheap Linux VPS (no BIOS fuss)
On a fresh Ubuntu 22.04+ box:

```bash
# 1. install Docker
curl -fsSL https://get.docker.com | sh

# 2. get the code
git clone https://github.com/STongeren/pentagi.git nullhawk && cd nullhawk
git checkout nullhawk-rebrand

# 3. build + run
./deploy/run.sh
```

Then open the URL it prints and log in with `admin@pentagi.com` / `admin` (you'll change the password on first login). To serve on your own domain instead of localhost:

```bash
PUBLIC_URL=https://nullhawk.yourdomain.com ./deploy/run.sh
```

(point the domain's DNS at the box and put a reverse proxy / the built-in SSL in front — see the main README's security section).

## Local (Windows/macOS) with Docker Desktop
Same three steps, but Docker Desktop must be running first (and virtualization on). Then `./deploy/run.sh` (Git Bash on Windows).

## After it's up
- **Settings → Target Verification** — add a domain, publish the shown `_nullhawk-verify.<domain>` TXT record, click Check.
- Set `REQUIRE_TARGET_VERIFICATION=true` in `.env` and restart to enforce the ownership gate on every flow.
- Add at least one LLM key in `.env` (e.g. `ANTHROPIC_API_KEY`) to run flows.

## Notes
- The hand-ported sqlc layer (`backend/pkg/database/verified_targets*.go`) should be regenerated with `sqlc generate` against the live database once, to confirm it is byte-identical (see `docs/saas/02-target-verification.md`).
- First build is slow (compiles the Go backend and the React frontend); later runs reuse the image.
