import { expect, Locator, Page, test } from "@playwright/test";
import { CONSTANTS } from "../../shared/constants";
import { Subject } from "../../src/model/tree-node-model/SubjectSchema";
import { Filters, SortSettings } from "../../src/pages/death-log/formSchemas";
import type { DeathLogViewType } from "../../src/pages/death-log/utils";

export default class ToolbarPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async add(
		name: string,
		isSubject: boolean = false,
		ctx?: Subject["context"],
		reocc?: boolean,
	) {
		await this.page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.ADD_BTN_ARIA,
			})
			.click();

		await this.page
			.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_NAME_LABEL)
			.fill(name);

		if (isSubject && ctx != undefined && reocc != undefined) {
			await this.page
				.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_CTX_LABEL)
				.selectOption(ctx);

			reocc
				? await this.page
						.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_REOCC_LABEL)
						.check()
				: await this.page
						.getByLabel(CONSTANTS.TOOLBAR.ADD_MODAL_REOCC_LABEL)
						.uncheck();
		}

		await this.page.getByText(CONSTANTS.TOOLBAR.ADD_MODAL_SUBMIT).click();
	}

	async search(btnIsCondensed: boolean, query: string) {
		if (btnIsCondensed) {
			await this.page
				.getByRole("button", {
					name: CONSTANTS.TOOLBAR.SEARCH_BTN_ARIA,
				})
				.click();

			await this.page
				.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH)
				.fill(query);
			await this.exitSearch();
		} else {
			await this.page
				.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH)
				.fill(query);
		}
	}

	/**
	 * Clicks on X, only happens on lower viewports and should only be invoked in lower viewport context tests
	 */
	async exitSearch() {
		await this.page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.EXIT_SEARCH_ARIA,
			})
			.click();
	}

	async clearSearch() {
		await this.page.getByPlaceholder(CONSTANTS.TOOLBAR.SEARCH_PH).clear();
	}

	async filter(wantedFilterPrefs: Filters, viewType: DeathLogViewType) {
		const dialog = this.page
			.getByRole("dialog")
			.filter({ hasText: "Filter options" });

		await this.page
			.getByRole("button", { name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA })
			.click();

		for (const key in wantedFilterPrefs) {
			const filterKey = key as keyof Filters;
			const value = wantedFilterPrefs[filterKey];
			const locator = dialog.locator(`[name="${filterKey}"]`);

			if (filterKey == "dateFrom" || filterKey == "dateTo") {
				continue;
			}

			if (filterKey == "reoccurring" && viewType != "subject") {
				continue;
			}

			if (typeof value == "boolean") {
				if (value != (await locator.isChecked())) {
					await locator.setChecked(value);
				}
			} else if (typeof value === "string") {
				if (value != (await locator.inputValue())) {
					await locator.fill(value);
				}
			}
		}

		if (wantedFilterPrefs["dateRangeEnabled"]) {
			await dialog
				.locator(`[name="dateFrom"]`)
				.fill(wantedFilterPrefs["dateFrom"]);
			await dialog
				.locator(`[name="dateTo"]`)
				.fill(wantedFilterPrefs["dateTo"]);
		}

		await dialog.getByRole("button", { name: "Confirm" }).click();
	}

	async resetFilters() {
		await this.page
			.getByRole("button", { name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA })
			.click();
		await this.page
			.getByRole("button", { name: "Reset to defaults" })
			.click();
	}

	async sort(wantedSortPrefs: SortSettings) {
		await this.page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.SORT_BTN_ARIA,
			})
			.click();
	}

	async resetSort() {
		await this.page
			.getByRole("button", { name: "Reset to defaults" })
			.click();
	}
}
