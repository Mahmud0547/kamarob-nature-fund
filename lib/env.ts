/** Public Supabase settings. The publishable (anon) key is safe in the browser: Row Level Security protects the data. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Shared read-only admin login shown on the site. Its password is public on purpose; RLS forbids every write. */
export const DEMO_ADMIN = { email: "demo-admin@kamarob.example", password: "Kamarob-demo-2026" };
