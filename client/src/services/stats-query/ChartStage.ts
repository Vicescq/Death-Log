import type { EChartsOption } from "echarts";
import type {
	CategoryPoint,
	SunburstNode,
} from "../../model/stats-query-model/chart";

export function toBarChart(
	data: CategoryPoint[],
	inverted = false,
): EChartsOption {
	return {
		xAxis: inverted
			? { type: "value" }
			: {
					type: "category",
					data: data.map((p) => p.x),
					axisLabel: { show: false },
				},
		yAxis: inverted
			? {
					type: "category",
					data: data.map((p) => p.x),
					axisLabel: { show: false },
				}
			: { type: "value" },
		series: [
			{
				type: "bar",
				data: data.map((p) => p.y),
				itemStyle: {
					borderRadius: inverted ? [0, 15, 15, 0] : [15, 15, 0, 0],
				},
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		dataZoom: { type: "slider", bottom: 0 },
	};
}

export function toLineChart(data: CategoryPoint[]): EChartsOption {
	return {
		xAxis: {
			type: "category",
			data: data.map((p) => p.x),
			axisLabel: { show: false },
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: data.map((p) => p.y),
				areaStyle: {},
			},
		],
		tooltip: {
			trigger: "axis",
			axisPointer: { type: "shadow" },
			renderMode: "richText",
		},
		dataZoom: { type: "slider", bottom: 0 },
	};
}

export function toTimeLineChart(data: CategoryPoint[]): EChartsOption {
	return {
		xAxis: { type: "time", axisLabel: { show: false } },
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
		dataZoom: [{ type: "inside" }, { type: "slider", bottom: 0 }],
	};
}

export function toPieChart(data: CategoryPoint[]): EChartsOption {
	return {
		tooltip: {
			trigger: "item",
			renderMode: "richText",
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
				label: { show: false, position: "center" },
				emphasis: {
					label: { show: true, fontSize: 40, fontWeight: "bold" },
				},
				labelLine: { show: false },
				data: data.map((p) => ({ name: p.x, value: p.y })),
			},
		],
	};
}

export function toCalendar(
	data: CategoryPoint[],
	range: string,
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
			range: range,
			itemStyle: { color: "#202030", borderWidth: 0.02 },
			left: "center",
			top: "center",
		},
		series: {
			type: "heatmap",
			coordinateSystem: "calendar",
			data: data.map((p) => ({
				value: [p.x, p.y],
			})),
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
		tooltip: {
			trigger: "item",
			renderMode: "richText",
			// formatter: (params: unknown) => {
			// 	const p = params as {
			// 		value: [string, number];
			// 		name: string;
			// 	};
			// 	const lines = p.name ? p.name.split(", ").join("\n") : "";
			// 	return `${p.value[0]}\nDeaths: ${p.value[1]}${lines ? "\n" + lines : ""}`;
			// },
		},
	};
}

export function toSunburstChart(data: SunburstNode[]): EChartsOption {
	return {
		series: [
			{
				type: "sunburst",
				data,
				radius: ["0%", "90%"],
				label: { show: false },
				emphasis: { focus: "ancestor" },
				itemStyle: {
					borderRadius: 6,
					borderColor: "#000000",
					borderWidth: 3,
				},
			},
		],
		tooltip: { trigger: "item", renderMode: "richText" },
	};
}
