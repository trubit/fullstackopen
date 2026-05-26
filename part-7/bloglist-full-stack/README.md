# BlogList Monorepo

This repository now contains both frontend and backend code for the BlogList application.

## Structure

- `src/` contains the React + Vite frontend.
- `server/` contains the Node + Express + MongoDB backend API.
- Frontend and backend have separate `package.json` files.

## Frontend development

Run in repository root:

```bash
npm install
npm run dev
```

The Vite development server runs with hot reload and proxies `/api/*` to `http://localhost:3003`.

## Backend development

Run in `server/`:

```bash
npm install
npm run dev
```

Create `server/.env` and set:

- `MONGODB_URI`
- `SECRET`
- `PORT` (optional, default is `3003`)

Development workflow (two terminals):

- Terminal 1 (backend): `cd server && npm run dev`
- Terminal 2 (frontend): `npm run dev`

## Production workflow

Run in `server/`:

```bash
npm run build && npm start
```

`npm run build` builds the frontend (`../dist`), and `npm start` launches the backend that serves both:

- API routes under `/api/*`
- Built frontend static files from `../dist`
