# CDD Onboarding

This project handles Polymesh Customer Due Dilligence (CDD) claims, which are required to onboard and interact with the chain.

CDD claims ensure every participant of the Polymesh chain has completed some form of Know your customer / Know your business (KYC/KYB) process. Every address needs to be associated to a CDD claim before it can receive the POLYX token or other Assets.

## Running Locally

**node v18 with yarn v3 should be used**

This repo uses [nx](https://nx.dev), to execute some commands either prefix with `npx` or install `nx` globally

e.g. `npx nx $CMD` can be shortened to `nx $CMD` with a single execution of `npm i -g nx`

## Dependencies

The front end depends on the backend, and the backend depends on having Redis and a Polymesh node. To start external dependencies use:

`docker compose up` (assumes docker is installed and running)

Note, there are profiles for auxillary services. Look at the file to see the option. e.g.

`docker compose --profile=vault up`

## Backend

The backend is split into two parts:

- HTTP Server providing an interface for users and receives webhooks from providers
- Worker process that creates on chain CDD claims from the queue

Redis is used to store state and the queue

To start the server use: `nx run cdd-backend:serve`
For the worker use: `nx run cdd-backend:work`

See the corresponding .env.sample files for configuration. Both Netki and Jumio need to be authorized

These specify the correct `--entryFile` to `nest start`

## Frontend

The frontend is React with Chakra UI

To serve the frontend use:

`nx run serve cdd-frontend`

## Tools

### Redis Commander

If you haven't used Redis, `npx redis-commander` should bring up a simple [web based GUI](https://joeferner.github.io/redis-commander/) for Redis

### Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.
