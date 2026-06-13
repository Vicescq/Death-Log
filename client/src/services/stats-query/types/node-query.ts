import type {
	Filters,
	SortSettings,
} from "../../../pages/death-log/formSchemas";
import type { EChartsConfig } from "./chart";
import type { NodeQueryScope } from "./scope";
import type { QueryLimit } from "./limit";

type NodeQueryChartConfig =
	| { extract: "nodeDeaths"; chartType: "bar" | "pie" }
	| { extract: "nodeDeaths"; chartType: "line" }
	| {
			extract: "nodeTimeline";
			dateExtract: "start" | "end";
			chartType: "time-line";
	  };

type NodeQueryBase = {
	title: string;
	filter: Filters;
	searchQuery?: string;
	sort: SortSettings;
	limit?: QueryLimit;
	echartsConfig: EChartsConfig;
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
