# Security

Report vulnerabilities privately on Telegram: https://t.me/SimorghDev.

- **Access control in the database:** Row Level Security on every table and storage bucket; roles checked by SQL functions; tested against the live project.
- **Read-only demo admin:** cannot write anything and sees only sample people and messages.
- **Sessions:** Supabase Auth cookies refreshed in `proxy.ts`; the server uses `getUser()`, which verifies the token.
- **Content-Security-Policy** with a fresh nonce per request; `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer and permissions policies.
- **Input:** validated in forms and again by database constraints; post text is rendered by a small Markdown renderer that never outputs raw HTML and drops unsafe links.
- **Files:** members-only documents are served through signed URLs that expire after 60 seconds.
- **Redirects:** only same-site paths are accepted after login and email confirmation.
- **Secrets:** the Supabase service key is used only by the owner's seed script and is never deployed.
