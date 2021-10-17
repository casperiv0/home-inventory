# Docs

This is a simple README to show how you can setup this project locally

## Local setup

### Requirements

- [node +v14](https://nodejs.org/en/)
- [Docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/) (should come with Docker)

### Getting started

1. Clone the repo: `git clone git@github.com:Dev-CasperTheGhost/home-inventory.git`
2. Install the dependencies: `yarn`
3. move the `.env.example` to `.env`: `cp .env.example .env`

### Development

1. Follow the steps of [getting-started](#getting-started)
2. Start the app
   - api: `docker-compose up` (in the root folder)
   - client: `cd client && npm run dev`

### Production

1. Follow the steps of [getting-started](#getting-started)
2. Build the client code: `cd client && npm run build`
3. Start the app: `docker-compose -f prod.docker-compose.yml up`
