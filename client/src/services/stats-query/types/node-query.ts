import type { Filters, SortSettings } from "../../../pages/death-log/formSchemas";
import type { ChartMetaData } from "./chart";
import type { NodeQueryScope } from "./scope";

type NodeQueryChartConfig =
	| { chartType: "bar" }
	| { chartType: "line" }
	| { chartType: "time-line"; dateExtract: "start" | "end" };

type NodeQueryBase = {
	filter: Filters;
	searchQuery?: string;
	sort: SortSettings;
	limit?: number;
	chartMetaData: ChartMetaData;
} & NodeQueryChartConfig;

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

export type BarNodeQuery = Extract<NodeQuery, { chartType: "bar" }>;
export type LineNodeQuery = Extract<NodeQuery, { chartType: "line" }>;
export type TimeLineNodeQuery = Extract<NodeQuery, { chartType: "time-line" }>;
