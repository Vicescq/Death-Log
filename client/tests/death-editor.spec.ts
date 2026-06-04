import { expect } from "@playwright/test";
import { test } from "./fixtures";
import CardPageObject from "./page-object-models/CardPageObject";
import DeathEditorPageObject from "./page-object-models/DeathEditorPageObject";
import ToolbarPageObject from "./page-object-models/ToolbarPageObject";
import { CONSTANTS } from "../shared/constants";

const addedGame = "Elden Ring";
const addedGame2 = "Silksong";
const addedProfile = "First Playthrough";
const addedSubject = "Radahn";
const addedSubject2 = "Leyndell";

test.beforeEach("Go to editor view (Game)", async ({ page, guestSetup }) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);

	await toolbarPOM.add(addedGame);
	await cardPOM.edit(addedGame);
});

test("Basic editing", async ({ page }, testInfo) => {
	const editorPOM = new DeathEditorPageObject(page);
	const cardPOM = new CardPageObject(page);

	await expect(editorPOM.heading).toContainText(addedGame);
	await expect(editorPOM.saveButton).toBeDisabled();
	await editorPOM.edit({ name: "Dark Souls", notes: "Test test test" });
	await expect(editorPOM.saveButton).toBeDisabled();
	await expect(editorPOM.heading).toContainText("Dark Souls");
	await page.goBack();
	await expect(cardPOM.selectCard("Dark Souls")).toBeVisible();
});

test("Deletion", async ({ page }, testInfo) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);
	const editorPOM = new DeathEditorPageObject(page);
	const searchIconLoc = page.getByRole("button", {
		name: CONSTANTS.TOOLBAR.SEARCH_BTN_ARIA,
	});
	const isMobile = testInfo.project.use.isMobile;

	async function waitForDeleteUpdate() {
		if (!isMobile) {
			await expect(
				page.getByPlaceholder("Search for title"),
			).toBeVisible();
		} else {
			await expect(searchIconLoc).toBeVisible();
		}
		await expect(page.getByText(addedGame)).toHaveCount(0);
		await page.waitForTimeout(1000);
	}

	await test.step("Basic Deletion", async () => {
		await editorPOM.delete();

		await waitForDeleteUpdate();

		await page.goBack();
		await expect(page.getByText(CONSTANTS.ERROR.URL)).toBeVisible();
	});

	await test.step("Deleting Game node that has full lineage", async () => {
		const urls: string[] = [];

		await page.goBack();
		await toolbarPOM.add(addedGame);
		await cardPOM.enter(addedGame);
		urls.push(page.url());

		await toolbarPOM.add(addedProfile);
		await cardPOM.enter(addedProfile);
		urls.push(page.url());

		await toolbarPOM.add(addedSubject);
		await page.goBack();
		await page.goBack();

		await cardPOM.edit(addedGame);
		await editorPOM.delete();
		await waitForDeleteUpdate();

		await page.goto(urls[0]);
		await expect(page.getByText(CONSTANTS.ERROR.URL)).toBeVisible();

		await page.goto(urls[1]);
		await expect(page.getByText(CONSTANTS.ERROR.URL)).toBeVisible();
	});
});

test("Error validation", async ({ page }) => {
	const editorPOM = new DeathEditorPageObject(page);
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);
	await page.clock.setFixedTime("2020-01-01T00:00:00");

	await test.step("Invalid name", async () => {
		await editorPOM
			.field("name")
			.fill("AA".repeat(CONSTANTS.NUMS.INPUT_MAX));
		await expect(page.getByText(CONSTANTS.ERROR.MAX_LENGTH)).toBeVisible();
		await expect(editorPOM.saveButton).toBeDisabled();

		await editorPOM.reset();
	});

	await test.step("Invalid notes", async () => {
		await editorPOM
			.field("notes")
			.fill("AA".repeat(CONSTANTS.NUMS.TEXTAREA_MAX));
		await expect(page.getByText(CONSTANTS.ERROR.MAX_LENGTH)).toBeVisible();

		await editorPOM.reset();
	});

	await test.step("Invalid timestamps and other UX rules", async () => {
		await page.goBack();
		await cardPOM.enter(addedGame);
		await toolbarPOM.add(addedProfile);
		await cardPOM.enter(addedProfile);
		await toolbarPOM.add(addedSubject);
		await cardPOM.toggleCompletion(addedSubject, true);
		await cardPOM.edit(addedSubject);

		await test.step("UX test: time reset", async () => {
			await expect(
				page.getByText(CONSTANTS.INFO.TIME_RESET_NOTICE),
			).toBeHidden();
			await editorPOM.field("dateStart").fill("2019-01-01");
			await expect(
				page.getByText(CONSTANTS.INFO.TIME_RESET_NOTICE),
			).toBeVisible();
			await expect(editorPOM.field("dateEnd")).toBeDisabled();
			await expect(editorPOM.field("timeEnd")).toBeDisabled();
			await editorPOM.reset();
			await editorPOM.field("dateEnd").fill("2020-02-01");
			await expect(
				page.getByText(CONSTANTS.INFO.TIME_RESET_NOTICE),
			).toBeVisible();
			await expect(editorPOM.field("dateStart")).toBeDisabled();
			await expect(editorPOM.field("timeStart")).toBeDisabled();
		});

		await test.step("Start and end conflict + Future date", async () => {
			await editorPOM.reset();
			await editorPOM.field("dateStart").fill("2020-02-01");
			await expect(
				page.getByText(CONSTANTS.ERROR.DATETIME_START_SURPASSED_END),
			).toHaveCount(2);
			await editorPOM.reset();
			await editorPOM.field("dateEnd").fill("3000-01-01");
			await expect(
				page.getByText(CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY),
			).toHaveCount(2);
			await editorPOM.reset();
		});
	});

	await test.step("Invalid values for timestamp fields", async () => {
		await editorPOM.field("dateStart").clear();
		await expect(page.getByText(CONSTANTS.ERROR.DATE)).toBeVisible();
		await editorPOM.reset();

		await editorPOM.field("timeStart").clear();
		await expect(page.getByText(CONSTANTS.ERROR.TIME)).toBeVisible();
		await editorPOM.reset();

		await editorPOM.field("dateEnd").clear();
		await expect(page.getByText(CONSTANTS.ERROR.DATE)).toBeVisible();
		await editorPOM.reset();

		await editorPOM.field("timeEnd").clear();
		await expect(page.getByText(CONSTANTS.ERROR.TIME)).toBeVisible();
		await editorPOM.reset();
	});

	await test.step("Time field", async () => {
		await expect(page.getByText(CONSTANTS.INFO.TIMESPENT)).toBeVisible();
		await editorPOM.field("timeSpent").fill("00:30:00");
		await expect(editorPOM.saveButton).toBeEnabled();
		await editorPOM.field("timeSpent").fill("00 :30:00");
		await expect(editorPOM.saveButton).toBeDisabled();
		await editorPOM.edit({ timeSpent: "00:30:00" });
		await editorPOM.field("timeSpent").fill("N / A");
		await expect(editorPOM.saveButton).toBeEnabled();
		await editorPOM.field("timeSpent").fill("N/a");
		await expect(editorPOM.saveButton).toBeDisabled();
		await editorPOM.reset();
	});

	await test.step("Invalid DEL string", async () => {
		await page
			.locator("fieldset")
			.getByPlaceholder("Type DEL to delete")
			.fill("INVALID");

		await expect(
			page
				.locator("fieldset")
				.getByRole("button", { name: "Delete Entry" }),
		).toBeDisabled();
	});
});
