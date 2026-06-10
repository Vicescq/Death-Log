import type { EChartsOption } from "echarts";
import type { BarChartData } from "./ChartStage";

export function createBarChartOptions(data: BarChartData[]): EChartsOption {
	return {
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		xAxis: {
			type: "category",
			data: data.map((obj) => obj.name),
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "bar",
				data: data.map((obj) => obj.deaths),
				itemStyle: { borderRadius: [15, 15, 0, 0] },
			},
		],
		title: { text: "Deaths" },
		dataZoom: { type: "slider", top: "90%" },
	};
}
