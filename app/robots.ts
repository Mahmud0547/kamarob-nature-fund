import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/en/account", "/ru/account", "/tj/account", "/en/admin", "/ru/admin", "/tj/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
