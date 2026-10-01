# Kamarob — a platform for nonprofits

A complete system a nonprofit in Tajikistan can run on: public website, news and announcements, documents,
member accounts with email confirmation, a member area with real-time chat, and an admin panel.

**Live demo:** https://kamarob.simorgh-dev.workers.dev — the organisation is a demonstration; the photos and videos
are real, taken by the author in the Kamarob Gorge, Rasht District.

Try it: register as a member, or open the admin panel with the shared read-only account shown on the home page.

## Features

| Area | What it does |
|---|---|
| Public site | Home, About, Programmes, News, Documents, Gallery, Contact — English, Russian, Tajik |
| Accounts | Sign-up with email confirmation, log in, password reset, profile and language |
| Member area | Members-only news and documents, team chat with channels in real time |
| Admin panel | Overview numbers, news editor in three languages with cover upload, document upload, member approval and roles, contact inbox |
| Demo admin | A public login that sees the admin panel but cannot change anything, and never sees real visitors' data |

## Stack

Next.js 16 (App Router, server actions) · React 19 · TypeScript · Tailwind CSS 4 · Supabase (Auth, Postgres with Row
Level Security, Storage, Realtime) · Cloudflare Workers via OpenNext · Vitest · Playwright · axe

## Run locally

```bash
npm install
cp .env.example .env.local      # fill in the Supabase URL and anon key
npm run dev                     # http://localhost:3000
```

## Checks

```bash
npm run lint && npm run typecheck && npm test   # unit tests
npm run test:rls                                # access rules against the Supabase project
npm run test:e2e                                # browser tests (BASE_URL=https://… for a deployed site)
```

## Deploy

```bash
npx supabase db push            # database migrations
npm run deploy                  # build with OpenNext and deploy to Cloudflare Workers
```

More in [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/architecture.md](docs/architecture.md).

## License

Code: [MIT](LICENSE). Photos and videos © Mahmud Faiezov, all rights reserved.
