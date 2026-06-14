import type { EChartsConfig } from "./chart";
import type { DeathQueryScope } from "./scope";
import type { QueryLimit } from "./limit";

export type DeathFilters = {
	timestampRel: boolean;
	unreliableTimestamp: boolean;
};

export type DeathSortSettings = {
	sortingKey: "timestamp" | "remark";
	ascending: boolean;
};

type DeathQueryBase = {
	fetch: "deaths";
	title: string;
	scope: DeathQueryScope;
	filter: DeathFilters;
	searchQuery?: string;
	sort: DeathSortSettings;
	limit?: QueryLimit;
	echartsConfig: EChartsConfig;
	/** Minimum number of scoped deaths required before filters run. Charts below this threshold show "Not enough data." */
	minDataPoints?: number;
};

type DeathQueryChartConfig =
	| { extract: "deathsByDay"; chartType: "hmc" }
	| { extract: "deathsCumulative"; chartType: "time-line" };

export type DeathQuery = DeathQueryBase & DeathQueryChartConfig;

export type HmcDeathQuery = Extract<DeathQuery, { chartType: "hmc" }>;
export type TimeLineDeathQuery = Extract<DeathQuery, { chartType: "time-line" }>;
