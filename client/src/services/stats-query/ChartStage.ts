import type { EChartsOption } from "echarts";
import type { CategoryPoint, EChartsConfig } from "./types/chart";

export function toBarChart(data: CategoryPoint[]): EChartsOption {
	return {
		xAxis: {
			type: "category",
			data: data.map((p) => p.x),
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "bar",
				data: data.map((p) => p.y),
				itemStyle: { borderRadius: [15, 15, 0, 0] },
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		dataZoom: { type: "slider", top: "90%" },
	};
}

export function toLineChart(data: CategoryPoint[]): EChartsOption {
	return {
		xAxis: {
			type: "category",
			data: data.map((p) => p.x),
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: data.map((p) => p.y),
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
	};
}

export function toTimeLineChart(data: CategoryPoint[]): EChartsOption {
	return {
		xAxis: { type: "time" },
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: data.map((p) => [p.x, p.y]),
				areaStyle: {},
				smooth: true,
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		dataZoom: [{ type: "inside" }, { type: "slider", top: "90%" }],
	};
}

export function toHeatMapCalendar(
	data: CategoryPoint[],
	config: EChartsConfig,
): EChartsOption {
	const values = data.map((p) => p.y);
	const dataMin = values.length > 0 ? Math.min(...values) : 0;
	const dataMax = values.length > 0 ? Math.max(...values) : 1;
	return {
		calendar: {
			orient: "vertical",
			yearLabel: { show: false },
			dayLabel: { nameMap: ["S", "M", "T", "W", "T", "F", "S"] },
			monthLabel: { show: false },
			cellSize: 40,
			range: config.range ?? "2020-01",
			itemStyle: { color: "#202030", borderWidth: 0.02 },
			left: "center",
			top: "center",
		},
		series: {
			type: "heatmap",
			coordinateSystem: "calendar",
			data: data.map((p) => [p.x, p.y]),
		},
		visualMap: {
			min: dataMin,
			max: dataMax,
			calculable: true,
			orient: "horizontal",
			inRange: {
				color: ["#90EE90", "#FFD700", "#FF8C00", "#FF4500", "#DC143C"],
			},
			textStyle: { color: "#cccccc" },
			handleStyle: { borderColor: "#000000" },
			left: "center",
		},
		tooltip: { trigger: "item" },
	};
}

export function toPieChart(data: CategoryPoint[]): EChartsOption {
	return {
		tooltip: {
			trigger: "item",
		},
		legend: {
			top: "7%",
			left: "center",
		},
		series: [
			{
				type: "pie",
				radius: ["40%", "60%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#000000",
					borderWidth: 5,
				},
				label: {
					show: false,
					position: "center",
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 40,
						fontWeight: "bold",
					},
				},
				labelLine: {
					show: false,
				},
				data: data.map((p) => ({ name: p.x, value: p.y })),
			},
		],
	};
}
