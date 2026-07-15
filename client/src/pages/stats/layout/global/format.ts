export function formatCount(value: number): string {
	return value.toLocaleString();
}

export function shareOfTotal(part: number, total: number): string {
	if (total === 0) return "0% of all deaths";
	return `${Math.round((part / total) * 100)}% of all deaths`;
}
