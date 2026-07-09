import type { Tree } from "../../model/tree-node-model/TreeNodeSchema";
import type { ChartData } from "../../model/stats-query-model/chart";
import type { Query } from "../../model/stats-query-model/query";
import LocalDB from "../LocalDB";
import {
	deathsByContext,
	deathsByGame,
	deathsByProfile,
} from "./collection-methods/bar";
import {
	bossDeathsBySubject,
	subjectCountByGame,
} from "./collection-methods/pie";
import { deathsByRecentCompleted } from "./collection-methods/line";
import { deathsByDay } from "./collection-methods/calendar";
import { deathsCumulative } from "./collection-methods/time-line";
import { deathsVsTimeSpent } from "./collection-methods/scatter";
import {
	deathsByProfileGroup,
	deathsBySunburst,
} from "./collection-methods/sunburst";
import { graph } from "./collection-methods/graph";
import type { CollectFn } from "./collection-methods/types";

export class CollectionStage {
	private static METHODS: Record<string, CollectFn> = {
		bossDeathsBySubject,
		deathsByContext,
		deathsByDay,
		deathsByGame,
		deathsByProfile,
		deathsByProfileGroup,
		deathsByRecentCompleted,
		deathsBySunburst,
		deathsCumulative,
		deathsVsTimeSpent,
		graph,
		subjectCountByGame,
	};

	static collect(query: Query, tree: Tree): ChartData {
		const includeUnreliable = query.reliability.isTemporal
			? (LocalDB.getChartOverride(query.id).showUnreliable ?? false)
			: true;
		const method = CollectionStage.METHODS[query.method];
		if (!method)
			throw new Error(`[DEV] unknown collection method: ${query.method}`);

		return method(query, tree, includeUnreliable);
	}
}
