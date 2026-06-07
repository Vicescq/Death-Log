import { expect } from "@playwright/test";
import StartPageObject from "./page-object-models/StartPageObject";
import { CONSTANTS } from "../shared/constants";
import ToolbarPageObject from "./page-object-models/ToolbarPageObject";
import CardPageObject from "./page-object-models/CardPageObject";
import { test } from "./fixtures";
import { defaultFilters } from "../shared/defaults";
import { Filters } from "../src/pages/death-log/formSchemas";
import DeathCounterPageObject from "./page-object-models/DeathCounterPageObject";
import DeathEditorPageObject from "./page-object-models/DeathEditorPageObject";

const addedGame = "Elden Ring";
const addedGame2 = "Silksong";
const addedProfile = "First Playthrough";
const addedSubject = "Radahn";
const addedSubject2 = "Leyndell";

test("Simple Add | Persistence | Completion | Tree Navigation", async ({
	page,
	guestSetup,
}) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);
	const startPOM = new StartPageObject(page);

	await test.step("Adding and persistence check", async () => {
		await toolbarPOM.add(addedGame);

		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame }),
		).toBeVisible();
		await page.goBack();
		await startPOM.goto(CONSTANTS.START.GUEST_BTN);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame }),
		).toBeVisible();
	});

	await test.step("Completion check", async () => {
		await cardPOM.toggleCompletion(addedGame, true);
		await expect(
			page
				.getByRole("listitem")
				.filter({ hasText: addedGame })
				.getByRole("checkbox"),
		).toBeChecked();
		await cardPOM.toggleCompletion(addedGame, true);
		await expect(
			page
				.getByRole("listitem")
				.filter({ hasText: addedGame })
				.getByRole("checkbox"),
		).not.toBeChecked();
	});

	await test.step("Tree navigation + back and forth nav for persistence checks + reocc icon check", async () => {
		// profile
		await cardPOM.enter(addedGame);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame }),
		).toBeHidden();
		await toolbarPOM.add(addedProfile);
		await page.goBack();
		await cardPOM.enter(addedGame);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedProfile }),
		).toBeVisible();

		// subject
		await cardPOM.enter(addedProfile);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedProfile }),
		).toBeHidden();
		await toolbarPOM.add(addedSubject, true, "Generic Enemy", true);

		// check for reocc img
		await expect(page.getByAltText("Reoccurring Entry")).toBeVisible();

		await page.goBack();
		await cardPOM.enter(addedProfile);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedSubject }),
		).toBeVisible();

		// death counter view
		await cardPOM.enter(addedSubject);
		await expect(
			page.getByRole("heading", { name: addedSubject }),
		).toBeVisible();
		await expect(page.getByText("Death Settings")).toBeVisible();
	});
});

test("Full Add functionality", async ({ page, guestSetup }) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);

	await test.step("Empty Val after submit", async () => {
		await toolbarPOM.add(addedGame);
		await page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_BTN_ARIA,
			})
			.click();
		await expect(
			page.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL),
		).toHaveText("");
		await page.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL).fill(" ");
		await expect(page.getByText(CONSTANTS.ERROR.EMPTY)).toBeVisible();
		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_MODAL_SUBMIT,
			}),
		).toBeDisabled();

		await page.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL).fill("");
		await expect(page.getByText(CONSTANTS.ERROR.EMPTY)).toBeVisible();
		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_MODAL_SUBMIT,
			}),
		).toBeDisabled();
	});

	await test.step("Duplicate error check", async () => {
		await page
			.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL)
			.fill(addedGame);
		await expect(page.getByText(CONSTANTS.ERROR.NON_UNIQUE)).toBeVisible();
		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_MODAL_SUBMIT,
			}),
		).toBeDisabled();
	});

	await test.step("Max length error check", async () => {
		const overMaxName =
			"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; // 61 chars
		await page
			.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL)
			.fill(overMaxName);
		await expect(page.getByText(CONSTANTS.ERROR.MAX_LENGTH)).toBeVisible();
		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_MODAL_SUBMIT,
			}),
		).toBeDisabled();
	});

	await test.step("Correct Modal Headers check", async () => {
		await expect(
			page.getByRole("heading", { name: "Add Game" }),
		).toBeVisible();

		await page.getByRole("button", { name: "Cancel" }).click();

		await cardPOM.enter(addedGame);

		await page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_BTN_ARIA,
			})
			.click();
		await expect(
			page.getByRole("heading", { name: "Add Profile" }),
		).toBeVisible();
		await page.getByRole("button", { name: "Cancel" }).click();

		await toolbarPOM.add(addedProfile);
		await cardPOM.enter(addedProfile);

		await page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_BTN_ARIA,
			})
			.click();

		await expect(
			page.getByRole("heading", { name: "Add Subject" }),
		).toBeVisible();

		await page.getByRole("button", { name: "Cancel" }).click();
	});

	await test.step("Subject related Add functionality", async () => {
		await toolbarPOM.add(addedSubject2, true, "Location", true);
		await expect(page.getByAltText("Reoccurring Entry")).toBeVisible();
	});
});

