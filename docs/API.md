# CivicAI API Reference

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
| POST   | `/services`        | `{ title, description, category, howToApply, link }` | admin only |
| PUT    | `/services/:id`    | same as above        | admin only    |
| DELETE | `/services/:id`    | -                     | admin only    |

## AI Companion

| Method | Route         | Body               | Notes                                             |
|--------|---------------|---------------------|----------------------------------------------------|
| POST   | `/ai/chat`    | `{ message, history }` | Calls Claude server-side, grounded in services data |

Response: `{ reply: string }`
