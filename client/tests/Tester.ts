import { expect, Page } from "@playwright/test";

export default class Tester {
	static async addEntry(page: Page, title: string) {
		await page
			.getByRole("button", {
				name: "Open FAB",
			})
			.click();
		await page
			.getByRole("button", {
				name: "Add item",
			})
			.click();
		await expect(page.getByText(/.* title/)).toBeVisible();
		await page.getByPlaceholder("Type here").fill(title);
		await page.getByText("Confirm").click();
		await expect(page.getByText(title)).toBeVisible();
	}

	static async goToCardFolder(page: Page, title: string) {
		await page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", { name: "Folder Button" })
			.click();
		await Tester.checkCardVisibility(page, title, false);
	}

	static async goToCardEditModal(page: Page, title: string) {
		await page
			.getByRole("listitem")
			.filter({ hasText: title })
			.getByRole("button", { name: "Edit Button" })
			.click();
	}

	static async deleteEntry(page: Page, title: string) {
		await Tester.goToCardEditModal(page, title);

		let isVisible = await page
			.getByPlaceholder("Type DEL to delete")
			.isVisible();
		while (!isVisible) {
			await page
				.getByRole("button", { name: "Modal Turn Right" })
				.click();
			isVisible = await page
				.getByPlaceholder("Type DEL to delete")
				.isVisible();
		}

		await page.getByPlaceholder("Type DEL to delete").fill("DEL");
		await page.getByRole("button", { name: "Delete Entry" }).click();
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
