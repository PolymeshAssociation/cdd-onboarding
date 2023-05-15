FROM mesh-cdd-builder AS builder

ENV NX_API_URL='__NX_API_URL__'
ENV NX_MESH_NETWORK='__NX_MESH_NETWORK__'
ENV NX_LOG_LEVEL='__NX_LOG_LEVEL__'
ENV NX_H_CAPTCHA_SITE_KEY='__NX_H_CAPTCHA_SITE_KEY__'

ENV NODE_ENV='production'

RUN nx dep-graph --file dep-graph.json
RUN nx build cdd-frontend --configuration=production

FROM nginx:stable-alpine3.17

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/

COPY --from=builder /app/builder/dist/apps/cdd-frontend /usr/share/nginx/html
COPY --chown=root:root docker/replace-env-var-placeholders.sh /usr/local/bin/replace-env-var-placeholders.sh
COPY docker/env.var.list /srv/env.var.list

ENV NX_LOG_LEVEL=NX_LOG_LEVEL_NOT_SET
ENV NX_API_URL=NX_API_URL_NOT_SET
ENV NX_MESH_NETWORK=NX_MESH_NETWORK_NOT_SET
ENV NX_LOG_LEVEL=NX_LOG_LEVEL_NOT_SET
ENV NX_H_CAPTCHA_SITE_KEY=NX_H_CAPTCHA_SITE_KEY_NOT_SET

CMD replace-env-var-placeholders.sh && \
    nginx -g 'daemon off;'