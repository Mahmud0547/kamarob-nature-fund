# Architecture

```
Browser ── Cloudflare Worker (Next.js via OpenNext)
              │  proxy.ts: language redirect, Supabase session refresh, CSP nonce and security headers
              │  server components read data as the logged-in user; server actions write as that user
              ▼
           Supabase
              ├─ Auth      email + password, confirmation and reset links → /auth/confirm
              ├─ Postgres  every table has Row Level Security (supabase/migrations)
              ├─ Storage   "media" (public images) · "documents" (private, signed links for 60 s)
              └─ Realtime  new chat messages pushed to the browser, filtered by the same RLS
```

## Roles

| Role | Granted by | Can |
|---|---|---|
| member | confirmed email (auto-approve setting) or an admin | members-only news and documents, chat |
| editor | admin | + write news and documents |
| admin | owner (SQL) | + members, roles, inbox, channels |
| demo_admin | owner (SQL) | read the admin panel; sees only sample people and messages; every write is refused |

Role checks live in SQL (`my_role()`, `is_member()`, `can_edit()`, `is_admin()`, `is_demo_admin()`); the UI only hides
buttons. Profiles can change only `full_name` and `locale` (column grants); roles change only through `set_member()`.

## Data

`profiles`, `posts` (texts per language in JSONB), `documents`, `contact_messages`, `channels`, `messages`,
`settings`. Sample rows carry `is_sample = true` and are labelled "Sample" in the UI; they are created by
`scripts/seed.mjs` (service key, run by the owner).

## Pages

| Path | Rendering | Access |
|---|---|---|
| `/{en,ru,tj}` and public pages | per request (CSP nonce) | everyone |
| `/{locale}/login`, `/register`, `/reset`, `/new-password` | per request | everyone |
| `/{locale}/account/*` | per request | active members |
| `/{locale}/admin/*` | per request | editors, admins, demo admin |
| `/api/documents/{id}` | route handler | whoever RLS allows; redirects to a 60-second signed URL |
| `/auth/confirm` | route handler | links from emails |

## Email

Supabase Auth sends confirmation and reset emails. The built-in sender only delivers to the project team; for real
users configure custom SMTP (Supabase → Authentication → Emails → SMTP), e.g. Brevo's free tier or Resend with a domain.
