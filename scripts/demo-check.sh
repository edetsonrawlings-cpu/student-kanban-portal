#!/usr/bin/env bash
# Non-destructive preflight for the presentation machine. It mirrors the four
# CI quality gates and leaves production startup as an explicit final step.
set -euo pipefail
cd "$(dirname "$0")/.."

PORT="${1:-3000}"
MIN_DISK_KB=$((5 * 1024 * 1024))
MIN_MEMORY_KB=$((1 * 1024 * 1024))

step() { printf '\n==> %s\n' "$1"; }
ok() { printf '[OK] %s\n' "$1"; }
warn() { printf '[WARN] %s\n' "$1"; }
fail() { printf '[ERROR] %s\n' "$1" >&2; exit 1; }

port_is_free() {
  DEMO_PORT="$PORT" node <<'NODE'
const net = require("node:net");
const server = net.createServer();

server.once("error", () => process.exit(1));
server.listen(Number(process.env.DEMO_PORT), "0.0.0.0", () => {
  server.close((error) => process.exit(error ? 1 : 0));
});
NODE
}

if (( $# > 1 )) || [[ ! "$PORT" =~ ^[0-9]+$ ]] || (( PORT < 1 || PORT > 65535 )); then
  fail "Usage: npm run demo:check -- [port] (port must be between 1 and 65535)"
fi

step "Machine preflight"
command -v node >/dev/null 2>&1 || fail "Node.js is not installed."
command -v npm >/dev/null 2>&1 || fail "npm is not installed."

NODE_VERSION="$(node --version)"
if ! node -e 'const [major, minor] = process.versions.node.split(".").map(Number); process.exit(major > 20 || (major === 20 && minor >= 9) ? 0 : 1)'; then
  fail "Node.js >= 20.9 is required; found $NODE_VERSION."
fi
ok "Node.js $NODE_VERSION"

[[ -x node_modules/.bin/next ]] || fail "Dependencies are missing. Run npm ci while the network is available."
ok "Dependencies installed"

DISK_AVAILABLE_KB="$(df -Pk . | awk 'NR == 2 { print $4 }')"
if [[ "$DISK_AVAILABLE_KB" =~ ^[0-9]+$ ]]; then
  DISK_AVAILABLE_GB="$(awk -v value="$DISK_AVAILABLE_KB" 'BEGIN { printf "%.1f", value / 1024 / 1024 }')"
  if (( DISK_AVAILABLE_KB < MIN_DISK_KB )); then
    warn "$DISK_AVAILABLE_GB GiB disk space available; 5 GiB or more is recommended."
  else
    ok "$DISK_AVAILABLE_GB GiB disk space available"
  fi
fi

if [[ -r /proc/meminfo ]]; then
  MEMORY_AVAILABLE_KB="$(awk '/^MemAvailable:/ { print $2 }' /proc/meminfo)"
  MEMORY_AVAILABLE_GB="$(awk -v value="$MEMORY_AVAILABLE_KB" 'BEGIN { printf "%.1f", value / 1024 / 1024 }')"
  if (( MEMORY_AVAILABLE_KB < MIN_MEMORY_KB )); then
    warn "$MEMORY_AVAILABLE_GB GiB memory available; close other applications before the demo."
  else
    ok "$MEMORY_AVAILABLE_GB GiB memory available"
  fi
fi

port_is_free || fail "Port $PORT is occupied. Stop its owner or retry with: npm run demo:check -- 3001"
ok "Port $PORT is free"

step "1/4 Lint"
npm run lint
ok "Lint clean"

step "2/4 Typecheck"
npm run typecheck
ok "No type errors"

step "3/4 Tests"
npm test
ok "All tests passed"

step "4/4 Production build"
npm run build
ok "Build succeeded"

step "Final port check"
port_is_free || fail "Port $PORT became occupied during the checks. Choose another port."
ok "Port $PORT is still free"

printf '\nDemo checks passed. Start the production server with:\n'
printf '  npm start -- -p %s\n' "$PORT"
printf 'Then open http://localhost:%s\n' "$PORT"
