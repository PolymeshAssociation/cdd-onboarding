FROM node:lts-alpine3.17 AS mesh-cdd-builder

# `nx` npm package dependencies:
RUN apk add python3 \
            make \
            cmake \
            g++

WORKDIR /app/builder

RUN yarn global add nx
COPY package.json yarn.lock ./

RUN ["yarn", "install"]
COPY . .
