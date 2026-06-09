import type { EChartsOption } from "echarts";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { assertIsGame, assertIsNonNull } from "../../utils/asserts";
import { calcDeaths, sort } from "../death-log/utils";
import type { SortSettings } from "../death-log/formSchemas";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";

type BarChartData = {
	deaths: number;
	name: string;
};

/**
 * Collects some type of node (game, profile, subject) from a specific parent, and filters and sorts them
 * @param sortSettings
 * @returns
 */
export function collectNodes(sortSettings: SortSettings): DistinctTreeNode[] {
	const tree = useDeathLogStore.getState().tree;
	const gameIDs = tree.get("ROOT_NODE")?.childIDS.map((id) => id);
	assertIsNonNull(gameIDs);
	const sortedGameIDs = sort(gameIDs, tree, sortSettings);

	const games = sortedGameIDs.map((id) => {
		const game = tree.get(id);
		assertIsNonNull(game);
		assertIsGame(game);
		return game;
	});

	return games;
}

export function toBarChartData(data: DistinctTreeNode[]): BarChartData[] {
	const tree = useDeathLogStore.getState().tree;
	return data.map((data) => ({
		deaths: calcDeaths(data, tree),
		name: data.name,
	}));
}

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

export function createPieChartOptions(data: BarChartData[]): EChartsOption {
	return {
		tooltip: { trigger: "item", renderMode: "richText" },
		series: [
			{
				type: "pie",
				radius: "50%",
				data: data.map((obj) => ({
					name: obj.name,
					value: obj.deaths,
				})),
				emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0 } },
			},
		],
		title: { text: "Deaths Distribution" },
	};
}

export function createLineChartOptions(data: BarChartData[]): EChartsOption {
	return {
		tooltip: { trigger: "axis", renderMode: "richText" },
		xAxis: {
			type: "category",
			data: data.map((obj) => obj.name),
		},
		yAxis: { type: "value" },
		series: [
			{
				type: "line",
				data: data.map((obj) => obj.deaths),
				smooth: true,
				itemStyle: { borderRadius: 10 },
			},
		],
		title: { text: "Death Trends" },
	};
}
