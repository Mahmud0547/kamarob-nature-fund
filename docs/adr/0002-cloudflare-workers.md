# 2. Cloudflare Workers through OpenNext

Date: 2026-10-02 · Status: accepted

## Context
The site renders per request (Supabase sessions, CSP nonces). The owner's other projects already run on Cloudflare.

## Decision
Deploy the Next.js app to Cloudflare Workers with `@opennextjs/cloudflare`; pre-optimised images, no image service.

## Consequences
- Free hosting close to users, one account for all projects.
- The free plan limits the compressed worker to about 3 MB; heavy dependencies were removed (own small Markdown renderer).
