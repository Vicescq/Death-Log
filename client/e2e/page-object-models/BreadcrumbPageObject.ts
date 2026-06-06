import { Page } from "@playwright/test";

export default class BreadcrumbPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async goto() {
		NaN;
	}

	/**
	 * Only visible on lower viewports => "..."
	 */
	async openModal() {
		NaN;
	}

    /**
	 * Only visible on lower viewports => "..."
	 */
	async closeModal() {
		NaN;
	}
}
