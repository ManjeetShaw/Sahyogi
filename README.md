# CivicAI

CivicAI is a GenAI-powered web platform that helps citizens **access
government services**, **report public issues**, and get **plain-language
help from an AI companion** — grounded in the platform's own services data
instead of invented answers.

## Features

- 🗂️ **Services directory** — searchable, filterable list of government
  services (documents, permits, welfare schemes, utilities, taxes).
- 📍 **Issue reporting** — citizens file reports (roads, sanitation, water,
  electricity, public safety, parks) with a category, location, and photo
  link; each report gets a case number and moves through
  `submitted → in_review → in_progress → resolved`.
- 🤖 **AI companion** — a chat assistant (powered by the Claude API,
  called server-side) that answers using the services actually listed on
  the platform, and points people toward filing a report when that's what
  they need.
- 🔐 **Auth & roles** — JWT auth with `citizen`, `staff`, and `admin` roles;
  only staff/admin can advance an issue's status or manage services.

## Tech stack

- **Client:** React 18 + Vite, React Router, plain CSS design system
- **Server:** Node.js + Express + MongoDB (Mongoose)
- **AI:** Anthropic Claude API (server-side only — the key never reaches
  the browser)
- **Auth:** JWT + bcrypt

## Project structure

```
CivicAI/
├── client/          # React SPA
├── server/          # Express REST API
├── docs/            # Architecture & API docs
├── .github/         # CI workflow
├── docker-compose.yml
└── package.json     # root scripts (runs client + server together)
```

## Getting started

### 1. Prerequisites

- Node.js 20+
- MongoDB running locally, or via `docker-compose up mongo`
- An Anthropic API key (for the AI companion) — get one at
  [console.anthropic.com](https://console.anthropic.com)

### 2. Install

```bash
git clone <this-repo-url>
cd CivicAI
npm run install:all
```

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit `server/.env` and set at minimum:

```
MONGO_URI=mongodb://localhost:27017/civicai
JWT_SECRET=some_long_random_string
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Seed sample government services (optional but recommended)

```bash
npm run seed
```

### 5. Run it

```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:5000/api/health

## Roles

New sign-ups are created as `citizen`. To promote a user to `staff` or
`admin` (so they can update issue statuses or manage the services
directory), update their `role` field directly in MongoDB for now:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

A proper admin UI for role management is a good first contribution — see
`CONTRIBUTING.md`.

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design and why
  the AI key stays server-side
- [`docs/API.md`](docs/API.md) — full REST API reference

## License

MIT — see [LICENSE](LICENSE).
