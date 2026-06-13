import type { EChartsOption } from "echarts";
import { calcDeaths } from "../../pages/death-log/utils";
import type {
	DistinctTreeNode,
	Tree,
} from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import type { SimpleChartData, TimeChartData } from "./types/chart";
import type { BarNodeQuery, LineNodeQuery, TimeLineNodeQuery } from "./types/node-query";
import type { HmcDeathQuery } from "./types/death-query";
import {
	createBarChartOptions,
	createHeatMapCalendarOptions,
	createLineChartOptions,
	createLineTimeChartOptions,
} from "./options";
import { isoToDateSTD } from "../../utils/date";
import { assertIsNonNull } from "../../utils/asserts";

export function toBarChart(
	nodes: DistinctTreeNode[],
	q: BarNodeQuery,
	tree: Tree,
): EChartsOption {
	const chartData: SimpleChartData[] = nodes.map((node) => ({
		x: node.name,
		y: calcDeaths(node, tree),
	}));
	return createBarChartOptions(chartData, q.chartMetaData);
}

export function toHeatMapCalendar(
	deaths: Death[],
	q: HmcDeathQuery,
): EChartsOption {
	const dayToDeathCountMap: Record<string, number> = {};
	for (const death of deaths) {
		const date = isoToDateSTD(death.timestamp);
		dayToDeathCountMap[date] = (dayToDeathCountMap[date] ?? 0) + 1;
	}

	const dataset: TimeChartData[] = Object.entries(dayToDeathCountMap).map(
		([date, count]) => [date, count],
	);

	const values = dataset.map((item) => item[1]);
	const dataMin = values.length > 0 ? Math.min(...values) : 0;
	const dataMax = values.length > 0 ? Math.max(...values) : 1;

	return createHeatMapCalendarOptions(dataset, {
		...q.chartMetaData,
		visualMap: { min: dataMin, max: dataMax },
	});
}

export function toLineChart(
	nodes: DistinctTreeNode[],
	q: LineNodeQuery,
	tree: Tree,
): EChartsOption {
	const chartData: SimpleChartData[] = nodes.map((node) => ({
		x: node.name,
		y: calcDeaths(node, tree),
	}));
	return createLineChartOptions(chartData, q.chartMetaData);
}

export function toTimeLineChart(
	nodes: DistinctTreeNode[],
	q: TimeLineNodeQuery,
	tree: Tree,
): EChartsOption {
	const chartData: TimeChartData[] =
		q.dateExtract === "start"
			? nodes.map((node) => [
					isoToDateSTD(node.dateStart),
					calcDeaths(node, tree),
				])
			: nodes.map((node) => {
					assertIsNonNull(node.dateEnd); // precondition that filter settings only lets completet entries through
					return [isoToDateSTD(node.dateEnd), calcDeaths(node, tree)];
				});
	return createLineTimeChartOptions(chartData, q.chartMetaData);
}
