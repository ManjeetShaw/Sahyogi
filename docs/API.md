# Sahyogi API Reference

Base URL (dev): `http://localhost:5000/api`

All authenticated routes require `Authorization: Bearer <token>`.

## Auth

| Method | Route             | Body                              | Notes                     |
|--------|-------------------|------------------------------------|---------------------------|
| POST   | `/auth/register`  | `{ name, email, password }`        | Creates a `citizen` user  |
| POST   | `/auth/login`     | `{ email, password }`              | Returns `{ token, user }` |
| GET    | `/auth/me`        | -                                   | Auth required             |

## Issues

| Method | Route              | Body / Query                                      | Access          |
|--------|--------------------|----------------------------------------------------|-----------------|
| GET    | `/issues`          | `?status=&category=&mine=true`                     | Auth required   |
| GET    | `/issues/:id`      | -                                                    | Auth required   |
| POST   | `/issues`          | `{ title, description, category, location, imageUrl }` | Auth required |
| PATCH  | `/issues/:id/status` | `{ status }`                                       | staff/admin only |
| DELETE | `/issues/:id`      | -                                                    | owner or admin  |

## Services

| Method | Route              | Body               | Access        |
|--------|--------------------|---------------------|---------------|
| GET    | `/services`        | `?category=&q=`     | Public        |
| GET    | `/services/:id`    | -                    | Public        |
| POST   | `/services`        | `{ title, description, category, howToApply, eligibility, requiredDocuments[], fees, commonRejectionReasons[], link }` | admin only |
| PUT    | `/services/:id`    | same as above        | admin only    |
| DELETE | `/services/:id`    | -                     | admin only    |

## AI Companion

| Method | Route            | Body                     | Notes                                                        |
|--------|------------------|---------------------------|---------------------------------------------------------------|
| POST   | `/ai/chat`       | `{ message, history }`    | Calls Claude server-side, grounded in services data           |
| GET    | `/ai/history`    | -                          | Returns the caller's last 50 chat exchanges                   |
| POST   | `/ai/recommend`  | `{ situation }`            | Matches a free-text situation against the services catalog    |
| POST   | `/ai/simplify`   | `{ noticeText }`           | Plain-language summary of a pasted government notice          |

Response shapes: `/ai/chat` → `{ reply }`, `/ai/recommend` → `{ recommendations: [{ service, reason }] }`,
`/ai/simplify` → `{ simplified }`.

## Saved services

| Method | Route                  | Notes                                  |
|--------|------------------------|-----------------------------------------|
| GET    | `/services/saved`      | Auth required. Lists the caller's bookmarked services |
| POST   | `/services/:id/save`   | Auth required. Bookmarks a service (idempotent) |
| DELETE | `/services/:id/save`   | Auth required. Removes a bookmark       |
