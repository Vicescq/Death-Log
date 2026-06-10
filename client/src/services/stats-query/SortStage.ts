import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { sort as deathLogSort } from "../../pages/death-log/utils";
import type { SortSettings } from "../../pages/death-log/formSchemas";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import { NodeChartStage, DeathChartStage } from "./ChartStage";
import type { DeathSortSettings } from "./StatsQuery";

export class NodeSortStage {
	private data: DistinctTreeNode[];

	constructor(data: DistinctTreeNode[]) {
		this.data = data;
	}

	sort(sortSettings: SortSettings): NodeChartStage {
		const tree = useDeathLogStore.getState().tree;
		const nodeIDs = this.data.map((n) => n.id);
		const sortedIDs = deathLogSort(nodeIDs, tree, sortSettings);
		const nodeMap = new Map(this.data.map((n) => [n.id, n]));
		const sortedData = sortedIDs
			.map((id) => nodeMap.get(id))
			.filter((node): node is DistinctTreeNode => node !== undefined);
		return new NodeChartStage(sortedData);
	}
}

export class DeathSortStage {
	private data: Death[];

	constructor(data: Death[]) {
		this.data = data;
	}

	sort(sortSettings: DeathSortSettings): DeathChartStage {
		function determineSortOrder(x: number, y: number): number {
			if (sortSettings.ascending) {
				return x - y;
			} else {
				return y - x;
			}
		}

		const sortedData = this.data.toSorted((a, b) => {
			switch (sortSettings.sortingKey) {
				case "timestamp":
					return determineSortOrder(
						new Date(a.timestamp).getTime(),
						new Date(b.timestamp).getTime(),
					);
				case "remark":
					const remarkA = a.remark || "";
					const remarkB = b.remark || "";
					if (remarkA < remarkB) {
						return determineSortOrder(0, 1);
					} else if (remarkA > remarkB) {
						return determineSortOrder(1, 0);
					} else {
						return determineSortOrder(0, 0);
					}
			}
		});

		return new DeathChartStage(sortedData);
	}
}
