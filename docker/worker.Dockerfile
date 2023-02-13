FROM cdd-builder AS builder

RUN nx dep-graph --file dep-graph.json
RUN nx build cdd-backend:buildWorker --configuration=production

FROM node:lts-alpine3.17

RUN addgroup runner && adduser --uid 1001 -G runner -D --shell /bin/false runner

ENV NODE_ENV='production'
COPY --from=builder /app/builder/dist ./dist
COPY --from=builder app/builder/package.json app/builder/yarn.lock ./
RUN yarn install --production --frozen-lockfile

CMD ["node", "./dist/apps/cdd-backend/main.js"]

USER runner