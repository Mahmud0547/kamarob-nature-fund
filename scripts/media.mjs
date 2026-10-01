// Converts the author's original photos (assets-src/*.jpg) into web sizes: public/media/<name>-1600.webp and -800.webp.
// Run after adding photos: node scripts/media.mjs
import { readdirSync } from "node:fs";
import sharp from "sharp";

for (const file of readdirSync("assets-src").filter((f) => f.endsWith(".jpg"))) {
  const name = file.replace(/\.jpg$/, "");
  for (const width of [1600, 800]) {
    await sharp(`assets-src/${file}`).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 78 }).toFile(`public/media/${name}-${width}.webp`);
  }
}
console.log("media written");
