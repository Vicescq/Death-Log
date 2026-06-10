import type { EChartsOption } from "echarts";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { calcDeaths } from "../../pages/death-log/utils";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import { createBarChartOptions } from "./options";

export class NodeChartStage {
	private data: DistinctTreeNode[];

	constructor(data: DistinctTreeNode[]) {
		this.data = data;
	}

	limit(count: number): NodeChartStage {
		const limitedData = count < 0 ? this.data : this.data.slice(0, count);
		return new NodeChartStage(limitedData);
	}

	toBarChart(): EChartsOption {
		const tree = useDeathLogStore.getState().tree;
		const chartData = this.data.map((node) => ({
			deaths: calcDeaths(node, tree),
			name: node.name,
		}));
		return createBarChartOptions(chartData);
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
}
export type BarChartData = {
	deaths: number;
	name: string;
};

