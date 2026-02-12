export async function delay(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatString(str: string) {
	return str.replace(/\s+/g, " ").trim();
}

