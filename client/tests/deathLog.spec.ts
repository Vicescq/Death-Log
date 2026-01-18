import { test, expect } from "@playwright/test";
import Tester from "./Tester";
import { CONSTANTS } from "../constants";

test.describe("General Usage", () => {
	test("Simple CRUD as Guest", async ({ page, browserName }) => {
		const addedGame = "Elden Ring";
		const addedProfile = "First Playthrough";
		const addedSubject = "Radahn";

		await test.step("Start page check", async () => {
			await page.goto(CONSTANTS.DOMAIN);
			await expect(page).toHaveTitle("Death Log");
			await expect(
				page.getByRole("heading", {
					name: "Death Log",
				}),
			).toBeVisible();
			await expect(
				page.getByRole("button", {
					name: "Continue as guest",
				}),
			).toBeVisible();
			await page
				.getByRole("button", {
					name: "Continue as guest",
				})
				.click();
			await expect(page).toHaveURL(`${CONSTANTS.DOMAIN}/log`);
		});

		await test.step("Adding Entries (Full tree depth)", async () => {
			await Tester.addEntry(page, addedGame);
			await Tester.goToCardFolder(page, addedGame);

			await Tester.addEntry(page, addedProfile);
			await Tester.goToCardFolder(page, addedProfile);

			await Tester.addEntry(page, addedSubject);
			await Tester.goToCardFolder(page, addedSubject);
		});

		await test.step("Back/Forward/Reloading, if added entries persisted", async () => {
			await page.goBack();
			await Tester.checkCardVisibility(page, addedSubject, true);
			await page.reload();
			await Tester.checkCardVisibility(page, addedSubject, true);
			await page.goBack();

			if (browserName == "firefox") {
				// firefox + playwright bug: https://github.com/microsoft/playwright/issues/23210 & https://github.com/microsoft/playwright/issues/22640
				await page.goBack();
			}

			await Tester.checkCardVisibility(page, addedProfile, true);
			await page.goBack();
			await Tester.checkCardVisibility(page, addedGame, true);
			await page.goForward();
		});

		await test.step("Deleting entry -> URL not found -> Home", async () => {
			await Tester.deleteEntry(page, addedProfile);
			await page.goForward();
			await expect(page.getByText("URL not found!")).toBeVisible();
			await expect(
				page.getByRole("button", { name: "Go back home button" }),
			).toBeVisible();
			await page
				.getByRole("button", { name: "Go back home button" })
				.click();
			await expect(page).toHaveURL(CONSTANTS.DOMAIN);
		});

		await test.step("Going back to game DL -> profile DL -> verify if deleted", async () => {
			await page
				.getByRole("button", {
					name: "Continue as guest",
				})
				.click();
			await expect(page.getByText(addedGame)).toBeVisible();
			await Tester.goToCardFolder(page, addedGame);
			await expect(page.getByText(addedProfile)).toBeHidden();
			page.goBack();
		});

		await test.step("Update name", async () => {
			await Tester.goToCardEditModal(page, addedGame);

			await page.getByLabel("Edit Name").clear();
			await page.getByLabel("Edit Name").fill("Dark Souls");

			await page.getByText("Save edits").click();
			await Tester.checkCardVisibility(page, "Dark Souls", true);
		});
	});

	test("Modal Edits", async ({ page }) => {});
});
