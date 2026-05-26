# BlogList Monorepo (Exercise 7.7)

This repository now contains both frontend and backend in the same repo, with separate package files.

## Project structure

- `src/` frontend (React + Vite)
- `server/` backend (Node + Express + MongoDB)
- root `package.json` for frontend
- `server/package.json` for backend

## Frontend development

Run in repository root:

```bash
npm install
npm run dev
```

The Vite server keeps hot reload and proxies `/api` to `http://localhost:3003`.

## Backend development

Run in `server/`:

```bash
npm install
npm run dev
```

Create `server/.env` from `server/.env.example` and set:

- `MONGODB_URI`
- `SECRET`
- optional `PORT` (default `3003`)

## Production workflow

Run in `server/`:

```bash
npm run build && npm start
```

- `npm run build` in `server/` builds the frontend into `../dist`
- `npm start` runs the backend and serves:
  - API routes under `/api/*`
  - built frontend from `../dist`
