# Contributing to Sahyogi

Thanks for your interest in improving Sahyogi! This is a civic-tech project
that helps people access government services, report public issues, and get
help from an AI companion — so contributions that improve clarity, access,
and trust matter a lot here.

## Getting set up

1. Fork the repo and clone your fork.
2. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. Copy the env examples and fill in real values:
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```
4. Start Mongo locally (or via `docker-compose up mongo`).
5. Run both apps:
   ```bash
   npm run dev   # from the repo root, runs frontend + backend together
   ```

## Branching & commits

- Branch from `main`: `feature/short-description` or `fix/short-description`.
- Keep commits focused and use plain-language messages ("Add issue status filter", not "update").

## Pull requests

- Describe what changed and why, and link any related issue.
- Add/update tests where it makes sense.
- Make sure `npm run lint` passes in both `frontend` and `backend`.
- One reviewer approval is required before merging.

## Reporting bugs / requesting features

Open a GitHub issue with steps to reproduce (for bugs) or the problem you're
trying to solve (for features). Please don't include real personal data or
government ID numbers in screenshots or logs.

## Code of conduct

Be respectful, assume good faith, and keep discussion focused on the work.
