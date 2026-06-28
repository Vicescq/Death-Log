import alasql from "alasql";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";
import type {
	CategoryPoint,
	ChartData,
	DeathRow,
	SubjectRow,
	Tables,
} from "../../model/stats-query-model/chart";
import { rowsToSunburst, applySunburstPrune } from "./sunburst-utils";

export class QueryStage {
	static query(spec: ChartSpec, tables: Tables): ChartData {
		const rows = tables[spec.table];

		if (spec.type === "sunburst")
			return QueryStage.querySunburst(spec, rows);

		const raw = alasql(spec.sql, [rows]) as { x: unknown; y: unknown }[];
		let points: CategoryPoint[] = raw.map((r) => ({
			x: String(r.x),
			y: Number(r.y),
		}));
		if (spec.cumulative) points = QueryStage.runningSum(points);

		return { kind: "category", points };
	}

	private static querySunburst(
		spec: ChartSpec,
		rows: (DeathRow | SubjectRow)[],
	): ChartData {
		const levels = spec.levels;
		if (!levels || levels.length === 0)
			throw new Error(
				"[DEV] sunburst spec requires a non-empty levels array",
			);

		const result = alasql(spec.sql, [rows]) as Record<string, unknown>[];
		const nodes = applySunburstPrune(
			rowsToSunburst(result, levels.length),
			levels,
		);
		return { kind: "sunburst", nodes };
	}

	private static runningSum(data: CategoryPoint[]): CategoryPoint[] {
		let running = 0;
		return data.map((p) => ({ ...p, y: (running += p.y) }));
	}
}
