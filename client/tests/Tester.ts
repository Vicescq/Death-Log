import { expect, Page } from "@playwright/test";
import { CONSTANTS } from "../shared/constants";

export default class Tester {
	static async addEntry(page: Page, title: string) {
		await page
			.getByRole("button", {
				name: CONSTANTS.DEATH_LOG_FAB.OPEN,
			})
			.click();
		await page
			.getByRole("button", {
				name: CONSTANTS.DEATH_LOG_FAB.ADD,
			})
			.click();
		await expect(page.getByText(/.* title/)).toBeVisible();
		await page.getByPlaceholder(CONSTANTS.DEATH_LOG_FAB.ADD_PH).fill(title);
		await page
			.getByText(CONSTANTS.DEATH_LOG_FAB.ADD_SUBMIT)
			.filter({ visible: true })
			.click();
		await expect(page.getByText(title)).toBeVisible();
	}

	static async goToCardFolder(page: Page, title: string) {
		await page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", {
				name: CONSTANTS.DEATH_LOG_CARD.ENTRY_CHILDREN,
			})
			.click();
		await Tester.checkCardVisibility(page, title, false);
	}

	static async goToCardEditModal(page: Page, title: string) {
		await page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", { name: CONSTANTS.DEATH_LOG_CARD.EDIT_MODAL })
			.click();
	}

	static async deleteEntry(page: Page, title: string) {
		await Tester.goToCardEditModal(page, title);

		let isVisible = await page
			.getByPlaceholder(CONSTANTS.DEATH_LOG_MODAL.DEL_PH)
			.isVisible();
		while (!isVisible) {
			await page
				.getByRole("button", {
					name: CONSTANTS.DEATH_LOG_MODAL.TURN_RIGHT,
				})
				.click();
			isVisible = await page
				.getByPlaceholder(CONSTANTS.DEATH_LOG_MODAL.DEL_PH)
				.isVisible();
		}

		await page
			.getByPlaceholder(CONSTANTS.DEATH_LOG_MODAL.DEL_PH)
			.fill("DEL");
		await page
			.getByRole("button", { name: CONSTANTS.DEATH_LOG_MODAL.DEL_SUBMIT })
			.click();
		await expect(page.getByText(title)).toBeHidden();
	}

	static async checkCardVisibility(
		page: Page,
		title: string,
		visiblity: boolean,
	) {
		if (visiblity) {
			await expect(
				page
					.getByTestId("virtuoso-item-list")
					.filter({ hasText: title }),
			).toBeVisible();
		} else {
			await expect(
				page
					.getByTestId("virtuoso-item-list")
					.filter({ hasText: title }),
			).toBeHidden();
		}
	}
}
