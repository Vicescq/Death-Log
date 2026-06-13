import type { EChartsOption } from "echarts";
import type { Query } from "./types/query";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { scopeNodes, scopeDeaths } from "./ScopingStage";
import { filterNodes, filterDeaths, applyLimit } from "./FilterStage";
import { sortNodes, sortDeaths } from "./SortStage";
import {
	extractNodeDeaths,
	extractNodeTimeline,
	extractDeathsByDay,
	extractDeathsCumulative,
} from "./ExtractionStage";
import {
	toBarChart,
	toLineChart,
	toTimeLineChart,
	toHeatMapCalendar,
	toPieChart,
} from "./ChartStage";
import type { CategoryPoint } from "./types/chart";

export class StatsQuery {
	static query(q: Query): EChartsOption {
		const tree = useDeathLogStore.getState().tree;

		if (q.fetch === "deaths") {
			const scoped = scopeDeaths(q, tree);
			const filtered = filterDeaths(scoped, q);
			const sorted = sortDeaths(filtered, q);
			const limited = applyLimit(sorted, q.limit);
			const data =
				q.extract === "deathsByDay"
					? extractDeathsByDay(limited)
					: extractDeathsCumulative(limited);
			switch (q.chartType) {
				case "hmc":
					return toHeatMapCalendar(data, q.echartsConfig);
				case "time-line":
					return toTimeLineChart(data);
				default:
					throw new Error(
						`DEV ERROR: chart type  not yet implemented`,
					);
			}
		} else {
			const scoped = scopeNodes(q, tree);
			const filtered = filterNodes(scoped, q, tree);
			const sorted = sortNodes(filtered, q, tree);
			const limited = applyLimit(sorted, q.limit);

			let data: CategoryPoint[];
			switch (q.extract) {
				case "nodeDeaths":
					data = extractNodeDeaths(limited, tree);
					break;
				case "nodeTimeline":
					data = extractNodeTimeline(limited, q.dateExtract, tree);
					break;
				default:
					throw new Error("DEV ERROR! Not yet implemented yet!");
			}

			switch (q.chartType) {
				case "bar":
					return toBarChart(data);
				case "line":
					return toLineChart(data);
				case "time-line":
					return toTimeLineChart(data);
				case "pie":
					return toPieChart(data);
				default:
					throw new Error(
						`DEV ERROR: chart type  not yet implemented`,
					);
			}
		}
	}
}
