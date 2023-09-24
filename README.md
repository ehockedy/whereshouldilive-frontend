# Where Should I Live frontned
Frontend code of the Where Should I Live app. A Typescript React app.

## Set up
Files names `.env/dev.env` and `.env/prov.env` should exist, depending in your usage (local dev, or production deployment).

Each one should have the following variables:
```
API_KEY=<Google maps API key>  // Required for use of Google maps on the front end
API_URL=<URL to make backend calls to>
```

## Installation
```
npm install
```

Start dev server:
```
yarn start
```

Build for production
```
yarn build
```

