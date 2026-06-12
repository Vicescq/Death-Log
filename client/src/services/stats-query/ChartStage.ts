import type { EChartsOption } from "echarts";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { calcDeaths } from "../../pages/death-log/utils";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import {
	createBarChartOptions,
	createHeatMapCalendarOptions,
	type BarChartData,
	type ChartMetaData,
	type HeatMapCalendarChartData,
} from "./options";
import { isoToDateSTD } from "../../utils/date";

export class NodeChartStage {
	private data: DistinctTreeNode[];

	constructor(data: DistinctTreeNode[]) {
		this.data = data;
	}

	limit(count: number): NodeChartStage {
		const limitedData = count < 0 ? this.data : this.data.slice(0, count);
		return new NodeChartStage(limitedData);
	}

	toBarChart(metaData: ChartMetaData): EChartsOption {
		const tree = useDeathLogStore.getState().tree;
		const chartData: BarChartData[] = this.data.map((node) => ({
			x: node.name,
			y: calcDeaths(node, tree),
		}));
		return createBarChartOptions(chartData, metaData);
	}
}

export class DeathChartStage {
	private data: Death[];

	constructor(data: Death[]) {
		this.data = data;
	}

	limit(count: number): DeathChartStage {
		const limitedData = count < 0 ? this.data : this.data.slice(0, count);
		return new DeathChartStage(limitedData);
	}

	/**
	 * Requires range meta data
	 * @param metaData
	 * @returns
	 */
	toHeatMapCalendar(metaData: ChartMetaData): EChartsOption {
		const dayToDeathCountMap: Record<string, number> = {};
		for (let i = 0; i < this.data.length; i++) {
			const death = this.data[i];
			const date = isoToDateSTD(death.timestamp);
			if (Object.hasOwn(dayToDeathCountMap, date)) {
				dayToDeathCountMap[date] += 1;
			} else {
				dayToDeathCountMap[date] = 1;
			}
		}
		const heatMapCalendarDataset: HeatMapCalendarChartData[] = [];
		for (const key of Object.keys(dayToDeathCountMap)) {
			heatMapCalendarDataset.push([key, dayToDeathCountMap[key]]);
		}

		const values = heatMapCalendarDataset.map((item) => item[1]);
		const dataMin = values.length > 0 ? Math.min(...values) : 0;
		const dataMax = values.length > 0 ? Math.max(...values) : 1;
		return createHeatMapCalendarOptions(heatMapCalendarDataset, {
			...metaData,
			visualMap: { min: dataMin, max: dataMax },
		});
	}
}
