import {
	GamesFetchStage,
	ProfilesFetchStage,
	SubjectsFetchStage,
	DeathsFetchStage,
} from "./FetchStage";
import type { Filters } from "../../pages/death-log/formSchemas";
import type { SortSettings } from "../../pages/death-log/formSchemas";

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
}
