import { expect, type Page } from "@playwright/test";

export async function signIn(page: Page): Promise<void> {
  await page.getByLabel("Email").fill("demo@kanban.dev");
  await page.getByLabel("Password").fill("kanban123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Project Board" })).toBeVisible();
}
