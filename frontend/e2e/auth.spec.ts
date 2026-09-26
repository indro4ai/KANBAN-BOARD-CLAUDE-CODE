import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

test.describe("Sign in", () => {
  let consoleErrors: string[];

  test.beforeEach(async ({ page }) => {
    consoleErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));
    await page.goto("/");
  });

  test.afterEach(() => {
    expect(consoleErrors).toEqual([]);
  });

  test("shows the sign in page first with demo credentials", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Sign in to Project Board" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeFocused();
    const demo = page.getByRole("region", { name: "Demo account" });
    await expect(demo).toContainText("demo@kanban.dev");
    await expect(demo).toContainText("kanban123");
    await expect(page.getByTestId("kanban-column")).toHaveCount(0);
  });

  test("requires both fields", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Please enter" })).toHaveText(
      "Please enter your email and password."
    );
  });

  test("rejects incorrect credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("demo@kanban.dev");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Incorrect email or password.")).toBeVisible();
    await expect(page.getByTestId("kanban-column")).toHaveCount(0);
  });

  test("signs in with the demo account and logs out", async ({ page, isMobile }) => {
    await signIn(page);
    await expect(page.getByTestId("kanban-column")).toHaveCount(5);
    if (!isMobile) await expect(page.getByText("Alex Morgan")).toBeVisible();

    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("heading", { name: "Sign in to Project Board" })).toBeVisible();
    await expect(page.getByTestId("kanban-column")).toHaveCount(0);
  });

  test("signs in by pressing Enter", async ({ page }) => {
    await page.getByLabel("Email").fill("demo@kanban.dev");
    await page.getByLabel("Password").fill("kanban123");
    await page.getByLabel("Password").press("Enter");
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
  });
});
