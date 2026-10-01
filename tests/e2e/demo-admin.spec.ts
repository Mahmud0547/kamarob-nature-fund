import { expect, test } from "@playwright/test";
import { DEMO_ADMIN } from "@/lib/env";

test.describe.configure({ mode: "serial" });

test("demo admin logs in and sees a read-only admin panel", async ({ page, isMobile }) => {
  test.skip(isMobile, "one login flow is enough");
  await page.goto("/en/login?demo=admin");
  await expect(page.getByLabel("Email")).toHaveValue(DEMO_ADMIN.email);
  await page.getByLabel("Password").fill(DEMO_ADMIN.password);
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/en\/account/);
  await page.goto("/en/admin");
  await expect(page.getByRole("note")).toContainText("read-only");
  await expect(page.getByText("Published news")).toBeVisible();
  await page.goto("/en/admin/news");
  await expect(page.getByText("Autumn plan (draft, sample)")).toBeVisible();
  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
  await page.goto("/en/admin/messages");
  await expect(page.getByText("Sample visitor")).toBeVisible();
  await expect(page.getByText("E2E test")).toHaveCount(0); // real inbox messages stay private
  await page.goto("/en/account/chat");
  await expect(page.getByText("Welcome to the team chat!")).toBeVisible();
  await expect(page.getByText("The demo administrator can read the chat but cannot write.")).toBeVisible();
  await page.goto("/en/account/documents");
  await expect(page.getByText("Annual report template (sample)")).toBeVisible();
});
