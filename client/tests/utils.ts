import { expect, Page } from "@playwright/test";

export async function addEntry(page: Page, title: string) {
    await page.getByRole("button", {
        name: "Open FAB"
    }).click();
    await page.getByRole("button", {
        name: "Add item"
    }).click();
    await expect(page.getByText(/.* title/)).toBeVisible();
    await page.getByPlaceholder("Type here").fill(title);
    await page.getByText('Confirm').click();
    await expect(page.getByText(title)).toBeVisible();
}

export async function goToCardFolder(page: Page, title: string) {
    await page.getByRole('listitem').filter({ hasText: title }).getByRole("button", { name: "Folder Button" }).click();
    await expect(page.getByTestId('virtuoso-item-list').filter({ hasText: title })).toBeHidden();
}

export async function goToCardEditModal(page: Page, title: string){
    await page.getByRole('listitem').filter({ hasText: title }).getByRole("button", { name: "Edit Button" }).click();
}