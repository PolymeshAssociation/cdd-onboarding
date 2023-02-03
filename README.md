# CDD Onboarding

This project handles Polymesh Customer Due Dilligence (CDD) claims, which are required to onboard and interact with the chain.

CDD claims ensure every participant of the Polymesh chain has completed some form of Know your customer / Know your business (KYC/KYB) process. Every address needs to be asociated to a CDD claim before it can receive the POLYX token or other Assets.

## Developer Info

**node v18 with yarn v3 should be used**

This repo uses [nx](https://nx.dev), to execute some commands either prefix with `npx` or install `nx` globally

e.g. `npx nx $CMD` can be shortened to `nx $CMD` with a single execution of `npm i -g nx`

### Docker Compose

A docker-compose environment is provided. Use `docker compose up` to start a local developer environment

Use `cp .env.sample .env`, and then edit `.env` to control the environment

### Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

### Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.
