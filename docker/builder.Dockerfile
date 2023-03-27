FROM node:lts-alpine3.17 AS mesh-cdd-builder

WORKDIR /app/builder

RUN yarn global add nx
COPY package.json yarn.lock ./

RUN ["yarn", "install"]
COPY .. .