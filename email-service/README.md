Backend for Sirius Software challenge

This server assumes that if Sendgrid or Mailgun respond with a `200 Queued` then the mail was sent, even if it's still enqueued.

## Setup

- `nvm use`
- `npm i`
- `cp ./.env.template ./.env`
- Fill out ./.env

## Usage

### To run:

- `npm run dev`

### To test:

- `npm test`

## Production

- `npm run build`
- `npm start`
