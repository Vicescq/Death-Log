import { expect } from "@playwright/test";
import { test } from "./fixtures";
import CardPageObject from "./page-object-models/CardPageObject";
import ToolbarPageObject from "./page-object-models/ToolbarPageObject";
import DeathCounterPageObject from "./page-object-models/DeathCounterPageObject";
import { CONSTANTS } from "../shared/constants";

const addedGame = "Elden Ring";
const addedProfile = "First Playthrough";
const addedSubject = "Radahn";
const tooLongRemark = "A".repeat(CONSTANTS.NUMS.INPUT_MAX_LESSER + 1);

test.beforeEach("Go to counter view", async ({ page, guestSetup }) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);

	await toolbarPOM.add(addedGame);
	await cardPOM.enter(addedGame);

	await toolbarPOM.add(addedProfile);
	await cardPOM.enter(addedProfile);

	await toolbarPOM.add(addedSubject);
	await cardPOM.enter(addedSubject);
});

test("General Counter functionality", async ({ page }) => {
	const counterPOM = new DeathCounterPageObject(page);

	await test.step("Assert zero deaths", async () => {
		await expect(page.getByText("0")).toBeVisible();
	});

	await test.step("Basic adding and subtracting", async () => {
		await page.clock.pauseAt("2020-01-01T00:00:00");
		await counterPOM.incDeath(true);
		await page.clock.resume();
		await expect(page.getByTestId("death-count")).toHaveText("1");
		await expect(page.getByText("2020-01-01")).toBeVisible();
		await expect(page.getByText("00:00:00")).toBeVisible();

		await counterPOM.undoDeath();
		await expect(page.getByTestId("death-count")).toHaveText("0");

		for (let i = 0; i < 5; i++) {
			await counterPOM.incDeath(true);
		}
		await expect(page.getByTestId("death-count")).toHaveText("5");
	});

	await test.step("Remarks & Reliability checks", async () => {
		await counterPOM.incDeath(false, "Test");
		await expect(page.getByText("Test")).toBeVisible();
		await expect(page.getByText("Unreliable Time")).toBeVisible();

		await page.getByPlaceholder("Died to a bug!").fill(tooLongRemark);
		await expect(page.getByText(CONSTANTS.ERROR.MAX_LENGTH)).toBeVisible();
	});
});

test("Death Editing", async ({ page }) => {
	const counterPOM = new DeathCounterPageObject(page);
	await page.clock.pauseAt("2020-01-01T00:00:00");

	await test.step("Basic editing", async () => {
		await counterPOM.incDeath(true);
		await counterPOM.editDeath(
			"Abc",
			"2019-01-01",
			"10:10:10",
			false,
			"2020-01-01",
		);
		await expect(page.getByText("Abc")).toBeVisible();
		await expect(page.getByText("2019-01-01")).toBeVisible();
		await expect(page.getByText("10:10:10")).toBeVisible();
		await expect(page.getByText("Unreliable Time")).toBeVisible();
	});

	await test.step("Deleting", async () => {
		await counterPOM.delDeath("2019-01-01");
		await expect(page.getByText("2019-01-01")).not.toBeVisible();
		await expect(page.getByText("No Deaths!")).toBeVisible();
	});

	await counterPOM.incDeath(true);
	await page
		.getByRole("listitem")
		.filter({ hasText: "2020-01-01" })
		.getByAltText("Edit Death")
		.click();

	const modalLoc = page.getByRole("dialog");
	const saveBtnLoc = modalLoc.getByText("Save");
	const resetBtnLoc = modalLoc
		.getByRole("button")
		.filter({ hasText: "Reset" });
	const closeBtnLoc = modalLoc.getByText("Cancel");

	await test.step("Editing: Too Long Remark", async () => {
		await modalLoc.getByLabel("Remark").fill(tooLongRemark);
		await expect(
			modalLoc.getByText(CONSTANTS.ERROR.MAX_LENGTH),
		).toBeVisible();
	});

	await test.step("Editing: Timestamp restrictions - future date", async () => {
		await modalLoc.getByLabel("Date").fill("2020-01-02");
		await expect(
			modalLoc.getByText(CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY),
		).toHaveCount(2);
		await expect(
			modalLoc.getByText(CONSTANTS.INFO.TIME_RESET_NOTICE),
		).toBeVisible();
		await expect(saveBtnLoc).toBeDisabled();
	});

	await test.step("Editing: reset check & closing reset", async () => {
		await resetBtnLoc.click();
		await expect(
			modalLoc.getByText(CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY),
		).toHaveCount(0);
		await expect(
			modalLoc.getByText(CONSTANTS.INFO.TIME_RESET_NOTICE),
		).toBeHidden();
		await expect(modalLoc.getByLabel("Remark")).toHaveValue("");
		await expect(modalLoc.getByLabel("Date")).toHaveValue("2020-01-01");
		// await expect(modalLoc.getByLabel("Date")).toHaveValue("00:00:00"); unsure if different environements treat 00:00:00 as literl or as 12:00:00 AM, decided to not include

		await expect(resetBtnLoc).toBeDisabled();
		await counterPOM.toggleRadioLabels(
			page.getByTestId("timestampRelYesEdit"),
			page.getByTestId("timestampRelNoEdit"),
			false,
		);
		await expect(resetBtnLoc).toBeEnabled();
		await closeBtnLoc.click();
		await page
			.getByRole("listitem")
			.filter({ hasText: "2020-01-01" })
			.getByAltText("Edit Death")
			.click();
		await expect(resetBtnLoc).toBeDisabled();
		await expect(modalLoc.getByTestId("timestampRelYesEdit")).toBeChecked();
		await expect(
			modalLoc.getByTestId("timestampRelNoEdit"),
		).not.toBeChecked();
	});

	await test.step("Editing: Invalid timestamp", async () => {
		await modalLoc.getByLabel("Date").clear();
		await expect(modalLoc.getByText(CONSTANTS.ERROR.DATE)).toBeVisible();
		await expect(saveBtnLoc).toBeDisabled();
		await modalLoc.getByLabel("Date").fill("2020-01-01");
		await modalLoc.getByLabel("Time").clear();
		await expect(modalLoc.getByText(CONSTANTS.ERROR.TIME)).toBeVisible();
		await expect(saveBtnLoc).toBeDisabled();
	});
});

// TOO FLAKY
// test.describe(() => {
// 	// decribe with retries=2 due to flaky tests on certain browser envs, where actions are slightly slow
// 	test.describe.configure({ retries: 2 });

// 	test("Time Tracking", async ({ page }) => {
// 		const counterPOM = new DeathCounterPageObject(page);

// 		await test.step("Basic Timer usage", async () => {
// 			await expect(page.getByText("N / A")).toBeVisible();
// 			await page.clock.install({ time: new Date("2020-01-01T23:59:59") });
// 			await counterPOM.startTime();

// 			await page.clock.runFor(5000);
// 			await expect(page.getByText("00:00:05")).toBeVisible();

// 			await page.clock.runFor(10_000);
// 			await expect(page.getByText("00:00:15")).toBeVisible();

// 			await page.clock.runFor(10_000);
// 			await expect(page.getByText("00:00:15")).toBeVisible();

// 			await counterPOM.resetTime();
// 			await expect(page.getByText("N / A")).toBeVisible();
// 		});

// 		await test.step("Timer Stops when navigating away", async () => {
// 			await counterPOM.startTime();
// 			await page.clock.runFor(5000);
// 			await page.goBack();
// 			await page.goForward();
// 			await expect(page.getByText("00:00:05")).toBeVisible();
// 		});
// 	});
// });
