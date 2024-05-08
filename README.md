# CDD Onboarding

This project handles Polymesh Customer Due Diligence (CDD) claims, which are required to onboard and interact with the chain.

CDD claims ensure every participant of the Polymesh chain has completed some form of Know your customer / Know your business (KYC/KYB) process. Every address needs to be associated to a CDD claim before it can receive the POLYX token or other Assets.

## Running Locally

**node v18 with yarn v3 should be used**

This repo uses [nx](https://nx.dev), to execute some commands either prefix with `npx` or install `nx` globally

e.g. `npx nx $CMD` can be shortened to `nx $CMD` with a single execution of `npm i -g nx`

Note: to test out the end to end flow with a local build, you will need to be able to receive webhooks.

There are a number of ways to do this you can use `ssh -R` for remote port forwarding, configure your router to forward inbound packets, or deploy to a cloud instance.

The easiest way is to use [ngrok](https://ngrok.com/). The free plan should suffice. Running ngrok will give you a URL that will forward traffic to localhost. This can then be set in the providers webhook URL setting.

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

## UI Storybook

This repository also hosts polymesh-theme library for chakra-ui with some custom components.

To preview theme and components in Storybook run:

`nx run polymesh-theme:storybook`

## Tools

### Redis Commander

If you haven't used Redis, `npx redis-commander` should bring up a simple [web based GUI](https://joeferner.github.io/redis-commander/) for Redis

### Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## General Flow

Users can choose one of 3 providers: Fractal, Jumio and Netki and provide an address to onboard as their primary key.

### Fractal

If the user selects Fractal they will be directed to Fractal's platform who will handle the onboarding process in its entirety. In this case the CDD service is only providing a link and has no more involvement.

### Jumio

If the user selects Jumio a UUID will be generated and templated into a URL for the user to complete their identity verification at. After the user uploads their documents and are verified, Jumio will dispatch a callback to our server, which will in turn be processed by our worker to create the user's CDD claim.

The user will be redirected to our frontend page, and the link will contain their address so we can provide accurate information about their application status.

### Netki

If the user selects Netki an access code will be associated to their provided address. This access code is templated into a URL to direct the user to verify their identity via mobile device. When the documents are verified Netki will dispatch a callback to our server, which will use the included access code

Netki does not allow a client ID to be specified so an access code to address lookup must be maintained. If the user restarts the flow they will be issued a new access code and our server will receive a callback to update the lookup.

The user will be redirect to our frontend page, but the redirect link will no contain the access code nor the address. This makes it difficult to determine the application status after their redirect, especially in the case when they started on desktop and were redirected to mobile for verification.

#### Business

Netki also offers support for KYB. For this flow an access code is allocated manually via API. The business submitter will need to verify their identity personally in addition to uploading business documents.

When the individual verifies their identity a callback will be issued containing the access code an business id. Our worker will create an association from this business ID to the address if it was provided in the access code generation.

When the business is verified Netki will issue another webhook where the business ID to address lookup will be used to create the CDD claim.