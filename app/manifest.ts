import type { MetadataRoute } from "next";

/** Lets members add Kamarob to the phone's home screen and open it like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Kamarob",
    short_name: "Kamarob",
    description: "A platform for nonprofits: news, documents, member area and team chat.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#1f3b2d",
    theme_color: "#1f3b2d",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
