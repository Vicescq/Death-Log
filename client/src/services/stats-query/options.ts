import type { EChartsOption } from "echarts";

import type { ChartMetaData, SimpleChartData, TimeChartData } from "./types/chart";

export function createBarChartOptions(
	data: SimpleChartData[],
	metaData: ChartMetaData,
): EChartsOption {
	return {
		xAxis: {
			type: "category",
			data: data.map((obj) => obj.x),
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "bar",
				data: data.map((obj) => obj.y),
				itemStyle: { borderRadius: [15, 15, 0, 0] },
			},
		],
		title: { text: metaData.title },
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		dataZoom: { type: "slider", top: "90%" },
	};
}

export function createHeatMapCalendarOptions(
	data: TimeChartData[],
	metaData: ChartMetaData,
): EChartsOption {
	return {
		calendar: {
			orient: "vertical",
			yearLabel: {
				show: false,
			},
			dayLabel: {
				nameMap: ["S", "M", "T", "W", "T", "F", "S"],
			},
			monthLabel: {
				show: false,
			},
			cellSize: 40,
			range: metaData.range ?? "2020-01",
			itemStyle: { color: "#202030", borderWidth: 0.02 },
			left: "center",
			top: "center",
		},
		series: {
			type: "heatmap",
			coordinateSystem: "calendar",
			data: data,
		},
		visualMap: {
			min: metaData.visualMap?.min ?? 0,
			max: metaData.visualMap?.max ?? 1,
			calculable: true,
			orient: "horizontal",
			inRange: {
				color: ["#90EE90", "#FFD700", "#FF8C00", "#FF4500", "#DC143C"],
			},
			textStyle: {
				color: "#cccccc",
			},
			handleStyle: { borderColor: "#000000" },
			left: "center",
		},
		tooltip: { trigger: "item" },
	};
}

export function createLineChartOptions(
	data: SimpleChartData[],
	metaData: ChartMetaData,
): EChartsOption {
	return {
		xAxis: {
			type: "category",
			data: data.map((obj) => obj.x),
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: data.map((obj) => obj.y),
				type: "line",
			},
		],
		title: { text: metaData.title },
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
	};
}

export function createLineTimeChartOptions(
	data: TimeChartData[],
	metaData: ChartMetaData,
): EChartsOption {
	return {
		xAxis: {
			type: "time",
		},
		yAxis: {
			type: "value",
		},
		series: [
			{
				data: data,
				type: "line",
			},
		],
		title: { text: metaData.title },
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
	};
}
