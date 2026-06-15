import { expect, test, beforeEach, afterEach } from "vitest";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { scopeNodes, scopeDeaths } from "../ScopingStage";
import {
	toBarChart,
	toLineChart,
	toTimeLineChart,
	toHeatMapCalendar,
} from "../ChartStage";
import {
	extractNodeDeaths,
	extractNodeTimeline,
	extractDeathsByDay,
} from "../ExtractionStage";
import { defaultFilters, defaultDeathFilters } from "../../../../shared/defaults";
import { setupTestTree, cleanupTestTree } from "./fixtures";
import type { BarNodeQuery, LineNodeQuery, TimeLineNodeQuery } from "../../../model/stats-query-model/node-query";
import type { HmcDeathQuery } from "../../../model/stats-query-model/death-query";
import type { DistinctTreeNode } from "../../../model/tree-node-model/TreeNodeSchema";

const baseNodeQ = {
	title: "Test",
	filter: defaultFilters,
	sort: { sortingKey: "deaths" as const, ascending: true },
	echartsConfig: {},
};

const baseDeathQ = {
	fetch: "deaths" as const,
	title: "Test",
	filter: defaultDeathFilters,
	sort: { sortingKey: "timestamp" as const, ascending: true },
	echartsConfig: {},
	extract: "deathsByDay" as const,
	chartType: "hmc" as const,
};

beforeEach(() => {
	setupTestTree();
});

afterEach(() => {
	cleanupTestTree();
});

test("toBarChart | bar series with category xAxis", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: BarNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "global" },
		extract: "nodeDeaths",
		chartType: "bar",
	};
	const nodes = scopeNodes(q, tree);
	const chart = toBarChart(extractNodeDeaths(nodes, tree), q.echartsConfig);
	expect((chart.series as Array<{ type: string }>)[0].type).toBe("bar");
	expect((chart.xAxis as { type: string }).type).toBe("category");
});

test("toLineChart | line series with category xAxis", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: LineNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "global" },
		extract: "nodeDeaths",
		chartType: "line",
	};
	const nodes = scopeNodes(q, tree);
	const chart = toLineChart(extractNodeDeaths(nodes, tree));
	expect((chart.series as Array<{ type: string }>)[0].type).toBe("line");
	expect((chart.xAxis as { type: string }).type).toBe("category");
});

test("toTimeLineChart | dateExtract: 'start' — line series with time xAxis", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: TimeLineNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "global" },
		extract: "nodeTimeline",
		dateExtract: "start",
		chartType: "time-line",
	};
	const nodes = scopeNodes(q, tree);
	const chart = toTimeLineChart(extractNodeTimeline(nodes, "start", tree));
	expect((chart.series as Array<{ type: string }>)[0].type).toBe("line");
	expect((chart.xAxis as { type: string }).type).toBe("time");
});

test("toTimeLineChart | dateExtract: 'end' — uses dateEnd from nodes", () => {
	const tree = useDeathLogStore.getState().tree;
	const q: TimeLineNodeQuery = {
		...baseNodeQ,
		fetch: "subjects",
		scope: { type: "global" },
		extract: "nodeTimeline",
		dateExtract: "end",
		chartType: "time-line",
	};
	const rawNodes = scopeNodes(q, tree);
	const nodesWithEnd = rawNodes.map(
		(n) => ({ ...n, dateEnd: "2020-06-01T00:00:00.000Z" }),
	) as unknown as DistinctTreeNode[];
	const chart = toTimeLineChart(extractNodeTimeline(nodesWithEnd, "end", tree));
	expect((chart.series as Array<{ type: string }>)[0].type).toBe("line");
	expect((chart.xAxis as { type: string }).type).toBe("time");
});

test("toHeatMapCalendar | heatmap series, calendar range from echartsConfig", () => {
	const q: HmcDeathQuery = {
		...baseDeathQ,
		scope: { type: "global" },
		echartsConfig: { range: "2024-06" },
	};
	const tree = useDeathLogStore.getState().tree;
	const deaths = scopeDeaths(q, tree);
	const chart = toHeatMapCalendar(extractDeathsByDay(deaths, tree), q.echartsConfig);
	expect((chart.series as { type: string }).type).toBe("heatmap");
	expect((chart.calendar as { range: string }).range).toBe("2024-06");
	expect(chart.visualMap).toBeDefined();
});

test("toHeatMapCalendar | defaults calendar range to '2020-01' when none in config", () => {
	const q: HmcDeathQuery = { ...baseDeathQ, scope: { type: "global" } };
	const tree = useDeathLogStore.getState().tree;
	const deaths = scopeDeaths(q, tree);
	const chart = toHeatMapCalendar(extractDeathsByDay(deaths, tree), q.echartsConfig);
	expect((chart.calendar as { range: string }).range).toBe("2020-01");
});
