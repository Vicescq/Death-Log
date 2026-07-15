import type { EChartsOption } from "echarts";
import type {
	CategoryPoint,
	ChartData,
	ChartType,
	Graph,
	ScatterPoint,
	SunburstNode,
} from "../../model/stats-query-model/chart";
import { assertIsNonNull } from "../../utils/asserts";

const MIN_SYMBOL_SIZE = 10;
const MAX_SYMBOL_SIZE = 60;
const SYMBOL_SIZE_SCALE = 2;
const ROOT_SYMBOL_SIZE = 100;

export type CalendarConfig = { range: string; cellSize: number };

export type GraphConfig = {
	draggable: boolean;
	zoom: number;
	showLabels: boolean;
};

const GRAPH_ROOT_ID = "graph-root";
const GRAPH_ROOT_NAME = "Root";
const GAMES_CATEGORY_NAME = "Games";

export class ChartStage {
	static render(
		type: ChartType,
		data: ChartData,
		calendarConfig?: CalendarConfig,
		graphConfig?: GraphConfig,
	): EChartsOption | null {
		if (ChartStage.isEmpty(type, data)) return null;

		if (data.kind === "graph") {
			assertIsNonNull(graphConfig);
			return ChartStage.graphChart(
				ChartStage.withRootNode(data.graph),
				graphConfig,
			);
		}
		if (data.kind === "sunburst")
			return ChartStage.sunburstChart(data.nodes);
		if (data.kind === "scatter")
			return ChartStage.scatterChart(data.points);

		switch (type) {
			case "bar":
				return ChartStage.barChart(data.points);
			case "line":
				return ChartStage.lineChart(data.points);
			case "pie":
				return ChartStage.pieChart(data.points);
			case "time-line":
				return ChartStage.timeLineChart(data.points);
			case "calendar":
				assertIsNonNull(calendarConfig);
				return ChartStage.calendarChart(data.points, calendarConfig);
			default:
				throw new Error(
					`[DEV] chartType "${type}" doesn't match data.kind "${data.kind}"`,
				);
		}
	}

	private static isEmpty(type: ChartType, data: ChartData): boolean {
		if (type === "calendar") return false;
		if (data.kind === "sunburst") return data.nodes.length === 0;
		if (data.kind === "graph") return data.graph.nodes.length === 0;
		return data.points.length === 0;
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
		config: CalendarConfig,
	): EChartsOption {
		const { range, cellSize } = config;
		const values = data.map((p) => p.y);
		const dataMin = values.length > 0 ? Math.min(...values) : 0;
		const dataMax = values.length > 0 ? Math.max(...values) : 1;
		return {
			calendar: {
				orient: "vertical",
				yearLabel: { show: false },
				dayLabel: { nameMap: ["S", "M", "T", "W", "T", "F", "S"] },
				monthLabel: { show: false },
				cellSize,
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

	private static scatterChart(data: ScatterPoint[]): EChartsOption {
		return {
			xAxis: { type: "value" },
			yAxis: { type: "value" },
			series: [
				{
					type: "scatter",
					data: data.map((p) => ({
						name: p.name,
						value: [p.x, p.y],
					})),
				},
			],
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

	private static withRootNode(graph: Graph): Graph {
		const gamesCategory = graph.categories.findIndex(
			(c) => c.name === GAMES_CATEGORY_NAME,
		);
		const games = graph.nodes.filter((n) => n.category === gamesCategory);
		const rootValue = games.reduce((sum, g) => sum + g.value, 0);

		const root = {
			id: GRAPH_ROOT_ID,
			name: GRAPH_ROOT_NAME,
			value: rootValue,
			category: graph.categories.length,
		};
		const rootEdges = games.map((g) => ({
			id: `${GRAPH_ROOT_ID}-${g.id}`,
			source: GRAPH_ROOT_ID,
			target: g.id,
		}));

		return {
			categories: [...graph.categories, { name: GRAPH_ROOT_NAME }],
			nodes: [root, ...graph.nodes],
			edges: [...rootEdges, ...graph.edges],
		};
	}

	private static graphChart(
		graph: Graph,
		config: GraphConfig,
	): EChartsOption {
		const { draggable, zoom, showLabels } = config;
		const labelIsDisplayed = showLabels;

		return {
			tooltip: { renderMode: "richText" },
			legend: [{ data: graph.categories.map((c) => c.name) }],
			series: [
				{
					type: "graph",
					layout: "force",
					roam: true,
					zoom,
					draggable,
					roamTrigger: "global",
					label: {
						show: labelIsDisplayed,
						position: "right",
						color: "#00FFF2",
						fontSize: 19,
					},
					force: {
						repulsion: 2000,
						edgeLength: [60, 160],
						gravity: 0.1,
					},
					emphasis: { focus: "adjacency" },
					lineStyle: { color: "source", curveness: 0 },
					data: graph.nodes.map((n) => ({
						id: n.id,
						name: n.name,
						value: n.value,
						symbolSize:
							n.id === GRAPH_ROOT_ID
								? ROOT_SYMBOL_SIZE
								: Math.min(
										MAX_SYMBOL_SIZE,
										MIN_SYMBOL_SIZE +
											n.value * SYMBOL_SIZE_SCALE,
									),
						category: n.category,
					})),
					links: graph.edges.map((e) => ({
						source: e.source,
						target: e.target,
					})),
					categories: graph.categories,
				},
			],
		};
	}
}
