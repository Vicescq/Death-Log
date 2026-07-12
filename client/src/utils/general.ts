export async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatBytes(bytes: number): string {
	const mb = bytes / 1024 ** 2;
	return `${mb.toFixed(1)} MB`;
}

/**
 * Trims leading, trailing, and intermediate whitespace
 * @param str
 * @returns
 */
export function formatString(str: string) {
	return str.replace(/\s+/g, " ").trim();
}

/**
 * NOTE: Returns true given an editing context because this is the original name and should be ignored
 * @param nameToBeValidated
 * @param siblingNames
 * @param prevName
 * @returns
 */
export function validateNameUniqueness(
	nameToBeValidated: string,
	siblingNames: string[],
	prevName: string | null,
) {
	if (prevName == null) {
		return !siblingNames.includes(nameToBeValidated);
	} else {
		let isUnique = true;
		siblingNames.forEach((siblingName) => {
			if (siblingName != prevName && siblingName == nameToBeValidated) {
				isUnique = false;
			}
		});
		return isUnique;
	}
}
