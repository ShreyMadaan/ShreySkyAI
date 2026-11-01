# ShreySkyAI

ShreySkyAI is a responsive weather dashboard that combines live weather data with concise, AI-generated recommendations. Users can search for cities, use their current location, review current/hourly/weekly conditions, save favorite cities locally, and create an account with email/password or Google Sign-In.

## Features

- Live weather from [Open-Meteo](https://open-meteo.com/), including:
  - Current temperature, feels-like temperature, condition, daily high/low, and local time
  - A 12-hour forecast with precipitation probability
  - A seven-day forecast
  - Humidity, wind, visibility, pressure, UV index, sunrise, sunset, and precipitation
- City search with geocoding, recent searches, keyboard navigation, and up to five recent cities
- Browser geolocation for current-location weather
- Locally saved favorite cities
- AI weather brief powered by Groq:
  - A headline and city-specific summary
  - Clothing, outdoor plans, hydration, and UV-protection recommendations
- Email/password authentication and Google authentication
- Session-based authentication with MongoDB-backed sessions
- Responsive glassmorphism UI built with React, Tailwind CSS, and Lucide icons
- Loading, error, empty, and abort-safe states for weather, authentication, and AI requests

## Tech stack

### Frontend

- React 19
- Vite 8
- React Router
- Tailwind CSS 4 with `@tailwindcss/vite`
- Recharts
- Lucide React
- Google Identity Services via `@react-oauth/google`

### Backend

- Node.js with Express 5
- MongoDB with Mongoose
- `express-session` with `connect-mongo`
- Groq SDK for AI generation
- Google token verification with `google-auth-library`
- `bcryptjs` for password hashing
- CORS and rate limiting

## Architecture

The repository contains two independently installed Node.js applications:

```text
.
├── src/                         # React/Vite frontend
│   ├── components/              # Layout, weather, and AI UI
│   ├── context/                 # Authentication context
│   ├── hooks/                   # Weather and local favorites state
│   ├── pages/                   # Dashboard and authentication pages
│   ├── services/                # Weather, auth, and AI HTTP clients
│   └── utils/                   # Open-Meteo adapter and weather helpers
├── public/                      # Static assets
├── server/
│   └── src/
│       ├── config/              # MongoDB connection
│       ├── controllers/         # Authentication handlers
│       ├── middleware/          # Authentication middleware
│       ├── models/              # Mongoose models
│       ├── routes/              # Express routes
│       └── utils/               # In-memory AI cache
├── index.html
├── package.json                 # Frontend scripts and dependencies
└── vite.config.js
```

### Request flow

1. The dashboard starts with Delhi and requests forecast data directly from Open-Meteo.
2. `weatherAdapter.js` converts the Open-Meteo response into the view model used by the dashboard components.
3. The AI panel sends the normalized weather data to the backend at `/api/ai/weather-brief`.
4. The backend validates and limits the request, calls Groq, validates the required JSON shape, and returns the brief.
5. Identical AI requests are cached in memory for 15 minutes and concurrent identical requests are deduplicated.
6. Authentication requests use the backend API and an HTTP-only session cookie. Sessions are persisted in MongoDB.

## Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB deployment and connection string
- A Groq API key
- A Google OAuth web client ID if Google Sign-In is enabled

Open-Meteo does not require an API key for the requests used by this project.

## Installation

Install dependencies in both workspaces:

```bash
npm install
cd server
npm install
cd ..
```

## Environment variables

### Frontend: `.env`

Create `.env` in the repository root:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your-google-web-client-id
```

`VITE_API_URL` defaults to `http://localhost:5000/api` when omitted.

### Backend: `server/.env`

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.example.mongodb.net/?retryWrites=true&w=majority
SESSION_SECRET=replace-with-a-long-random-secret
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=openai/gpt-oss-20b
GOOGLE_CLIENT_ID=your-google-web-client-id
FRONTEND_URL=http://localhost:5173
```

The backend requires `MONGODB_URI`, `GROQ_API_KEY`, `SESSION_SECRET`, and `GOOGLE_CLIENT_ID`. In production it also requires `FRONTEND_URL`.

Use the same Google client ID in both `.env` files. Never commit either `.env` file or expose server secrets through `VITE_*` variables.

## Running locally

Start the backend from one terminal:

```bash
cd server
npm run dev
```

Start the frontend from a second terminal at the repository root:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The backend listens on port `5000` by default and exposes a health check at [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Scripts

### Frontend

Run these commands from the repository root:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Backend

Run these commands from `server/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API with Node watch mode |
| `npm start` | Start the API without watch mode |
| `npm test` | Placeholder script; no backend test suite is configured |

## API reference

All application API responses use a `success` boolean and return a `message`, `user`, or `data` field as appropriate.

### Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Returns service, provider, and configured model information |

### Authentication

Authentication endpoints are mounted under `/api/auth`.

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | `{ name, email, password }` | Create a local account and start a session |
| `POST` | `/login` | `{ email, password }` | Sign in with a local account |
| `POST` | `/google` | `{ credential }` | Verify a Google ID token and start a session |
| `GET` | `/me` | - | Return the current authenticated user |
| `POST` | `/logout` | - | Destroy the current session |

The frontend sends credentials with requests so the session cookie is included. Registration requires a name between 2 and 60 characters and a password between 8 and 72 UTF-8 bytes.

### AI weather brief

| Method | Path | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/api/ai/weather-brief` | `{ weather }` | Generate a validated four-part weather brief |

The backend accepts the normalized weather object produced by [weatherAdapter.js](./src/utils/weatherAdapter.js). Successful responses include `data`, `provider`, `model`, and cache metadata. AI requests are limited to 10 per minute per backend process.

## Data and persistence

- Weather and geocoding data are fetched from Open-Meteo and are not stored by the application.
- Recent searches are stored in browser `localStorage` under `shreysky-recent-cities` and limited to five entries.
- Favorite cities are stored in browser `localStorage` under `shreysky-favorite-cities`.
- User records are stored in the `shreyskyai` MongoDB database.
- Sessions are stored in the `sessions` MongoDB collection and expire after seven days.
- The `User` model includes `favoriteCities` and `preferredUnit` fields, but the current frontend uses local storage for favorites and does not synchronize those fields with the API.
- AI response caching is an in-memory cache with a 15-minute TTL and a maximum of 200 entries. It resets when the backend restarts and is not shared across instances.

## Security and operational behavior

- Passwords are hashed with bcrypt; password hashes are never returned in API responses.
- Session cookies are HTTP-only and use secure, cross-site settings in production.
- State-changing requests are checked against the configured frontend origin.
- Authentication endpoints are rate limited to 20 requests per 15 minutes.
- AI requests are rate limited to 10 requests per minute.
- Request bodies are limited to 20 KB.
- Configure `FRONTEND_URL` to the exact deployed frontend origin in production.
- Use HTTPS in production so secure cookies and cross-site session behavior work correctly.

## Troubleshooting

### The backend exits during startup

Check that `server/.env` contains all required variables and that `MONGODB_URI` is reachable. The server validates required configuration before listening.

### Authentication requests fail from the browser

Confirm that:

1. The backend is running on the URL configured by `VITE_API_URL`.
2. `FRONTEND_URL` matches the browser origin in production.
3. `GOOGLE_CLIENT_ID` matches the client ID configured in the Google Cloud console.
4. Cookies are enabled for the browser.

### The AI panel reports an error

Check `GROQ_API_KEY`, the configured `GROQ_MODEL`, the backend logs, and the AI rate limit. The backend rejects responses that do not contain the expected headline, summary, and four ordered insights.

### Weather search or current location does not work

City search requires at least two characters and a network connection to Open-Meteo. Current-location weather requires browser geolocation permission and is subject to the browser's location policy.

## Production build

Build the frontend:

```bash
npm run build
```

Run the backend from `server/`:

```bash
npm start
```

Deploy the frontend and backend as separate services, set the production environment variables, and configure the frontend origin in `FRONTEND_URL`. The current Express server does not serve the Vite `dist/` directory.
