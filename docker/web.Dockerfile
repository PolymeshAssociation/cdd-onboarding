FROM mesh-cdd-builder AS builder

RUN nx dep-graph --file dep-graph.json
RUN nx build cdd-frontend --configuration=production

FROM nginx

ENV NODE_ENV='production'
# URL TO CDD Backend i.e. http://localhost:3333
ENV NX_API_URL="__APP_SERVER_URL__"

# Network used by the application used for checking if user has selected the correct Polymesh wallet (i.e. local, testnet, mainnet, staging)
ENV NX_MESH_NETWORK="__APP_NETWORK_NAME__"

# Log level for the application (i.e. debug, info, warn, error)
ENV NX_LOG_LEVEL="__APP_LOG_LEVEL__"

COPY --from=builder /app/builder/dist/apps/cdd-frontend /usr/share/nginx/html