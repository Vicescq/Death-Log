import { test, expect } from "@playwright/test";
import * as Tester from "./utils";

test.describe("General Usage", () => {
    test("Simple CRUD as Guest", async ({ page }) => {
        await page.goto("http://localhost:5173/")
        await expect(page).toHaveTitle("Death Log");
        await expect(page.getByRole("heading", {
            name: "Death Log"
        })).toBeVisible();
        await expect(page.getByRole("button", {
            name: "Continue as guest"
        })).toBeVisible();
        await page.getByRole("button", {
            name: "Continue as guest"
        }).click();
        await expect(page).toHaveURL("http://localhost:5173/log");

        const addedGame = "Elden Ring";
        await Tester.addEntry(page, addedGame);
        await Tester.goToCardFolder(page, addedGame);

        const addedProfile = "First Playthrough";
        await Tester.addEntry(page, addedProfile);
        await Tester.goToCardFolder(page, addedProfile);

        const addedSubject = "Radahn";
        await Tester.addEntry(page, addedSubject);
        await Tester.goToCardFolder(page, addedSubject);

        await page.goBack();
        await expect(page.getByText(addedSubject)).toBeVisible();
        await page.reload();
        await expect(page.getByText(addedSubject)).toBeVisible();
        await page.goBack();
        await expect(page.getByText(addedProfile)).toBeVisible();
        await page.goBack();
        await expect(page.getByText(addedGame)).toBeVisible();
        await page.goForward();
        await Tester.goToCardEditModal(page, addedProfile);
    })
})



