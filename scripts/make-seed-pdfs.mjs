// Generates the two sample PDFs used by scripts/seed.mjs. Run once: node scripts/make-seed-pdfs.mjs
import { chromium } from "@playwright/test";

const style = "body{font-family:Georgia,serif;margin:56px;color:#1b1f1a;line-height:1.5}h1{color:#1f3b2d}p.s{color:#9a4521;font-family:sans-serif;font-size:12px}";
const pages = {
  "editor-guide.pdf": `<h1>Kamarob platform — guide for editors</h1><p class="s">Sample document of the Kamarob demo platform by SimorghDev.</p>
    <h2>Publish news</h2><ol><li>Admin → News → New post.</li><li>Write the title in English (required) and, if you can, in Russian and Tajik.</li><li>Choose who can see it: everyone or members only.</li><li>Set the status to Published and save.</li></ol>
    <h2>Upload a document</h2><ol><li>Admin → Documents.</li><li>Choose a PDF, Word, Excel or image file up to 20 MB.</li><li>Members-only documents are downloaded through links that expire after 60 seconds.</li></ol>`,
  "report-template.pdf": `<h1>Annual report — template</h1><p class="s">Sample document. It contains structure only, no real figures.</p>
    <h2>1. About the organisation</h2><p>Mission, region, team.</p><h2>2. What we did this year</h2><p>Programmes and results that can be verified.</p>
    <h2>3. Finances</h2><p>Income and expenses, with sources.</p><h2>4. Plans for next year</h2><p>Goals and how progress will be measured.</p>`,
};
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [file, html] of Object.entries(pages)) {
  await page.setContent(`<style>${style}</style>${html}`);
  await page.pdf({ path: `scripts/seed-files/${file}`, format: "A4" });
}
await browser.close();
console.log("pdfs written");
