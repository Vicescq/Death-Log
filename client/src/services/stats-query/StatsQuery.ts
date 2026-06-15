import type { Query, QueryResult } from "../../model/stats-query-model/query";
import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import { scopeNodes, scopeDeaths } from "./ScopingStage";
import { filterNodes, filterDeaths, applyLimit } from "./FilterStage";
import { sortNodes, sortDeaths } from "./SortStage";
import {
	extractNodeDeaths,
	extractNodeTimeline,
	extractDeathsByDay,
	extractDeathsCumulative,
	extractHierarchy,
	extractNodeScatter,
} from "./ExtractionStage";
import {
	toBarChart,
	toLineChart,
	toTimeLineChart,
	toHeatMapCalendar,
	toPieChart,
	toSunburstChart,
	toScatterChart,
} from "./ChartStage";
import type { CategoryPoint } from "../../model/stats-query-model/chart";

export class StatsQuery {
	static query(q: Query, tree: Tree): QueryResult {
		if (q.fetch === "deaths") {
			const scoped = scopeDeaths(q, tree);
			if (scoped.length === 0) return { status: "no-data" };

			const filtered = filterDeaths(scoped, q);
			const sorted = sortDeaths(filtered, q);
			const limited = applyLimit(sorted, q.limit);
			const data =
				q.extract === "deathsByDay"
					? extractDeathsByDay(limited, tree)
					: extractDeathsCumulative(limited);

			let option;
			switch (q.chartType) {
				case "hmc":   option = toHeatMapCalendar(data, q.echartsConfig); break;
				case "time-line": option = toTimeLineChart(data); break;
				default: throw new Error(`DEV ERROR: chart type not yet implemented`);
			}

			const threshold = q.minDataPoints ?? 1;
			if (data.length < threshold) return { status: "insufficient", minDataPoints: threshold, option };
			return { status: "ok", option };
		} else {
			const scoped = scopeNodes(q, tree);
			if (scoped.length === 0) return { status: "no-data" };

			const filtered = filterNodes(scoped, q, tree);

			const strictFiltered =
				q.extract === "nodeTimeline" &&
				!q.filter.unreliableStart &&
				!q.filter.unreliableEnd
					? filtered.filter(
							(n) =>
								n.dateStartRel &&
								(n.dateEnd === null || n.dateEndRel),
						)
					: filtered;

			const sorted = sortNodes(strictFiltered, q, tree);
			const limited = applyLimit(sorted, q.limit);

			if (q.extract === "hierarchy") {
				const option = toSunburstChart(
					extractHierarchy(limited, tree, q.topN, q.threshold, q.maxDepth),
				);
				const threshold = q.minDataPoints ?? 1;
				if (limited.length < threshold) return { status: "insufficient", minDataPoints: threshold, option };
				return { status: "ok", option };
			}

			if (q.extract === "nodeScatter") {
				const points = extractNodeScatter(limited, tree);
				const option = toScatterChart(points);
				const threshold = q.minDataPoints ?? 1;
				if (points.length < threshold) return { status: "insufficient", minDataPoints: threshold, option };
				return { status: "ok", option };
			}

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

			let option;
			switch (q.chartType) {
				case "bar":       option = toBarChart(data, q.echartsConfig); break;
				case "line":      option = toLineChart(data); break;
				case "time-line": option = toTimeLineChart(data); break;
				case "pie":       option = toPieChart(data); break;
				default: throw new Error(`DEV ERROR: chart type not yet implemented`);
			}

			const threshold = q.minDataPoints ?? 1;
			if (data.length < threshold) return { status: "insufficient", minDataPoints: threshold, option };
			return { status: "ok", option };
		}
	}
}
