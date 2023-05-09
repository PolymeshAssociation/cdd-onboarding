FROM mesh-cdd-builder AS builder

ENV NX_LOG_LEVEL="__APP_LOG_LEVEL__"
ENV NX_API_URL="__NX_API_URL__"
ENV NX_MESH_NETWORK__="__NX_MESH_NETWORK__"
ENV NX_LOG_LEVEL="__NX_LOG_LEVEL__"
ENV NX_H_CAPTCHA_SITE_KEY="__NX_H_CAPTCHA_SITE_KEY__"

ENV NODE_ENV='production'

RUN nx dep-graph --file dep-graph.json
RUN nx build cdd-frontend --configuration=production

FROM nginx:stable-alpine3.17

COPY --from=builder /app/builder/dist/apps/cdd-frontend /usr/share/nginx/html
COPY --chown=root:root replace-env-var-placeholders.sh /usr/local/bin/replace-env-var-placeholders.sh
COPY env.var.list /srv/env.var.list

CMD replace-env-var-placeholders.sh && \
    nginx -g 'daemon off;'