test("Search Function", async ({ page, guestSetup }) => {
	const toolbarPOM = new ToolbarPageObject(page);

	await test.step("Basic searching & CSS Check", async () => {
		await toolbarPOM.add(addedGame);
		await toolbarPOM.add(addedGame2);

		await toolbarPOM.search(
			(await page
				.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH)
				.isVisible())
				? false
				: true,
			addedGame,
		);

		const searchIconLoc = page.getByRole("button", {
			name: CONSTANTS.TOOLBAR.SEARCH_BTN_ARIA,
		});

		if (await searchIconLoc.isVisible()) {
			await expect(searchIconLoc).not.toHaveClass("btn-neutral"); // colour css change test
		}
	});

	await test.step("Different query results - blank and not found", async () => {
		await toolbarPOM.search(
			(await page
				.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH)
				.isVisible())
				? false
				: true,
			"",
		);

		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame }),
		).toBeVisible();
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame2 }),
		).toBeVisible();

		await toolbarPOM.search(
			(await page
				.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH)
				.isVisible())
				? false
				: true,
			"QUERY NOT FOUND",
		);

		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame }),
		).toBeHidden();
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.filter({ hasText: addedGame2 }),
		).toBeHidden();
	});
});

test("Filter", async ({ page, guestSetup, browserName }) => {
	if (browserName === "webkit") test.setTimeout(125_000); // webkit is particularly very slow in this test

	const toolbarPOM = new ToolbarPageObject(page);
	const cardPOM = new CardPageObject(page);
	const counterPOM = new DeathCounterPageObject(page);
	const editorPOM = new DeathEditorPageObject(page);
	let changedFilters: Filters = {
		...defaultFilters,
	};
	const dialog = page
		.getByRole("dialog")
		.filter({ hasText: "Filter options" });

	await page.clock.setFixedTime("2020-01-01T00:00:00");
	await toolbarPOM.add(addedGame);

	await page.clock.setFixedTime("2020-02-01T00:00:00");
	await toolbarPOM.add(addedGame2);

	await test.step("Completion Filter", async () => {
		await cardPOM.toggleCompletion(addedGame, true);

		changedFilters = {
			...defaultFilters,
			uncompleted: false,
		};
		await toolbarPOM.filter(changedFilters, "game");
		await expect(cardPOM.selectCard(addedGame2)).toBeHidden();
		await expect(cardPOM.selectCard(addedGame)).toBeVisible();

		// filter btn col change
		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA,
			}),
		).not.toHaveClass("btn-neutral");

		changedFilters = {
			...defaultFilters,
			completed: false,
		};
		await toolbarPOM.filter(changedFilters, "game");
		await expect(cardPOM.selectCard(addedGame2)).toBeVisible();
		await expect(cardPOM.selectCard(addedGame)).toBeHidden();
	});

	await test.step("Resetting filters", async () => {
		await toolbarPOM.resetFilters();
		await expect(cardPOM.selectCard(addedGame)).toBeVisible();
		await expect(cardPOM.selectCard(addedGame2)).toBeVisible();

		await expect(
			page.getByRole("button", {
				name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA,
			}),
		).toContainClass("btn-neutral");
	});

	await test.step("Az Filter", async () => {
		changedFilters = {
			...defaultFilters,
			azRange: "S-Z",
		};
		await toolbarPOM.filter(changedFilters, "game");
		await expect(cardPOM.selectCard(addedGame2)).toBeVisible();
		await expect(cardPOM.selectCard(addedGame)).toBeHidden();

		await toolbarPOM.resetFilters();

		changedFilters = {
			...defaultFilters,
			azRange: "E-e",
		};
		await toolbarPOM.filter(changedFilters, "game");
		await expect(cardPOM.selectCard(addedGame2)).toBeHidden();
		await expect(cardPOM.selectCard(addedGame)).toBeVisible();

		await page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA,
			})
			.click();

		await dialog.locator(`[name="azRange"]`).fill("abc");
		await expect(
			dialog.getByText(CONSTANTS.ERROR.GEN_FORMAT),
		).toBeVisible();

		await expect(
			dialog.getByRole("button", { name: "Confirm" }),
		).toBeDisabled();
		await dialog.getByRole("button", { name: "Cancel" }).click();
		await toolbarPOM.resetFilters();
	});

	await test.step("Date Range Filter", async () => {
		await cardPOM.toggleCompletion(addedGame, true); // in order to sort via start date instead

		// under the hood the timestamps for the node is set correctly via setFixedTime call at the top of a test.
		// however, the timestamp helper functions in defaults.ts gets init BEFORE the mocked clock call, and as such stays in the defaultFilters obj and have to be changed
		changedFilters = {
			...defaultFilters,
			dateRangeEnabled: true,
			dateFrom: "2020-01-01",
			dateTo: "2020-01-16",
		};
		await toolbarPOM.filter(changedFilters, "game");

		await expect(cardPOM.selectCard(addedGame)).toBeVisible();
		await expect(cardPOM.selectCard(addedGame2)).toBeHidden();
		await toolbarPOM.resetFilters();
	});

	await test.step("Death Range Filter", async () => {
		await cardPOM.enter(addedGame);
		await toolbarPOM.add(addedProfile);
		await cardPOM.enter(addedProfile);
		await toolbarPOM.add(addedSubject);
		await cardPOM.enter(addedSubject);
		for (let i = 0; i < 5; i++) {
			await counterPOM.incDeath(true);
		}
		await page.goBack();
		await toolbarPOM.add(addedSubject2);
		await cardPOM.enter(addedSubject2);
		for (let i = 0; i < 7; i++) {
			await counterPOM.incDeath(true);
		}
		await page.goBack();
		changedFilters = {
			...defaultFilters,
			deathRange: "=5",
		};
		await toolbarPOM.filter(changedFilters, "subject");
		await expect(cardPOM.selectCard(addedSubject)).toBeVisible();
	});

	await test.step("Reliability Flags Filter", async () => {
		await toolbarPOM.resetFilters();

		await test.step("Show only unreliable (both)", async () => {
			await cardPOM.edit(addedSubject);
			await editorPOM.edit({ dateStartRel: false, dateEndRel: false });
			await page.goBack();
			changedFilters = {
				...defaultFilters,
				reliableStart: false,
				reliableEnd: false,
			};
			await toolbarPOM.filter(changedFilters, "subject");
			await expect(cardPOM.selectCard(addedSubject2)).toBeHidden();
		});

		await test.step("Show only reliable (both)", async () => {
			await toolbarPOM.resetFilters();
			changedFilters = {
				...defaultFilters,
				unreliableStart: false,
				unreliableEnd: false,
			};
			await toolbarPOM.filter(changedFilters, "subject");
			await expect(cardPOM.selectCard(addedSubject)).toBeHidden();
		});
	});

	await test.step("Notes Filter", async () => {
		await toolbarPOM.resetFilters();
		await cardPOM.edit(addedSubject);
		await editorPOM.edit({ notes: "test" });
		await page.goBack();
		changedFilters = {
			...defaultFilters,
			notes: false,
		};
		await toolbarPOM.filter(changedFilters, "subject");
		await expect(cardPOM.selectCard(addedSubject)).toBeHidden();
	});
});

