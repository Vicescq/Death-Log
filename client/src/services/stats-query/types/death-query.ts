import type { ChartMetaData } from "./chart";
import type { DeathQueryScope } from "./scope";

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
	scope: DeathQueryScope;
	filter: DeathFilters;
	searchQuery?: string;
	sort: DeathSortSettings;
	limit?: number;
	chartMetaData: ChartMetaData;
};

export type DeathQuery =
	| (DeathQueryBase & { chartType: "hmc" })
	| (DeathQueryBase & { chartType: "line" });

export type HmcDeathQuery = Extract<DeathQuery, { chartType: "hmc" }>;
export type LineDeathQuery = Extract<DeathQuery, { chartType: "line" }>;
