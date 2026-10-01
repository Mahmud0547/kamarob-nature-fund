import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const [path, lang] of [["/en", "en"], ["/ru", "ru"], ["/tj", "tg"]] as const) {
  test(`${path} home renders in its language`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText(/SimorghDev/).first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("the root redirects to a language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|ru|tj)$/);
});

test("news list and an article show sample content honestly", async ({ page }) => {
  await page.goto("/en/news");
  await expect(page.getByRole("heading", { level: 3 }).first()).toBeVisible();
  await expect(page.getByText("Sample").first()).toBeVisible();
  await expect(page.getByText("Field day plan")).toHaveCount(0); // members-only post is hidden from visitors
  await page.getByRole("link", { name: "Notes from the spring above the trail" }).click();
  await expect(page.locator("h1")).toHaveText("Notes from the spring above the trail");
  await expect(page.locator(".prose-body h2")).toHaveText("What an editor can do");
});

test("documents: visitors see only public files", async ({ page }) => {
  await page.goto("/en/documents");
  await expect(page.getByText("Platform guide for editors")).toBeVisible();
  await expect(page.getByText("Annual report template")).toHaveCount(0);
});

test("contact form validates and sends", async ({ page }) => {
  await page.goto("/en/contact");
  await page.getByLabel("Your name").fill("E2E test");
  await page.getByLabel("Email").fill("e2e@example.org");
  await page.getByLabel("Message").fill("Automated end-to-end check of the contact form.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toContainText("Thank you");
});

test("security headers and CSP are present", async ({ page }) => {
  const response = await page.goto("/en");
  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("script-src 'self' 'nonce-");
  expect(headers["x-content-type-options"]).toBe("nosniff");
});

test("member pages require login", async ({ page }) => {
  await page.goto("/en/account");
  await expect(page).toHaveURL(/\/en\/login/);
  await page.goto("/en/admin");
  await expect(page).toHaveURL(/\/en\/login/);
});

for (const path of ["/en", "/ru/news", "/tj/about", "/en/login", "/en/contact"]) {
  test(`no WCAG A/AA violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
  });

  test(`no horizontal scroll at 320px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });
}
