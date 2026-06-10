import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { filter as deathLogFilter } from "../../pages/death-log/utils";
import type { Filters } from "../../pages/death-log/formSchemas";
import type { DistinctTreeNode } from "../../model/tree-node-model/TreeNodeSchema";
import type { Death } from "../../model/tree-node-model/SubjectSchema";
import { NodeSortStage } from "./SortStage";
import type { DeathFilters } from "./StatsQuery";
import { DeathSortStage } from "./SortStage";

export class NodeFilterStage {
	private data: DistinctTreeNode[];

	constructor(data: DistinctTreeNode[]) {
		this.data = data;
	}

	filter(filters: Filters, searchQuery: string = ""): NodeSortStage {
		const tree = useDeathLogStore.getState().tree;
		const nodeIDs = this.data.map((n) => n.id);
		const filteredIDs = deathLogFilter(nodeIDs, filters, tree, searchQuery);
		const filteredData = this.data.filter((n) => filteredIDs.includes(n.id));
		return new NodeSortStage(filteredData);
	}
}

export class DeathFilterStage {
	private data: Death[];

	constructor(data: Death[]) {
		this.data = data;
	}

	filter(filters: DeathFilters, searchQuery: string = ""): DeathSortStage {
		const filteredData = this.data.filter((death) => {
			const relFlagBoolVals: boolean[] = [];

			for (let key in filters) {
				const filterKey = key as keyof DeathFilters;

				switch (filterKey) {
					case "timestampRel":
						relFlagBoolVals.push(
							(filters[filterKey] ?? false) && death.timestampRel,
						);
						break;
					case "unreliableTimestamp":
						relFlagBoolVals.push(
							(filters[filterKey] ?? false) &&
								!death.timestampRel,
						);
						break;
				}
			}

			return (
				(!death.remark ||
					death.remark
						.toLowerCase()
						.includes(searchQuery.toLowerCase())) &&
				(relFlagBoolVals.length === 0 ||
					relFlagBoolVals.some((bool) => bool))
			);
		});

		return new DeathSortStage(filteredData);
	}
}
