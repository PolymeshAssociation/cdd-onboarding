################################################################

ARG BUILDER_CONTAINER_TAG=latest

################################################################

FROM mesh-cdd-builder:${BUILDER_CONTAINER_TAG} AS builder
FROM nginx:stable-alpine3.17

################################################################

COPY --chown=root:root docker/replace-env-var-placeholders.sh /usr/local/bin/
COPY --from=builder --chown=root:root /app/env.var.list /srv/
COPY --from=builder --chown=root:root /app/builder/dist/apps/cdd-frontend /usr/share/nginx/html

################################################################

ENV NX_API_URL=NX_API_URL_NOT_SET
ENV NX_MESH_NETWORK=NX_MESH_NETWORK_NOT_SET
ENV NX_LOG_LEVEL=NX_LOG_LEVEL_NOT_SET
ENV NX_H_CAPTCHA_SITE_KEY=NX_H_CAPTCHA_SITE_KEY_NOT_SET
ENV NX_USER_PORTAL_URL=NX_USER_PORTAL_URL_NOT_SET
ENV NX_FRACTAL_ENABLED=NX_FRACTAL_ENABLED_NOT_SET
ENV NX_MOCK_ENABLED=NX_MOCK_ENABLED_NOT_SET
ENV NX_SS58_FORMAT=NX_SS58_FORMAT_NOT_SET

################################################################

CMD replace-env-var-placeholders.sh && \
    nginx -g 'daemon off;'

################################################################
