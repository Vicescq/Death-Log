import type { Tree } from "../../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../../model/stats-query-model/chart";
import type { Query } from "../../../model/stats-query-model/query";

export type CollectFn = (
	query: Query,
	tree: Tree,
	includeUnreliable: boolean,
) => ChartData;
