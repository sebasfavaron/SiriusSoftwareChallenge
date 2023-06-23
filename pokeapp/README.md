# Frontend for Sirius Software challenge

This is a basic site with a `/pokemon` route to load all pokemon and a `/pokemon/:id` to see more details about that pokemon, in particular its evolutions.

## Setup

- `nvm use`
- `npm i`
- Fill out ./.env.development and ./.env.production (they will be your development and production env variables respectively)

## Usage

### To run:

- `npm start`

### To test:

- `npm test`

## Production

- `npm run build`
- Serve it with any static server (ex. `npm install -g serve; serve -s build`)

## Backlog

- Better use of `React Query`. Right now all results are being fetched when clicking `More`, when only the new ones should be fetched. This is not an issue on second fetches as there is a cache, but slows down the experience on first load.
- Overall page UI/UX
- Use of `React Query`'s loading status for smoother experiences on slow connections
- Logging/analytics
- Alerts
- Development/production environments (separate code branches, deployed sites)
- Tests
  - More unit tests to components
- Deployment
