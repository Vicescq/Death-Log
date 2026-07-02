import { test as base, expect } from "@playwright/test";
import { CONSTANTS } from "../shared/constants";
import StartPageObject from "./page-object-models/StartPageObject";

type MyFixtures = {
	guestSetup: void;
};

export const test = base.extend<MyFixtures>({
	guestSetup: async ({ page }, use) => {
		await page.goto("/");
		await expect(page).toHaveTitle("Death Log");
		await expect(
			page.getByRole("heading", {
				name: "Death Log",
			}),
		).toBeVisible();

		const startPOM = new StartPageObject(page);
		await startPOM.goto(CONSTANTS.START.CONTINUE);
		await use();
	},
});
