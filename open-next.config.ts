import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Every page is rendered per request (CSP nonces, Supabase session), so no incremental cache is needed.
export default defineCloudflareConfig({});
