import { Page } from "@playwright/test";

export default class StartPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto(btnName: string) {
		const guestBtnLoc = this.page.getByRole("link", {
			name: btnName,
		});
		await guestBtnLoc.click();
	}
}
