#!/bin/sh

# this scripts builds a set of images for the polymesh CDD service

export DOCKER_BUILDKIT=1 # use buildkit for better build times

# note builder tags are referenced in the docker files
docker build .. -t mesh-cdd-builder -f builder.Dockerfile

# final tags are arbitrary
docker build .. -t mesh-cdd-worker -f ./worker.Dockerfile
docker build .. -t mesh-cdd-server -f ./server.Dockerfile
