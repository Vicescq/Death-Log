import { Page } from "@playwright/test";
import { NodeFormEdit } from "../../src/pages/death-log/formSchemas";

export default class DeathEditorPageObject {
	readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	async edit(fields: Partial<NodeFormEdit>) {
		const form = this.page.locator("fieldset");

		for (const key in fields) {
			const fieldKey = key as keyof NodeFormEdit;
			const value = fields[fieldKey];
			const locator = form.locator(`[name="${fieldKey}"]`);

			if (typeof value == "boolean") {
				if (value != (await locator.isChecked())) {
					await locator.setChecked(value);
				}
			} else if (typeof value == "string") {
				if (value != (await locator.inputValue())) {
					if (fieldKey == "context") {
						await locator.selectOption(value);
					} else {
						await locator.fill(value);
					}
				}
			} else if (value == null) {
				continue;
			}
		}

		await form.getByRole("button", { name: "Save" }).click();
	}

	get saveButton() {
		return this.page
			.locator("fieldset")
			.getByRole("button", { name: "Save" });
	}

	async reset() {
		await this.page
			.locator("fieldset")
			.getByRole("button", { name: "Reset" })
			.click();
	}

	get heading() {
		return this.page.getByRole("heading", { name: /^Editing:/ });
	}

	async delete() {
		await this.page
			.locator("fieldset")
			.getByPlaceholder("Type DEL to delete")
			.fill("DEL");

		await this.page
			.locator("fieldset")
			.getByRole("button", { name: "Delete Entry" })
			.click();
	}

	field(key: keyof NodeFormEdit) {
		return this.page.locator(`[name="${key}"]`);
	}
}
