export async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatString(str: string) {
	return str.replace(/\s+/g, " ").trim();
}

export function validateNameUniqueness(
	name: string,
	siblingNames: string[],
	currEditingName: string | null,
) {
	if (currEditingName == null) {
		return !siblingNames.includes(name);
	} else {
		let isUnique = true;
		siblingNames.forEach((siblingName) => {
			if (siblingName != currEditingName && siblingName == name) {
				isUnique = false;
			}
		});
		return isUnique;
	}
}
