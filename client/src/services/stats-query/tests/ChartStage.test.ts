import { expect, test } from "vitest";
import type { EChartsOption } from "echarts";
import type {
	CategoryPoint,
	SunburstNode,
} from "../../../model/stats-query-model/chart";
import {
	toBarChart,
	toCalendar,
	toLineChart,
	toPieChart,
	toSunburstChart,
	toTimeLineChart,
} from "../ChartStage";

test("toBarChart - xAxis categories and series values match input", () => {
	const data: CategoryPoint[] = [
		{ x: "Boss A", y: 3 },
		{ x: "Boss B", y: 1 },
	];
	const option = toBarChart(data) as {
		xAxis: { data: string[] };
		yAxis: { type: string };
		series: [{ type: string; data: number[] }];
	};
	expect(option.xAxis.data).toEqual(["Boss A", "Boss B"]);
	expect(option.yAxis.type).toBe("value");
	expect(option.series[0].type).toBe("bar");
	expect(option.series[0].data).toEqual([3, 1]);
});

test("toBarChart inverted - xAxis is value, yAxis has categories", () => {
	const data: CategoryPoint[] = [{ x: "Malenia", y: 10 }];
	const option = toBarChart(data, true) as {
		xAxis: { type: string };
		yAxis: { type: string; data: string[] };
	};
	expect(option.xAxis.type).toBe("value");
	expect(option.yAxis.type).toBe("category");
	expect(option.yAxis.data).toEqual(["Malenia"]);
});

test("toLineChart - series data matches input values", () => {
	const data: CategoryPoint[] = [
		{ x: "Jan", y: 5 },
		{ x: "Feb", y: 8 },
	];
	const option = toLineChart(data) as {
		xAxis: { data: string[] };
		series: [{ type: string; data: number[] }];
	};
	expect(option.xAxis.data).toEqual(["Jan", "Feb"]);
	expect(option.series[0].type).toBe("line");
	expect(option.series[0].data).toEqual([5, 8]);
});

test("toTimeLineChart - series data is [x, y] pairs", () => {
	const data: CategoryPoint[] = [
		{ x: "2024-01-01", y: 3 },
		{ x: "2024-01-02", y: 7 },
	];
	const option = toTimeLineChart(data) as {
		xAxis: { type: string };
		series: [{ data: [string, number][] }];
	};
	expect(option.xAxis.type).toBe("time");
	expect(option.series[0].data).toEqual([
		["2024-01-01", 3],
		["2024-01-02", 7],
	]);
});

test("toPieChart - series data is {name, value} pairs", () => {
	const data: CategoryPoint[] = [
		{ x: "Game A", y: 20 },
		{ x: "Game B", y: 5 },
	];
	const option = toPieChart(data) as {
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

test("toCalendar - range is passed through to calendar config", () => {
	const option = toCalendar([], "2024-06") as {
		calendar: { range: string };
	};
	expect(option.calendar.range).toBe("2024-06");
});

test("toCalendar - visualMap min/max derived from data values", () => {
	const data: CategoryPoint[] = [
		{ x: "2024-06-01", y: 2 },
		{ x: "2024-06-10", y: 9 },
		{ x: "2024-06-20", y: 5 },
	];
	const option = toCalendar(data, "2024-06") as {
		visualMap: { min: number; max: number };
	};
	expect(option.visualMap.min).toBe(2);
	expect(option.visualMap.max).toBe(9);
});

test("toCalendar - empty data defaults min:0 max:1", () => {
	const option = toCalendar([], "2024-06") as {
		visualMap: { min: number; max: number };
	};
	expect(option.visualMap.min).toBe(0);
	expect(option.visualMap.max).toBe(1);
});

test("toSunburstChart - sunburst data passed through to series", () => {
	const data: SunburstNode[] = [
		{
			name: "Game A",
			value: 5,
			children: [{ name: "Profile", value: 5, children: [] }],
		},
	];
	const option = toSunburstChart(data) as {
		series: [{ type: string; data: SunburstNode[] }];
	};
	expect(option.series[0].type).toBe("sunburst");
	expect(option.series[0].data).toBe(data);
});

// default render mode == HTML == XSS
test("all chart terminals set tooltip renderMode: richText", () => {
	const catData: CategoryPoint[] = [{ x: "A", y: 1 }];
	const sunData: SunburstNode[] = [{ name: "A", value: 1, children: [] }];

	const options: EChartsOption[] = [
		toBarChart(catData),
		toBarChart(catData, true),
		toLineChart(catData),
		toTimeLineChart(catData),
		toPieChart(catData),
		toCalendar(catData, "2024-06"),
		toSunburstChart(sunData),
	];

	for (const option of options) {
		const tooltip = option.tooltip as { renderMode: string } | undefined;
		expect(tooltip?.renderMode).toBe("richText");
	}
});
