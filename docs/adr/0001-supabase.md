# 1. Supabase for auth, database, files and chat

Date: 2026-10-02 · Status: accepted

## Context
The platform needs accounts with email confirmation, a relational database with per-role access, file storage and
real-time chat, built by one developer and free to run for a demo.

## Decision
Use Supabase: Auth, Postgres with Row Level Security, Storage and Realtime from one project.

## Consequences
- Access rules are enforced in the database, so a bug in the UI cannot leak data; RLS is tested (`npm run test:rls`).
- Emails need custom SMTP for real users.
- The free project pauses after a week without traffic; the live demo should be visited or pinged regularly.
