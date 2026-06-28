import { expect, test } from "vitest";
import type { EChartsOption } from "echarts";
import { StatsPipeline } from "../StatsPipeline";
import type {
	CategoryPoint,
	ChartData,
	SunburstNode,
} from "../../../model/stats-query-model/chart";
import type { ChartSpec, ChartType } from "../../../model/stats-query-model/chart-spec";

function spec(type: ChartType): ChartSpec {
	return { type, title: "T", table: "deaths", sql: "" };
}

function category(points: CategoryPoint[]): ChartData {
	return { kind: "category", points };
}

test("empty category data - returns null (no-data signal)", () => {
	expect(StatsPipeline.Chart(spec("bar"), category([]), "")).toBeNull();
	expect(StatsPipeline.Chart(spec("line"), category([]), "")).toBeNull();
	expect(StatsPipeline.Chart(spec("pie"), category([]), "")).toBeNull();
	expect(
		StatsPipeline.Chart(spec("time-line"), category([]), ""),
	).toBeNull();
});

test("empty sunburst data - returns null (no-data signal)", () => {
	const empty: ChartData = { kind: "sunburst", nodes: [] };
	expect(StatsPipeline.Chart(spec("sunburst"), empty, "")).toBeNull();
});

test("calendar is exempt - empty month still renders a chart", () => {
	const option = StatsPipeline.Chart(
		spec("calendar"),
		category([]),
		"2024-06",
	);
	expect(option).not.toBeNull();
});

test("all-zero values are data, not empty - renders a chart", () => {
	const option = StatsPipeline.Chart(
		spec("bar"),
		category([
			{ x: "A", y: 0 },
			{ x: "B", y: 0 },
		]),
		"",
	);
	expect(option).not.toBeNull();
});

test("bar - xAxis categories and series values match input", () => {
	const option = StatsPipeline.Chart(
		spec("bar"),
		category([
			{ x: "Boss A", y: 3 },
			{ x: "Boss B", y: 1 },
		]),
		"",
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
	const option = StatsPipeline.Chart(
		spec("line"),
		category([
			{ x: "Jan", y: 5 },
			{ x: "Feb", y: 8 },
		]),
		"",
	) as {
		xAxis: { data: string[] };
		series: [{ type: string; data: number[] }];
	};
	expect(option.xAxis.data).toEqual(["Jan", "Feb"]);
	expect(option.series[0].type).toBe("line");
	expect(option.series[0].data).toEqual([5, 8]);
});

test("time-line - series data is [x, y] pairs", () => {
	const option = StatsPipeline.Chart(
		spec("time-line"),
		category([
			{ x: "2024-01-01", y: 3 },
			{ x: "2024-01-02", y: 7 },
		]),
		"",
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
	const option = StatsPipeline.Chart(
		spec("pie"),
		category([
			{ x: "Game A", y: 20 },
			{ x: "Game B", y: 5 },
		]),
		"",
	) as {
		series: [{ type: string; data: Array<{ name: string; value: number }> }];
	};
	expect(option.series[0].type).toBe("pie");
	expect(option.series[0].data).toEqual([
		{ name: "Game A", value: 20 },
		{ name: "Game B", value: 5 },
	]);
});

test("calendar - range is passed through to calendar config", () => {
	const option = StatsPipeline.Chart(spec("calendar"), category([]), "2024-06") as {
		calendar: { range: string };
	};
	expect(option.calendar.range).toBe("2024-06");
});

test("calendar - visualMap min/max derived from data values", () => {
	const option = StatsPipeline.Chart(
		spec("calendar"),
		category([
			{ x: "2024-06-01", y: 2 },
			{ x: "2024-06-10", y: 9 },
			{ x: "2024-06-20", y: 5 },
		]),
		"2024-06",
	) as { visualMap: { min: number; max: number } };
	expect(option.visualMap.min).toBe(2);
	expect(option.visualMap.max).toBe(9);
});

test("calendar - empty data defaults min:0 max:1", () => {
	const option = StatsPipeline.Chart(spec("calendar"), category([]), "2024-06") as {
		visualMap: { min: number; max: number };
	};
	expect(option.visualMap.min).toBe(0);
	expect(option.visualMap.max).toBe(1);
});

test("sunburst - sunburst data passed through to series", () => {
	const nodes: SunburstNode[] = [
		{
			name: "Game A",
			value: 5,
			children: [{ name: "Profile", value: 5, children: [] }],
		},
	];
	const option = StatsPipeline.Chart(
		spec("sunburst"),
		{ kind: "sunburst", nodes },
		"",
	) as { series: [{ type: string; data: SunburstNode[] }] };
	expect(option.series[0].type).toBe("sunburst");
	expect(option.series[0].data).toBe(nodes);
});

// default render mode == HTML == XSS — every terminal must opt into richText
test("all chart terminals set tooltip renderMode: richText", () => {
	const cat = category([{ x: "A", y: 1 }]);
	const sun: ChartData = {
		kind: "sunburst",
		nodes: [{ name: "A", value: 1, children: [] }],
	};

	const options: (EChartsOption | null)[] = [
		StatsPipeline.Chart(spec("bar"), cat, ""),
		StatsPipeline.Chart(spec("line"), cat, ""),
		StatsPipeline.Chart(spec("time-line"), cat, ""),
		StatsPipeline.Chart(spec("pie"), cat, ""),
		StatsPipeline.Chart(spec("calendar"), cat, "2024-06"),
		StatsPipeline.Chart(spec("sunburst"), sun, ""),
	];

	for (const option of options) {
		const tooltip = option?.tooltip as { renderMode: string } | undefined;
		expect(tooltip?.renderMode).toBe("richText");
	}
});
