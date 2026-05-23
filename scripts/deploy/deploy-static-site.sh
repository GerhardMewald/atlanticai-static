#!/usr/bin/env bash
set -euo pipefail

APP="atlanticai-static"
ENVIRONMENT="${1:-}"

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
  echo "Usage: $0 staging|production"
  exit 1
fi

REPO_DIR="/opt/atlanticai-static"
SOURCE_DIR="$REPO_DIR/html"

if [[ "$ENVIRONMENT" == "staging" ]]; then
  TARGET_DIR="/opt/atlanticai-static-staging/html"
  DOMAIN="staging.atlanticai.eu"
else
  TARGET_DIR="/opt/atlanticai-static/html"
  DOMAIN="atlanticai.eu"
fi

TS="$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="/opt/backups/${APP}/${ENVIRONMENT}/${TS}"

cd "$REPO_DIR"

if [[ -n "$(git status --short)" ]]; then
  echo "ERROR: Working tree is not clean."
  git status --short
  exit 1
fi

GIT_SHA="$(git rev-parse HEAD)"
GIT_BRANCH="$(git branch --show-current)"

mkdir -p "$BACKUP_DIR"
mkdir -p "$TARGET_DIR"

if [[ -d "$TARGET_DIR" ]]; then
  tar -czf "$BACKUP_DIR/html-before-deploy.tar.gz" -C "$TARGET_DIR" .
fi

rsync -a --delete \
  --exclude ".git" \
  --exclude "html.before-*" \
  --exclude "html.broken-*" \
  "$SOURCE_DIR/" "$TARGET_DIR/"

cat > "$TARGET_DIR/release.json" <<EOF
{
  "app": "$APP",
  "environment": "$ENVIRONMENT",
  "domain": "$DOMAIN",
  "git_sha": "$GIT_SHA",
  "git_branch": "$GIT_BRANCH",
  "released_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo "Deployed $APP to $ENVIRONMENT"
echo "Target: $TARGET_DIR"
echo "SHA: $GIT_SHA"
echo "Backup: $BACKUP_DIR"
