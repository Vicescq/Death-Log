import type { ChartTab } from "./tabs";
import type { ChartType } from "./chart";

// game|profile|subject|profileGroup. [] = global (whole tree).
export type Scope = string[];

export type ReliabilityField =
	| "timestamp"
	| "dateStart"
	| "dateEnd"
	| "dateStartAndEnd";

export type ReliabilityConfig =
	| { isTemporal: true; field: ReliabilityField }
	| { isTemporal: false };

type QueryBase = {
	id: string;
	tab?: ChartTab;
	title: string;
	description: string;
	method: string;
	scope: Scope;
	reliability: ReliabilityConfig;
};

export type CalendarQuery = QueryBase & {
	chartType: "calendar";
	range?: string;
	cellSize?: number;
};

export type StandardQuery = QueryBase & {
	chartType: Exclude<ChartType, "calendar">;
};

export type Query = CalendarQuery | StandardQuery;
