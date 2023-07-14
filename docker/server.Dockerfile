################################################################

ARG BUILDER_CONTAINER_TAG=latest

################################################################

FROM mesh-cdd-builder:${BUILDER_CONTAINER_TAG} AS builder
FROM node:lts-alpine3.17

################################################################

COPY --from=builder --chown=root:root /app/builder/node_modules ./node_modules
COPY --from=builder --chown=root:root /app/builder/dist/apps/cdd-backend/server ./dist

################################################################

USER node

################################################################

CMD ["node", "./dist/main.js"]

################################################################
