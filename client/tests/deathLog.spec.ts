import { test, expect } from "@playwright/test";
import Tester from "./Tester";
import { CONSTANTS } from "../shared/constants";

test.beforeEach("Guest setup", async ({ page }) => {
	await test.step("Start page check -> DL", async () => {
		await page.goto(CONSTANTS.DOMAIN);
		await expect(page).toHaveTitle("Death Log");
		await expect(
			page.getByRole("heading", {
				name: "Death Log",
			}),
		).toBeVisible();

		await expect(
			page.getByRole("button", {
				name: CONSTANTS.START.GUEST_BTN,
			}),
		).toBeVisible();

		// await expect(async () => {
		// 	await expect(
		// 		page.getByRole("button", {
		// 			name: CONSTANTS.START.GUEST_BTN,
		// 		}),
		// 	).toBeVisible();
		// }).toPass();

		await page
			.getByRole("button", {
				name: CONSTANTS.START.GUEST_BTN,
			})
			.click();
		await expect(page).toHaveURL(`${CONSTANTS.DOMAIN}/log`);
	});
});

test.describe("Overall", () => {
	test("Guest (General)", async ({ page, browserName }) => {
		const addedGame = "Elden Ring";
		const addedProfile = "First Playthrough";
		const addedSubject = "Radahn";

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
			await expect(page.getByText(CONSTANTS.ERROR.URL)).toBeVisible();
			await expect(page.getByText(CONSTANTS.ERROR.HOME)).toBeVisible();
			await page.getByText(CONSTANTS.ERROR.HOME).click();
			await expect(page).toHaveURL(CONSTANTS.DOMAIN);
		});

		await test.step("Going back to game DL -> profile DL -> verify if deleted", async () => {
			await page
				.getByRole("button", {
					name: CONSTANTS.START.GUEST_BTN,
				})
				.click();
			await expect(page.getByText(addedGame)).toBeVisible();
			await Tester.goToCardFolder(page, addedGame);
			await expect(page.getByText(addedProfile)).toBeHidden();
			await page.goBack();
		});

		await test.step("Update name", async () => {
			await Tester.goToCardEditModal(page, addedGame);

			await page.getByLabel(CONSTANTS.DEATH_LOG_MODAL.EDIT_NAME).clear();
			await page
				.getByLabel(CONSTANTS.DEATH_LOG_MODAL.EDIT_NAME)
				.fill("Dark Souls");

			await page.getByText(CONSTANTS.DEATH_LOG_MODAL.SUBMIT).click();
			await Tester.checkCardVisibility(page, "Dark Souls", true);
		});
	});

	test("Account (General)", async ({ page, browserName }) => {});

	test("Breadcrumb", async ({ page, browserName }) => {});

	test("Nav bar", async ({ page }) => {});

	test("Death Log FAB", async ({ page }) => {});

	test("Counter", async ({ page }) => {});

	test("Complete", async ({ page }) => {});

	test("Profile Group Edit", async ({ page }) => {});
});

test.describe("Modal Editing", () => {
	const addedGame = "Elden Ring";
	const newGameTitle = "Dark Souls";

	test.beforeEach("Setup modal edit", async ({ page }) => {
		await Tester.addEntry(page, addedGame);
		await Tester.goToCardEditModal(page, addedGame);
	});

	test("Name", async ({ page }) => {
		await test.step("Empty Strings -> Disabled submit", async () => {
			const modalEditInputLoc = page.getByLabel(
				CONSTANTS.DEATH_LOG_MODAL.EDIT_NAME,
			);
			const submitLoc = page.getByText(CONSTANTS.DEATH_LOG_MODAL.SUBMIT);

			await expect(modalEditInputLoc).toHaveValue(addedGame);

			await modalEditInputLoc.clear();

			await expect(modalEditInputLoc).toHaveValue("");

			await expect(
				page.getByText(CONSTANTS.INPUT_TEXT_ERROR.EMPTY),
			).toBeVisible();

			await expect(submitLoc).toBeDisabled();

			await modalEditInputLoc.fill(addedGame);

			await expect(submitLoc).toBeDisabled();

			await expect(
				page.getByText(CONSTANTS.INPUT_TEXT_ERROR.EMPTY),
			).toBeHidden();

			await modalEditInputLoc.clear();

			await modalEditInputLoc.fill(newGameTitle);

			await expect(submitLoc).toBeEnabled();

			await submitLoc.click();
			await Tester.checkCardVisibility(page, newGameTitle, true);
		});

		await test.step("Cover all input text errors -> disabled submit", async () => {
			const modalEditInputLoc = page
				.getByLabel(CONSTANTS.DEATH_LOG_MODAL.EDIT_NAME)
				.filter({ visible: true });
			const submitLoc = page
				.getByText(CONSTANTS.DEATH_LOG_MODAL.SUBMIT)
				.filter({ visible: true });
			const modalEditCloseLoc = page
				.getByText(CONSTANTS.DEATH_LOG_MODAL.CLOSE)
				.filter({ visible: true });

			await Tester.goToCardEditModal(page, newGameTitle);

			await expect(modalEditInputLoc).toHaveValue(newGameTitle);

			await modalEditInputLoc.clear();

			await modalEditInputLoc.fill("...");

			await expect(
				page.getByText(CONSTANTS.INPUT_TEXT_ERROR.ELP),
			).toBeVisible();
			await expect(submitLoc).toBeDisabled();

			modalEditCloseLoc.click();

			await Tester.addEntry(page, addedGame);
			await Tester.goToCardEditModal(page, addedGame);
			await modalEditInputLoc.clear();
			await modalEditInputLoc.fill(newGameTitle);
			await expect(
				page.getByText(CONSTANTS.INPUT_TEXT_ERROR.NON_UNIQUE),
			).toBeVisible();
			await expect(submitLoc).toBeDisabled();
		});
	});

	test("Date Related", async ({ page }) => {});

	test("Notes", async ({ page }) => {});

	test("Delete", async ({ page }) => {});

	test("Subject", async ({ page }) => {});

	test("All", async ({ page }) => {});
});

test("Data Management", async ({ page }) => {});
