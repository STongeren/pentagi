#!/usr/bin/env bash
# NullHawk turnkey deploy: builds the NullHawk image from this repo (so you run
# YOUR fork with the rebrand + target verification, not upstream PentAGI), starts
# the full stack, waits until it answers, and prints the login.
#
# Requirements: Docker + Docker Compose on a machine with virtualization enabled
# (a Linux server/VPS is easiest; locally you need VT-x/SVM on in BIOS).
#
# Usage:  ./deploy/run.sh            # build + start, serve on https://localhost:8443
#         PUBLIC_URL=https://nullhawk.example.com ./deploy/run.sh   # behind a domain
set -euo pipefail

cd "$(dirname "$0")/.."   # repo root
IMAGE="${IMAGE:-nullhawk:local}"
URL="${PUBLIC_URL:-https://localhost:8443}"

command -v docker >/dev/null 2>&1 || { echo "ERROR: Docker is not installed or not on PATH."; exit 1; }
docker info >/dev/null 2>&1 || { echo "ERROR: the Docker engine is not running (on a laptop this usually means virtualization is off in BIOS)."; exit 1; }

# 1. First-run config: a .env with sane defaults + generated secrets.
if [ ! -f .env ]; then
  echo "==> Creating .env from .env.example"
  cp .env.example .env
  gen() { openssl rand -hex "$1" 2>/dev/null || head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; }
  # portable in-place edit (GNU & BSD sed)
  sed -i.bak "s|^COOKIE_SIGNING_SALT=.*|COOKIE_SIGNING_SALT=$(gen 24)|" .env
  sed -i.bak "s|^PENTAGI_POSTGRES_PASSWORD=.*|PENTAGI_POSTGRES_PASSWORD=$(gen 16)|" .env
  rm -f .env.bak
  echo "    -> add at least one LLM key to .env (e.g. ANTHROPIC_API_KEY) to actually run flows."
fi

# 2. Build the NullHawk image from source (backend + frontend, multi-stage Dockerfile).
echo "==> Building $IMAGE from source (first build is slow)"
docker build -t "$IMAGE" .

# 3. Start the stack with our image (pgvector/scraper infra images are pulled as-is).
echo "==> Starting the stack"
PENTAGI_IMAGE="$IMAGE" docker compose up -d

# 4. Wait until the web UI answers.
echo -n "==> Waiting for NullHawk at $URL "
for _ in $(seq 1 90); do
  if curl -ksf -o /dev/null "$URL"; then ok=1; break; fi
  echo -n "."; sleep 2
done
echo
if [ "${ok:-0}" != "1" ]; then
  echo "NullHawk did not answer yet. Check logs:  docker compose logs -f pentagi"
  exit 1
fi

# 5. Done.
cat <<EOF

================================================================
  NullHawk is live:  $URL
  Login:             admin@pentagi.com  /  admin
                     (you'll be asked to change the password)
================================================================
  Next: Settings -> Target Verification to add & verify a target,
  and set REQUIRE_TARGET_VERIFICATION=true in .env to enforce the
  ownership gate on every flow.
  Stop with:  docker compose down
EOF
