#!/bin/sh

set -exu -o pipefail

date
echo "Replacing environment variables with their runtime values..."

while read LINE; do
    TMP=$(mktemp)
    chmod 0644 "$TMP"
    chown root:root "$TMP"
    grep -rl "\${$LINE}" /usr/share/nginx/html | \
        xargs --no-run-if-empty -I{} bash -c "envsubst '\${$LINE}' < '{}' > '$TMP' && mv '$TMP' '{}'" || true
done < /srv/env.var.list

date
echo "Finished replacing environment variables with their runtime values"