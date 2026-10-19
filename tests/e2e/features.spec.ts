import { expect, test } from "@playwright/test";

test("site search finds news and programmes, and explains an empty result", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("link", { name: "Search" }).first().click();
  await expect(page).toHaveURL(/\/en\/search$/);
  await page.fill("#q", "spring");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toContainText("results for “spring”");
  await expect(page.getByRole("link", { name: "Notes from the spring above the trail" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Springs and water" })).toBeVisible();
  await expect(page.getByText("Field day plan")).toHaveCount(0); // members-only posts stay hidden from visitors
  await page.goto("/en/search?q=zzzqqq");
  await expect(page.getByRole("status")).toContainText("Nothing found");
});

test("an article shows reading time, share links and related news", async ({ page }) => {
  await page.goto("/en/news/notes-from-the-spring");
  await expect(page.getByText(/\d+ min read/)).toBeVisible();
  const telegram = page.getByRole("link", { name: "Telegram" });
  await expect(telegram).toHaveAttribute("href", /^https:\/\/t\.me\/share\/url\?url=.*notes-from-the-spring/);
  await expect(page.getByRole("heading", { name: "Read also" })).toBeVisible();
});

test("news has an RSS feed with public posts only", async ({ request }) => {
  const response = await request.get("/en/rss.xml");
  expect(response.headers()["content-type"]).toContain("application/rss+xml");
  const xml = await response.text();
  expect(xml).toContain("<title>Notes from the spring above the trail</title>");
  expect(xml).not.toContain("Field day plan");
});

test("the site can be installed on a phone", async ({ request, page }) => {
  const manifest = await (await request.get("/manifest.webmanifest")).json();
  expect(manifest.display).toBe("standalone");
  expect((await request.get(manifest.icons[1].src)).status()).toBe(200);
  await page.goto("/en");
  await expect(page.locator('link[rel="manifest"]')).toHaveCount(1);
  await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute("href", /\/en\/rss\.xml$/);
});

test("admin overview shows new members by week", async ({ page }) => {
  await page.goto("/en/login");
  await page.fill('input[name="email"]', "demo-admin@kamarob.example");
  await page.fill('input[name="password"]', "Kamarob-demo-2026");
  await page.locator("form button").last().click();
  await page.waitForURL(/\/en\/(account|admin)/);
  await page.goto("/en/admin");
  await expect(page.getByRole("heading", { name: "New members by week" })).toBeVisible();
  await expect(page.locator('section[aria-labelledby="signups"] li')).toHaveCount(8);
});
