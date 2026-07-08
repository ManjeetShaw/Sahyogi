# Sahyogi Architecture

## Overview

Sahyogi is a MERN-stack (MongoDB, Express, React, Node) application with
three main pillars:

1. **Government services directory** — a searchable list of services
   (documents, permits, welfare schemes, utilities) with plain-language
   descriptions, eligibility rules, required documents, fees, and common
   rejection reasons. Citizens can bookmark ("save") services for later.
2. **Public issue reporting** — citizens file issues (potholes, garbage,
   streetlights, water supply, etc.) with a category, location, and photo
   reference; issues carry a status (`submitted` -> `in_review` ->
   `in_progress` -> `resolved`) that only staff/admin accounts can advance.
3. **AI companion** — a chat interface backed by the Claude API that answers
   questions in plain language, referencing the platform's own services data
   as context, and can help a citizen decide which service or report type
   they need before they file it. The same AI infrastructure also powers:
   - a **scheme/service finder** that matches a free-text description of a
     citizen's situation against the services catalog and explains why each
     match is relevant;
   - a **notice simplifier** that turns pasted official notice text into a
     plain-language summary of what it means and what action is required.
4. **Dashboard** — a single view of a citizen's own reported issues, saved
   services, and recent AI companion conversations, composed client-side
   from the existing REST endpoints (no separate aggregation endpoint).

## High-level diagram

```
+------------+     HTTPS      +--------------+      Mongoose      +----------+
|  React SPA | -------------> | Express API  | ------------------>| MongoDB  |
|  (client)  | <------------- |  (server)    | <------------------|          |
+------------+     JSON       +------+-------+                    +----------+
                                      |
                                      | server-side call (API key never
                                      | leaves the server)
                                      v
                              +---------------+
                              |  Claude API   |
                              +---------------+
```

## Folder responsibilities

- `frontend/` — Vite + React SPA. Talks only to `backend`'s REST API.
- `backend/` — Express REST API. Owns all business logic, auth, and the only
  code that holds the Anthropic API key.
- `docs/` — architecture notes, API reference.

## Auth

JWT-based. Token issued on login/register, sent as `Authorization: Bearer`
header, verified by `backend/src/middleware/auth.js`. Roles: `citizen`,
`staff`, `admin` — role gates issue-status updates and service management.

## Why the AI key stays server-side

The AI companion route (`POST /api/ai/chat`) is the only place that calls the
Claude API. This keeps the API key out of the browser bundle entirely and
lets the server enforce rate limits and log misuse.
