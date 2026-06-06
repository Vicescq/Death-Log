import { Page } from "@playwright/test";

export default class NavBarPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		NaN;
	}

	/**
	 * Only visible on lower viewports
	 */
	async openSidebar() {
		NaN;
	}
}
