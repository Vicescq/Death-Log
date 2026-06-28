import LocalDB from "../LocalDB";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";

export class OverrideStage {
	static resolve(id: string, spec: ChartSpec): ChartSpec {
		let next = spec;

		if (next.sql.includes("{{REL}}")) {
			const predicate = spec.whenReliable
				? OverrideStage.showUnreliable(id)
					? "TRUE"
					: `(${spec.whenReliable})`
				: "TRUE";
			next = { ...next, sql: next.sql.replaceAll("{{REL}}", predicate) };
		}

		return next;
	}

	static showUnreliable(id: string): boolean {
		return LocalDB.getChartOverride(id).showUnreliable ?? false;
	}
}
