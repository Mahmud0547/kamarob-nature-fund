import { Inter, Lora } from "next/font/google";

// Both cover Tajik letters (ғ ӣ қ ӯ ҳ ҷ) through the cyrillic-ext subset.
export const inter = Inter({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-inter", display: "swap" });
export const lora = Lora({ subsets: ["latin", "cyrillic", "cyrillic-ext"], variable: "--font-lora", display: "swap", weight: ["400", "500", "600"] });
