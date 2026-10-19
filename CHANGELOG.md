# Changelog

## [2.1.0] — 2026-10-20
### Added
- Site search across news, documents and programmes (respects who may see what).
- Articles: reading time, share links (Telegram, WhatsApp, Facebook, copy link) and "Read also".
- RSS feed per language at /en/rss.xml, /ru/rss.xml, /tj/rss.xml (public posts only).
- Admin overview: new members by week for the last 8 weeks.
- Installable on a phone: web manifest, app icons, favicon.
### Changed
- Phone menu opens as a full-width panel with large links; search button in the header.

## [2.0.0] — 2026-10-02
### Added
- Rebuilt as a full platform: Next.js 16 + Supabase on Cloudflare Workers.
- Accounts with email confirmation, member area, real-time chat, admin panel (news, documents, members, inbox).
- Read-only demo admin; labelled sample content; English, Russian and Tajik.
- Row Level Security on every table, CSP with nonces, RLS and browser tests.
### Removed
- Invented statistics and organisation history from v1.

## [1.0.0] — 2026-09-17
- Static four-language site with a Supabase contact form.
