import type { CategoryPoint } from "../../model/stats-query-model/chart";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";

export function applyTransform(
	data: CategoryPoint[],
	transform: ChartSpec["transform"],
): CategoryPoint[] {
	switch (transform) {
		case "cumulative":
			return cumulative(data);
		default:
			return data;
	}
}

/** Running sum over y-values, preserving x order (SQL must sort before this runs). */
function cumulative(data: CategoryPoint[]): CategoryPoint[] {
	let running = 0;
	return data.map((p) => ({ ...p, y: (running += p.y) }));
}
