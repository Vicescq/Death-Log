import {
	GamesFetchStage,
	ProfilesFetchStage,
	SubjectsFetchStage,
	DeathsFetchStage,
} from "./FetchStage";
import { NodeFilterStage } from "./FilterStage";
import type { Filters } from "../../pages/death-log/formSchemas";
import type { SortSettings } from "../../pages/death-log/formSchemas";
import type { EChartsOption } from "echarts";
import type { ChartMetaData } from "./options";

export type StatsQueryProcessType = "node" | "death";

export type QueryNodeType = "games" | "profiles" | "subjects" | "deaths";

export type NodeTypeToProcessType<T extends QueryNodeType> = T extends "deaths"
	? "death"
	: "node";

export type DeathFilters = {
	timestampRel: boolean;
	unreliableTimestamp: boolean;
};

export type DeathSortSettings = {
	sortingKey: "timestamp" | "remark";
	ascending: boolean;
};

export type ProcessTypeToFilterType<T extends StatsQueryProcessType> =
	T extends "death" ? DeathFilters : Filters;

export type ProcessTypeToSortSettingsType<T extends StatsQueryProcessType> =
	T extends "death" ? DeathSortSettings : SortSettings;

export type NodeQueryScope =
	| { type: "global" }
	| { type: "game"; ids: string[] }
	| { type: "profile"; ids: string[] }
	| { type: "group"; ids: string[] };

export type DeathQueryScope =
	| NodeQueryScope
	| { type: "subject"; ids: string[] };

type NodeQueryBase = {
	filter: Filters;
	searchQuery?: string;
	sort: SortSettings;
	limit?: number;
	chartMetaData: ChartMetaData;
};

export type GamesQuery = NodeQueryBase & {
	fetch: "games";
	scope: { type: "global" };
};

export type ProfilesQuery = NodeQueryBase & {
	fetch: "profiles";
	scope: { type: "global" } | { type: "game"; ids: string[] };
};

export type SubjectsQuery = NodeQueryBase & {
	fetch: "subjects";
	scope: NodeQueryScope;
};

export type NodeQuery = GamesQuery | ProfilesQuery | SubjectsQuery;

export type DeathQuery = {
	fetch: "deaths";
	scope: DeathQueryScope;
	filter: DeathFilters;
	searchQuery?: string;
	sort: DeathSortSettings;
	limit?: number;
	chartMetaData: ChartMetaData;
};

export type Query = NodeQuery | DeathQuery;

/**
 * Entry point for building stats queries
 *
 * Type-safe pipeline with restricted scope methods per node type:
 * - fetching("games") → GamesFetchStage (scopedGlobally or scopedByNone)
 * - fetching("profiles") → ProfilesFetchStage (scopedByGame or scopedGlobally)
 * - fetching("subjects") → SubjectsFetchStage (scopedByGame/Profile/Group or scopedGlobally)
 * - fetching("deaths") → DeathsFetchStage (scopedByGame/Profile/Group/Subject or scopedGlobally)
 *
 * Pipeline stages: Fetch → Scope → Filter → Sort → Chart
 * - Scoping is mandatory (use .scopedGlobally() for all data)
 * - Optional: call .limit(n) on ChartStage to limit results (-1 means no limit)
 *
 * @example
 * // All subjects in a game, rendered as bar chart
 * StatsQuery.fetching("subjects")
 *   .scopedByGame(["game1"])
 *   .filter(filters)
 *   .sort(sortSettings)
 *   .toBarChart()
 *
 * @example
 * // Top 10 subjects by deaths
 * StatsQuery.fetching("subjects")
 *   .scopedByGame(["game1"])
 *   .filter(filters)
 *   .sort(sortSettings)
 *   .limit(10)
 *   .toBarChart()
 *
 * @example
 * // All games globally
 * StatsQuery.fetching("games")
 *   .scopedGlobally()
 *   .filter(filters)
 *   .sort(sortSettings)
 *   .toBarChart()
 */
export class StatsQuery {
	static fetching(nodeType: "games"): GamesFetchStage;
	static fetching(nodeType: "profiles"): ProfilesFetchStage;
	static fetching(nodeType: "subjects"): SubjectsFetchStage;
	static fetching(nodeType: "deaths"): DeathsFetchStage;
	static fetching(
		nodeType: "games" | "profiles" | "subjects" | "deaths",
	):
		| GamesFetchStage
		| ProfilesFetchStage
		| SubjectsFetchStage
		| DeathsFetchStage {
		switch (nodeType) {
			case "games":
				return new GamesFetchStage();
			case "profiles":
				return new ProfilesFetchStage();
			case "subjects":
				return new SubjectsFetchStage();
			case "deaths":
				return new DeathsFetchStage();
		}
	}

	static query(q: Query): EChartsOption {
		if (q.fetch === "deaths") {
			const fetch = StatsQuery.fetching("deaths");
			const scope = q.scope;
			const filterStage =
				scope.type === "global"
					? fetch.scopedGlobally()
					: scope.type === "game"
						? fetch.scopedByGame(scope.ids)
						: scope.type === "profile"
							? fetch.scopedByProfile(scope.ids)
							: scope.type === "group"
								? fetch.scopedByGroup(scope.ids)
								: fetch.scopedBySubject(scope.ids);
			const sortStage = filterStage.filter(q.filter, q.searchQuery);
			const chartStage = sortStage.sort(q.sort);
			const limited =
				q.limit !== undefined ? chartStage.limit(q.limit) : chartStage;
			return limited.toHeatMapCalendar(q.chartMetaData);
		} else {
			const scope = q.scope;
			let filterStage: NodeFilterStage;

			if (q.fetch === "games") {
				filterStage = StatsQuery.fetching("games").scopedGlobally();
			} else if (q.fetch === "profiles") {
				const fetch = StatsQuery.fetching("profiles");
				filterStage =
					scope.type === "game"
						? fetch.scopedByGame(scope.ids)
						: fetch.scopedGlobally();
			} else {
				const fetch = StatsQuery.fetching("subjects");
				filterStage =
					scope.type === "global"
						? fetch.scopedGlobally()
						: scope.type === "game"
							? fetch.scopedByGame(scope.ids)
							: scope.type === "profile"
								? fetch.scopedByProfile(scope.ids)
								: fetch.scopedByGroup(scope.ids);
			}

			const sortStage = filterStage.filter(q.filter, q.searchQuery);
			const chartStage = sortStage.sort(q.sort);
			const limited =
				q.limit !== undefined ? chartStage.limit(q.limit) : chartStage;
			return limited.toBarChart(q.chartMetaData);
		}
	}
}
