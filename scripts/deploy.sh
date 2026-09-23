#!/usr/bin/env bash
# Build locally and ship .output to the VPS (the 2 GB box has no room to run a
# Nuxt build next to the other sites). The Nitro output is self-contained: no
# install on the server. Usage: bun run deploy
set -euo pipefail
HOST=root@45.76.181.237
KEY=~/.ssh/id_ed25519
DIR=/home/frontend/easybeadpattern
PORT=4015

cd "$(dirname "$0")/.."
rm -rf .output
bun run build

ssh -i $KEY $HOST "mkdir -p $DIR"
# Upload beside the live build, then swap, so the site is never half-copied.
rsync -az --no-owner --no-group --delete -e "ssh -i $KEY" .output/ "$HOST:$DIR/.output.new/"
ssh -i $KEY $HOST bash -s <<REMOTE
set -e
cd $DIR
rm -rf .output.old
[ -d .output ] && mv .output .output.old
mv .output.new .output
if pm2 describe easybeadpattern >/dev/null 2>&1; then
  pm2 restart easybeadpattern --update-env
else
  PORT=$PORT NUXT_PUBLIC_SITE_URL=https://easybeadpattern.com \\
    pm2 start .output/server/index.mjs --name easybeadpattern --cwd $DIR --max-memory-restart 250M
  pm2 save
fi
rm -rf .output.old
REMOTE
echo "Deployed. Check: curl -sI https://easybeadpattern.com"
