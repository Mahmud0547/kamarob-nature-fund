# Contributing

## Conventions
- TypeScript strict, ESLint clean, Conventional Commits.
- Code and docs in English. Visible text lives in `messages/{en,ru,tj}.json` with identical keys (a unit test checks this).
- Never add statistics, partners or people that do not exist. Sample content must be marked `is_sample`.
- Authorisation belongs in SQL policies, not only in the UI. Add a case to `tests/rls/rls.test.ts` for every new rule.
- Next.js 16 calls middleware `proxy.ts`; read `node_modules/next/dist/docs/` before using an unfamiliar API.

## Common changes
- **New text:** add the key to all three message files.
- **New table:** new migration in `supabase/migrations/`, enable RLS, write policies, update `lib/supabase/types.ts`
  (`npx supabase gen types typescript --project-id <ref>`), add RLS tests, then `npx supabase db push`.
- **New page:** `app/[locale]/(site)/…/page.tsx` for public pages, `account/` for members, `admin/` for staff
  (call `requireMember` / `requireStaff`).
- **New photos:** put originals in `assets-src/`, run `node scripts/media.mjs`.

## Release
`npm run lint && npm run typecheck && npm test`, then `npx supabase db push`, `npm run deploy`, and
`BASE_URL=https://kamarob.simorgh-dev.workers.dev npm run test:e2e`.
