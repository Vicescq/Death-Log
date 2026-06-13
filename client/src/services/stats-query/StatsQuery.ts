import type { EChartsOption } from "echarts";
import type { Query } from "./types/query";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { scopeNodes, scopeDeaths } from "./ScopingStage";
import { filterNodes, filterDeaths, applyLimit } from "./FilterStage";
import { sortNodes, sortDeaths } from "./SortStage";
import { toBarChart, toHeatMapCalendar, toTimeLineChart } from "./ChartStage";

export type { ChartMetaData, SimpleChartData, TimeChartData } from "./types/chart";
export type { NodeQueryScope, DeathQueryScope } from "./types/scope";
export type {
	GamesQuery,
	ProfilesQuery,
	SubjectsQuery,
	NodeQuery,
	BarNodeQuery,
	LineNodeQuery,
	TimeLineNodeQuery,
} from "./types/node-query";
export type {
	DeathFilters,
	DeathSortSettings,
	DeathQuery,
	HmcDeathQuery,
	LineDeathQuery,
} from "./types/death-query";
export type { Query } from "./types/query";

/**
 * Entry point for the stats query pipeline.
 *
 * Preferred usage — pass a Query object to query():
 * @example
 * StatsQuery.query({
 *   fetch: "subjects",
 *   scope: { type: "game", ids: ["game1"] },
 *   filter: defaultFilters,
 *   sort: { sortingKey: "deaths", ascending: false },
 *   limit: 10,
 *   chartMetaData: { title: "Top Deaths" },
 * })
 *
 * @example
 * StatsQuery.query({
 *   fetch: "deaths",
 *   scope: { type: "global" },
 *   filter: defaultDeathFilters,
 *   sort: { sortingKey: "timestamp", ascending: true },
 *   chartMetaData: { range: "2024-06" },
 * })
 */
export class StatsQuery {
	static query(q: Query): EChartsOption {
		const tree = useDeathLogStore.getState().tree;

		if (q.fetch === "deaths") {
			const scoped = scopeDeaths(q, tree);
			const filtered = filterDeaths(scoped, q);
			const sorted = sortDeaths(filtered, q);
			const limited = applyLimit(sorted, q.limit);
			switch (q.chartType) {
				case "hmc":
					return toHeatMapCalendar(limited, q);

				default:
					throw new Error(
						`DEV ERROR: chart type "${q.chartType}" not yet implemented`,
					);
			}
		} else {
			const scoped = scopeNodes(q, tree);
			const filtered = filterNodes(scoped, q, tree);
			const sorted = sortNodes(filtered, q, tree);
			const limited = applyLimit(sorted, q.limit);
			switch (q.chartType) {
				case "bar":
					return toBarChart(limited, q, tree);
				case "time-line":
					return toTimeLineChart(limited, q, tree);
				default:
					throw new Error(
						`DEV ERROR: chart type "${q.chartType}" not yet implemented`,
					);
			}
		}
	}
}
