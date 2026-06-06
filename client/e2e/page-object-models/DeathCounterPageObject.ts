import { expect, Locator, Page } from "@playwright/test";

export default class DeathCounterPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async incDeath(timestampRel: boolean, remark?: string) {
		if (remark != undefined) {
			await this.page.getByPlaceholder("Died to a bug!").fill(remark);
		}

		await this.toggleRadioLabels(
			this.page.getByTestId("timestampRelYes"),
			this.page.getByTestId("timestampRelNo"),
			timestampRel,
		);

		await this.page.getByAltText("Increment Death").click();
	}

	async undoDeath() {
		await this.page.getByAltText("Decrement Death").click();
	}

	async editDeath(
		remark: string,
		dateSTDStr: string,
		timeSTDStr: string,
		timestampRel: boolean,
		txtIdentifier: string,
	) {
		await this.page
			.getByRole("listitem")
			.filter({ hasText: txtIdentifier })
			.getByAltText("Edit Death")
			.click();
		const modalLoc = this.page.getByRole("dialog");
		await modalLoc.getByLabel("Remark").fill(remark);
		await modalLoc.getByLabel("Date").fill(dateSTDStr);
		await modalLoc.getByLabel("Time").fill(timeSTDStr);
		await this.toggleRadioLabels(
			this.page.getByTestId("timestampRelYesEdit"),
			this.page.getByTestId("timestampRelNoEdit"),
			timestampRel,
		);
		await this.page
			.getByRole("dialog")
			.getByRole("button", { name: "Save" })
			.click();
	}

	async delDeath(txtIdentifier: string) {
		await this.page
			.getByRole("listitem")
			.filter({ hasText: txtIdentifier })
			.getByLabel("Delete Death")
			.click();
		await this.page
			.getByRole("dialog")
			.getByRole("button")
			.filter({ hasText: "Delete" })
			.click();
	}

	async toggleRadioLabels(
		yesRadioLoc: Locator,
		noRadioLoc: Locator,
		boolVal: boolean,
	) {
		if ((await yesRadioLoc.isChecked()) != boolVal) {
			if (boolVal) {
				await yesRadioLoc.check();
			} else {
				await noRadioLoc.check();
			}
		}
	}

	async startTime() {
		await this.page.getByAltText("Start Timer").click();
	}

	async pauseTime() {
		await this.page.getByAltText("Pause Timer").click();
	}

	async resetTime() {
		await this.page.getByAltText("Reset Timer").click();
		await this.page
			.getByRole("dialog")
			.getByRole("button", { name: "Reset" })
			.click();
	}
}
