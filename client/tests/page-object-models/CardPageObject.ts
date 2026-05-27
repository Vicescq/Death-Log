import { Page } from "@playwright/test";
import { CONSTANTS } from "../../shared/constants";

export default class CardPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async enter(title: string) {
		await this.page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", {
				name: CONSTANTS.DEATH_LOG_CARD.ENTRY_CHILDREN_ARIA,
			})
			.click();
	}

	async edit(title: string) {
		await this.page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", {
				name: CONSTANTS.DEATH_LOG_CARD.EDIT_MODE_ARIA,
			})
			.click();
	}

	async toggleCompletion(title: string, isConfirming: boolean) {
		await this.page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("checkbox")
			.click();

		if (isConfirming) {
			await this.page
				.getByRole("button", {
					name: CONSTANTS.DEATH_LOG_CARD.COMPLETION_CONFIRM,
				})
				.click();
		} else {
			await this.page
				.getByRole("button", {
					name: CONSTANTS.DEATH_LOG_CARD.COMPLETION_CANCEL,
				})
				.click();
		}
	}
}
