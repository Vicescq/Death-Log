import type { EChartsOption } from "echarts";

export type ChartMetaData = {
	title?: string;
	range?: string;
	visualMap?: {
		min?: number;
		max?: number;
	};
};

export type BarChartData = {
	y: number;
	x: string;
};

export type HeatMapCalendarChartData = [string, number];

export function createBarChartOptions(
	data: BarChartData[],
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
	data: HeatMapCalendarChartData[],
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
