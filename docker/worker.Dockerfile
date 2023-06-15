ARG BUILDER_CONTAINER_TAG=latest

FROM mesh-cdd-builder:${BUILDER_CONTAINER_TAG} AS builder

RUN nx dep-graph --file dep-graph.json
RUN nx build cdd-backend:buildWorker --configuration=production

FROM node:lts-alpine3.17

# `nx` npm package dependencies:
RUN apk add python3 \
            make \
            cmake \
            g++

RUN addgroup runner && adduser --uid 1001 -G runner -D --shell /bin/false runner

ENV NODE_ENV='production'
COPY --from=builder /app/builder/dist/apps/cdd-backend/worker ./dist
COPY --from=builder app/builder/package.json app/builder/yarn.lock ./
RUN yarn install --production --frozen-lockfile

CMD ["node", "./dist/main.js"]

USER runner
