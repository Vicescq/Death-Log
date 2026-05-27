import { expect, Page, test } from "@playwright/test";
import { CONSTANTS } from "../../shared/constants";
import { Subject } from "../../src/model/tree-node-model/SubjectSchema";
import { Filters, SortSettings } from "../../src/pages/death-log/formSchemas";

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

	async filter(wantedFilterPrefs: Filters) {
		await this.page
			.getByRole("button", {
				name: CONSTANTS.TOOLBAR.FILTER_BTN_ARIA,
			})
			.click();
		for (let key in wantedFilterPrefs) {
			const filterKey = key as keyof Filters;
			if (
				typeof wantedFilterPrefs[filterKey] == "boolean" &&
				wantedFilterPrefs[filterKey] !=
					(await this.page
						.getByRole("textbox", { name: filterKey })
						.isChecked())
			) {
				await this.page
					.getByRole("textbox", { name: filterKey })
					.setChecked(wantedFilterPrefs[filterKey]);
			} else if (
				typeof wantedFilterPrefs[filterKey] == "string" &&
				wantedFilterPrefs[filterKey] !=
					(await this.page
						.getByRole("textbox", { name: filterKey })
						.textContent())
			) {
				await this.page
					.getByRole("textbox", { name: filterKey })
					.fill(wantedFilterPrefs[filterKey]);
			} else {
				// should not happen, dev error if happens
				test.fail();
			}
		}

		await this.page.getByRole("button", { name: "Confirm" }).click();
	}

	async resetFilters() {
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
