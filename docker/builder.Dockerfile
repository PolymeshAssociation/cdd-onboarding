################################################################

FROM node:lts-alpine3.17

################################################################

RUN apk add --no-cache \
            python3 \
            make \
            cmake \
            g++ \
            jq

################################################################

RUN npm i -g node-gyp

################################################################

WORKDIR /app/builder
RUN chown -R node: /app

################################################################

USER node

################################################################

COPY --chown=node:node . .

RUN yarn install \
        --frozen-lockfile \
        --no-progress && \
    ./node_modules/nx/bin/nx.js build cdd-backend --configuration=production && \
    ./node_modules/nx/bin/nx.js build cdd-backend:buildWorker --configuration=production && \
    { \
        sed -n 's/^\(.*\)=.*$/\1=__\1__/p' .env.sample.web > .env && \
        ./node_modules/nx/bin/nx.js build cdd-frontend --configuration=production && \
        sed 's/^\(.*\)=.*$/\1/' .env > /app/env.var.list && \
        rm .env; \
    } && \
    yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")') && \
    rm -r /home/node/.cache/

################################################################