test("Sort", async ({ page, guestSetup }) => {
	const cardPOM = new CardPageObject(page);
	const toolbarPOM = new ToolbarPageObject(page);
	const counterPOM = new DeathCounterPageObject(page);
	const editorPOM = new DeathEditorPageObject(page);

	await test.step("Date Sorting Keys", async () => {
		await page.clock.setFixedTime("2020-01-01T00:00:00");
		await toolbarPOM.add(addedGame);
		await page.clock.setFixedTime("2020-02-01T00:00:00");
		await toolbarPOM.add(addedGame2);
		await toolbarPOM.sort({ ascending: true, sortingKey: "created" });
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedGame2);
		await toolbarPOM.resetSort();
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedGame2);
	});

	await test.step("Name Sorting Key", async () => {
		await toolbarPOM.sort({ ascending: true, sortingKey: "name" });
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedGame);
		await toolbarPOM.resetSort();
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedGame);
	});

	await test.step("Death Count Sorting Key", async () => {
		await toolbarPOM.resetSort();
		await cardPOM.enter(addedGame);
		await toolbarPOM.add(addedProfile);
		await cardPOM.enter(addedProfile);
		await toolbarPOM.add(addedSubject);
		await cardPOM.enter(addedSubject);

		for (let i = 0; i < 5; i++) {
			await counterPOM.incDeath(true);
		}

		await page.goBack();
		await page.clock.setFixedTime("2020-02-02T00:00:00"); // to mimic a more recent` entry
		await toolbarPOM.add(addedSubject2);

		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedSubject);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedSubject2);

		await toolbarPOM.sort({ ascending: false, sortingKey: "deaths" });
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedSubject);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedSubject2);

		await toolbarPOM.resetSort();
	});

	await test.step("Time Spent Sorting Key", async () => {
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedSubject);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedSubject2);

		await cardPOM.edit(addedSubject);
		await editorPOM.edit({ timeSpent: "00:10:00" });
		await page.goBack();

		await toolbarPOM.sort({ ascending: false, sortingKey: "timeSpent" });
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="0"]'),
		).toContainText(addedSubject);
		await expect(
			page
				.getByTestId("virtuoso-item-list")
				.locator('[data-item-index="1"]'),
		).toContainText(addedSubject2);
	});
});
