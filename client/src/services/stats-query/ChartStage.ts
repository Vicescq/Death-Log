import type { EChartsOption } from "echarts";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";
import type {
	CategoryPoint,
	ChartData,
	SunburstNode,
} from "../../model/stats-query-model/chart";

export class ChartStage {
	static render(
		spec: ChartSpec,
		data: ChartData,
		range: string,
	): EChartsOption | null {
		if (ChartStage.isEmpty(spec, data)) return null;

		if (data.kind === "sunburst")
			return ChartStage.sunburstChart(data.nodes);

		switch (spec.type) {
			case "bar":
				return ChartStage.barChart(data.points);
			case "line":
				return ChartStage.lineChart(data.points);
			case "pie":
				return ChartStage.pieChart(data.points);
			case "time-line":
				return ChartStage.timeLineChart(data.points);
			case "calendar":
				return ChartStage.calendarChart(data.points, range);
			case "sunburst":
				throw new Error("[DEV] sunburst type expects sunburst data");
		}
	}

	private static isEmpty(spec: ChartSpec, data: ChartData): boolean {
		if (spec.type === "calendar") return false;
		return data.kind === "sunburst"
			? data.nodes.length === 0
			: data.points.length === 0;
	}

	private static barChart(data: CategoryPoint[]): EChartsOption {
		return {
			xAxis: {
				type: "category",
				data: data.map((p) => p.x),
				axisLabel: { show: false },
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
			dataZoom: { type: "slider", bottom: 0 },
		};
	}

	private static lineChart(data: CategoryPoint[]): EChartsOption {
		return {
			xAxis: {
				type: "category",
				data: data.map((p) => p.x),
				axisLabel: { show: false },
			},
			yAxis: { type: "value" },
			series: [
				{ type: "line", data: data.map((p) => p.y), areaStyle: {} },
			],
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "shadow" },
				renderMode: "richText",
			},
			dataZoom: { type: "slider", bottom: 0 },
		};
	}

	private static timeLineChart(data: CategoryPoint[]): EChartsOption {
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

	private static pieChart(data: CategoryPoint[]): EChartsOption {
		return {
			tooltip: { trigger: "item", renderMode: "richText" },
			legend: { top: "7%", left: "center" },
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

	private static calendarChart(
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
				data: data.map((p) => ({ value: [p.x, p.y] })),
			},
			visualMap: {
				min: dataMin,
				max: dataMax,
				calculable: true,
				orient: "horizontal",
				inRange: {
					color: [
						"#90EE90",
						"#FFD700",
						"#FF8C00",
						"#FF4500",
						"#DC143C",
					],
				},
				textStyle: { color: "#cccccc" },
				handleStyle: { borderColor: "#000000" },
				left: "center",
			},
			tooltip: { trigger: "item", renderMode: "richText" },
		};
	}

	private static sunburstChart(data: SunburstNode[]): EChartsOption {
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
}
