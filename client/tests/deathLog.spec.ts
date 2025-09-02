import { test, expect } from "@playwright/test";

test.describe("Start Page", () => {
    test("Title", async ({ page }) => {
        await page.goto("http://localhost:5173/")
        await expect(page).toHaveTitle("DeathLog");
        await expect(page.getByRole("heading", {
            name: "DeathLog"
        })).toBeVisible();
    })
})



