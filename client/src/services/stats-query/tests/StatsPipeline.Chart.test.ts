import { expect, test } from "vitest";
import type { EChartsOption } from "echarts";
import { StatsPipeline } from "../StatsPipeline";
import type {
	CategoryPoint,
	ChartData,
	ChartType,
	Graph,
} from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";

function query(chartType: ChartType): Query {
	return {
		id: "q",
		title: "T",
		description: "",
		method: "bossDeathsBySubject",
		chartType,
		scope: [],
		reliability: { isTemporal: false },
	} as Query;
}

function category(points: CategoryPoint[]): ChartData {
	return { kind: "category", points };
}

function local(chartType: ChartType, data: ChartData) {
	return StatsPipeline.Chart(query(chartType), data);
}

test("empty category data - returns null (no-data signal)", () => {
	expect(local("bar", category([]))).toBeNull();
	expect(local("line", category([]))).toBeNull();
	expect(local("pie", category([]))).toBeNull();
	expect(local("time-line", category([]))).toBeNull();
});

test("empty calendar data - never null (renders the empty grid)", () => {
	expect(local("calendar", category([]))).not.toBeNull();
});

test("empty graph data - returns null (no-data signal)", () => {
	const empty: ChartData = {
		kind: "graph",
		graph: { nodes: [], edges: [], categories: [] },
	};
	expect(local("graph", empty)).toBeNull();
});

test("all-zero values are data, not empty - renders a chart", () => {
	const option = local(
		"bar",
		category([
			{ x: "A", y: 0 },
			{ x: "B", y: 0 },
		]),
	);
	expect(option).not.toBeNull();
});

test("bar - xAxis categories and series values match input", () => {
	const option = local(
		"bar",
		category([
			{ x: "Boss A", y: 3 },
			{ x: "Boss B", y: 1 },
		]),
	) as {
		xAxis: { data: string[] };
		yAxis: { type: string };
		series: [{ type: string; data: number[] }];
	};
	expect(option.xAxis.data).toEqual(["Boss A", "Boss B"]);
	expect(option.yAxis.type).toBe("value");
	expect(option.series[0].type).toBe("bar");
	expect(option.series[0].data).toEqual([3, 1]);
});

test("line - series data matches input values", () => {
	const option = local(
		"line",
		category([
			{ x: "Jan", y: 5 },
			{ x: "Feb", y: 8 },
		]),
	) as {
		xAxis: { data: string[] };
		series: [{ type: string; data: number[] }];
	};
	expect(option.xAxis.data).toEqual(["Jan", "Feb"]);
	expect(option.series[0].type).toBe("line");
	expect(option.series[0].data).toEqual([5, 8]);
});

test("time-line - series data is [x, y] pairs", () => {
	const option = local(
		"time-line",
		category([
			{ x: "2024-01-01", y: 3 },
			{ x: "2024-01-02", y: 7 },
		]),
	) as {
		xAxis: { type: string };
		series: [{ data: [string, number][] }];
	};
	expect(option.xAxis.type).toBe("time");
	expect(option.series[0].data).toEqual([
		["2024-01-01", 3],
		["2024-01-02", 7],
	]);
});

test("pie - series data is {name, value} pairs", () => {
	const option = local(
		"pie",
		category([
			{ x: "Game A", y: 20 },
			{ x: "Game B", y: 5 },
		]),
	) as {
		series: [
			{ type: string; data: Array<{ name: string; value: number }> },
		];
	};
	expect(option.series[0].type).toBe("pie");
	expect(option.series[0].data).toEqual([
		{ name: "Game A", value: 20 },
		{ name: "Game B", value: 5 },
	]);
});

test("calendar - maps already-grouped day points into heatmap cells", () => {
	const option = local(
		"calendar",
		category([
			{ x: "2024-01-01", y: 2 },
			{ x: "2024-01-02", y: 1 },
		]),
	) as {
		series: { type: string; data: Array<{ value: [string, number] }> };
	};
	expect(option.series.type).toBe("heatmap");
	expect(option.series.data).toEqual([
		{ value: ["2024-01-01", 2] },
		{ value: ["2024-01-02", 1] },
	]);
});

test("graph - nodes and edges map into the graph series", () => {
	const graph: Graph = {
		categories: [{ name: "Games" }, { name: "Subjects" }],
		nodes: [
			{ id: "g1", name: "Game", value: 5, category: 0 },
			{ id: "s1", name: "Boss", value: 2, category: 1 },
		],
		edges: [{ id: "g1-s1", source: "g1", target: "s1" }],
	};

	const option = local("graph", { kind: "graph", graph }) as {
		series: [{ type: string; data: unknown[]; links: unknown[] }];
	};
	expect(option.series[0].type).toBe("graph");
	expect(option.series[0].data).toHaveLength(3);
	expect(option.series[0].links).toEqual(
		expect.arrayContaining([{ source: "g1", target: "s1" }]),
	);
});

test("graph - synthesizes a root node wired to every game", () => {
	const graph: Graph = {
		categories: [{ name: "Games" }, { name: "Subjects" }],
		nodes: [
			{ id: "g1", name: "Game A", value: 5, category: 0 },
			{ id: "g2", name: "Game B", value: 3, category: 0 },
			{ id: "s1", name: "Boss", value: 2, category: 1 },
		],
		edges: [{ id: "g1-s1", source: "g1", target: "s1" }],
	};
	const option = local("graph", { kind: "graph", graph }) as {
		series: [
			{
				data: Array<{ id: string; value: number }>;
				links: Array<{ source: string; target: string }>;
			},
		];
	};
	expect(option.series[0].data).toHaveLength(4);
	const root = option.series[0].data.find(
		(n) => n.id !== "g1" && n.id !== "g2" && n.id !== "s1",
	);
	expect(root?.value).toBe(8); // sum of g1 (5) + g2 (3)
	expect(option.series[0].links).toEqual(
		expect.arrayContaining([
			{ source: root?.id, target: "g1" },
			{ source: root?.id, target: "g2" },
			{ source: "g1", target: "s1" },
		]),
	);
});

test("graph - the root node renders much bigger than every other node", () => {
	const graph: Graph = {
		categories: [{ name: "Games" }],
		nodes: [{ id: "g1", name: "Game A", value: 1000, category: 0 }],
		edges: [],
	};
	const option = local("graph", { kind: "graph", graph }) as {
		series: [{ data: Array<{ id: string; symbolSize: number }> }];
	};
	const root = option.series[0].data.find((n) => n.id !== "g1");
	const game = option.series[0].data.find((n) => n.id === "g1");
	expect(root?.symbolSize).toBeGreaterThan(game!.symbolSize);
});

// default render mode == HTML == XSS: every terminal must opt into richText
test("all chart terminals set tooltip renderMode: richText", () => {
	const cat = category([{ x: "A", y: 1 }]);
	const graph: ChartData = {
		kind: "graph",
		graph: {
			nodes: [{ id: "a", name: "A", value: 1, category: 0 }],
			edges: [],
			categories: [{ name: "C" }],
		},
	};

	const options: (EChartsOption | null)[] = [
		local("bar", cat),
		local("line", cat),
		local("time-line", cat),
		local("pie", cat),
		local("graph", graph),
		local("calendar", cat),
	];

	for (const option of options) {
		const tooltip = option?.tooltip as { renderMode: string } | undefined;
		expect(tooltip?.renderMode).toBe("richText");
	}
});
