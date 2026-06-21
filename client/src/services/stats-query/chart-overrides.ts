import LocalDB from "../LocalDB";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";

export function effectiveShowUnreliable(id: string): boolean {
	return LocalDB.getChartOverride(id).showUnreliable ?? false;
}

export function overrideSpec(id: string, spec: ChartSpec): ChartSpec {
	const override = LocalDB.getChartOverride(id);
	let next = spec;

	const title = override.title?.trim();
	if (title) next = { ...next, title };

	if (next.sql.includes("{{REL}}")) {
		const predicate = spec.whenReliable
			? effectiveShowUnreliable(id)
				? "TRUE"
				: `(${spec.whenReliable})`
			: "TRUE";
		next = { ...next, sql: next.sql.replaceAll("{{REL}}", predicate) };
	}

	return next;
}
