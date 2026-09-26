import { expect, test, type Locator, type Page } from "@playwright/test";

function column(page: Page, name: string): Locator {
  return page.getByRole("region", { name, exact: true });
}

function cardTitles(columnLocator: Locator): Locator {
  return columnLocator.getByTestId("task-card").locator("h3");
}

async function dragCard(page: Page, source: Locator, target: Locator): Promise<void> {
  await source.scrollIntoViewIfNeeded();
  const from = (await source.boundingBox())!;
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2 + 10, { steps: 5 });
  const to = (await target.boundingBox())!;
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 20 });
  await page.mouse.up();
}

test.describe("Kanban board", () => {
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

  test("displays five columns with sample cards", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1, name: "Project Board" })).toBeVisible();
    await expect(page.getByTestId("kanban-column")).toHaveCount(5);
    for (const name of ["Backlog", "To Do", "In Progress", "Review", "Done"]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeAttached();
    }
    await expect(page.getByTestId("task-card")).toHaveCount(10);
    const backlog = column(page, "Backlog");
    await expect(backlog.getByText("Draft Q4 roadmap")).toBeVisible();
    await expect(
      backlog.getByText("Outline the key themes and milestones for the next quarter.")
    ).toBeVisible();
  });

  test("renames a column and rejects an empty name", async ({ page }) => {
    await page.getByRole("button", { name: "Rename column: To Do" }).click();
    const input = page.getByLabel("Column name");
    await input.fill("   ");
    await input.press("Enter");
    await expect(column(page, "To Do").getByRole("alert")).toHaveText("Column name cannot be empty.");

    await input.fill("Up Next");
    await input.press("Enter");
    await expect(page.getByRole("heading", { level: 2, name: "Up Next" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "To Do" })).toHaveCount(0);
  });

  test("cancels a rename with Escape", async ({ page }) => {
    await page.getByRole("button", { name: "Rename column: Review" }).click();
    await page.getByLabel("Column name").fill("Something else");
    await page.getByLabel("Column name").press("Escape");
    await expect(page.getByRole("heading", { level: 2, name: "Review" })).toBeVisible();
    await expect(page.getByLabel("Column name")).toHaveCount(0);
  });

  test("adds a card with title and details", async ({ page }) => {
    const review = column(page, "Review");
    await review.getByRole("button", { name: "Add card to Review" }).click();
    const dialog = page.getByRole("dialog", { name: "Add card" });
    await expect(dialog).toBeVisible();
    await dialog.getByLabel("Title").fill("Security audit");
    await dialog.getByLabel("Details").fill("Check dependencies for known issues.");
    await dialog.getByRole("button", { name: "Add card" }).click();

    await expect(dialog).toBeHidden();
    await expect(cardTitles(review)).toHaveText(["Review checkout flow", "Security audit"]);
    await expect(review.getByText("Check dependencies for known issues.")).toBeVisible();
  });

  test("rejects a card without a title", async ({ page }) => {
    await column(page, "Done").getByRole("button", { name: "Add card to Done" }).click();
    const dialog = page.getByRole("dialog", { name: "Add card" });
    await dialog.getByLabel("Details").fill("Details without a title");
    await dialog.getByRole("button", { name: "Add card" }).click();
    await expect(dialog.getByRole("alert")).toHaveText("Please enter a card title.");
    await expect(dialog).toBeVisible();

    await dialog.getByLabel("Title").fill("   ");
    await dialog.getByRole("button", { name: "Add card" }).click();
    await expect(dialog.getByRole("alert")).toBeVisible();
    await expect(page.getByTestId("task-card")).toHaveCount(10);
  });

  test("closes the add card dialog with Escape without adding", async ({ page }) => {
    await column(page, "Done").getByRole("button", { name: "Add card to Done" }).click();
    const dialog = page.getByRole("dialog", { name: "Add card" });
    await dialog.getByLabel("Title").fill("Discarded");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByText("Discarded")).toHaveCount(0);
  });

  test("edits the title and details of a card", async ({ page }) => {
    const todo = column(page, "To Do");
    await todo.getByRole("button", { name: "Edit card: Design settings page" }).click();
    const dialog = page.getByRole("dialog", { name: "Edit card" });
    await expect(dialog.getByLabel("Title")).toHaveValue("Design settings page");
    await expect(dialog.getByLabel("Details")).toHaveValue(
      "Create wireframes for account and notification settings."
    );

    await dialog.getByLabel("Title").fill("Design account page");
    await dialog.getByLabel("Details").fill("Include profile photo upload.");
    await dialog.getByRole("button", { name: "Save changes" }).click();

    await expect(dialog).toBeHidden();
    await expect(cardTitles(todo)).toHaveText(["Design account page", "Set up error monitoring"]);
    await expect(todo.getByText("Include profile photo upload.")).toBeVisible();
    await expect(page.getByText("Design settings page")).toHaveCount(0);
  });

  test("rejects an empty title when editing and keeps the original on cancel", async ({ page }) => {
    const done = column(page, "Done");
    await done.getByRole("button", { name: "Edit card: Launch marketing site" }).click();
    const dialog = page.getByRole("dialog", { name: "Edit card" });
    await dialog.getByLabel("Title").fill("  ");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(dialog.getByRole("alert")).toHaveText("Please enter a card title.");

    await dialog.getByRole("button", { name: "Cancel" }).click();
    await expect(dialog).toBeHidden();
    await expect(cardTitles(done).first()).toHaveText("Launch marketing site");
  });

  test("deletes a card", async ({ page }) => {
    const todo = column(page, "To Do");
    await todo.getByRole("button", { name: "Delete card: Design settings page" }).click();
    await expect(cardTitles(todo)).toHaveText(["Set up error monitoring"]);
    await expect(page.getByTestId("task-card")).toHaveCount(9);
  });

  test("shows an empty state when a column has no cards", async ({ page }) => {
    const review = column(page, "Review");
    await review.getByRole("button", { name: "Delete card: Review checkout flow" }).click();
    await expect(review.getByText("No cards yet.")).toBeVisible();
    await expect(review.locator("header")).toContainText("0 cards");
  });

  test("moves a card to another column by dragging", async ({ page, isMobile }) => {
    test.skip(isMobile, "Pointer dragging across the scrolling mobile layout is covered on desktop.");
    const source = page.getByTestId("task-card").filter({ hasText: "Draft Q4 roadmap" });
    await dragCard(page, source, column(page, "Review").getByTestId("task-card").first());

    await expect(cardTitles(column(page, "Backlog"))).toHaveText([
      "Research competitor onboarding",
      "Collect customer feedback",
    ]);
    await expect(cardTitles(column(page, "Review"))).toContainText(["Draft Q4 roadmap"]);
  });

  test("moves a card into an empty column", async ({ page, isMobile }) => {
    test.skip(isMobile, "Pointer dragging across the scrolling mobile layout is covered on desktop.");
    const review = column(page, "Review");
    await review.getByRole("button", { name: "Delete card: Review checkout flow" }).click();
    const source = page.getByTestId("task-card").filter({ hasText: "Build pricing page" });
    await dragCard(page, source, review.getByText("No cards yet."));
    await expect(cardTitles(review)).toHaveText(["Build pricing page"]);
  });

  test("reorders cards within a column by dragging", async ({ page, isMobile }) => {
    test.skip(isMobile, "Pointer dragging across the scrolling mobile layout is covered on desktop.");
    const backlog = column(page, "Backlog");
    const source = backlog.getByTestId("task-card").filter({ hasText: "Research competitor onboarding" });
    await dragCard(page, source, backlog.getByTestId("task-card").last());
    await expect(cardTitles(backlog)).toHaveText([
      "Draft Q4 roadmap",
      "Collect customer feedback",
      "Research competitor onboarding",
    ]);
  });

  test("moves a card with the keyboard", async ({ page }) => {
    await page.getByRole("button", { name: "Move card: Write release notes" }).focus();
    const liveRegion = page.locator("[id^=DndLiveRegion]");
    await page.keyboard.press("Space");
    await expect(liveRegion).toContainText("Write release notes is over In Progress");
    await page.keyboard.press("ArrowRight");
    await expect(liveRegion).toContainText("Write release notes is over Review");
    await page.keyboard.press("Space");
    await expect(cardTitles(column(page, "Review"))).toContainText(["Write release notes"]);
    await expect(cardTitles(column(page, "In Progress"))).toHaveText(["Build pricing page"]);
  });

  test("has no horizontal page overflow", async ({ page }) => {
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(page.getByTestId("kanban-column").first()).toBeInViewport();
  });
});
