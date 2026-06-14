import type {
	Filters,
	SortSettings,
} from "../../../pages/death-log/formSchemas";
import type { EChartsConfig } from "./chart";
import type { NodeQueryScope } from "./scope";
import type { QueryLimit } from "./limit";

type NodeQueryChartConfig =
	| { extract: "nodeDeaths"; chartType: "bar" }
	| { extract: "nodeDeaths"; chartType: "pie" }
	| { extract: "nodeDeaths"; chartType: "line" }
	| {
			extract: "nodeTimeline";
			dateExtract: "start" | "end";
			chartType: "time-line";
	  }
	| {
			extract: "hierarchy";
			chartType: "sunburst";
			maxDepth: 1 | 2 | 3;
			/** Minimum 1. Per-level cap on how many children to expand. */
			topN: number;
			/** 0–1. Stop expanding children once cumulative coverage reaches this proportion. 1 = no early stop. */
			threshold: number;
	  }
	| { extract: "nodeScatter"; chartType: "scatter" };

type NodeQueryBase = {
	title: string;
	filter: Filters;
	searchQuery?: string;
	sort: SortSettings;
	limit?: QueryLimit;
	echartsConfig: EChartsConfig;
	/** Minimum number of scoped nodes required before filters run. Charts below this threshold show "Not enough data." */
	minDataPoints?: number;
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
export type SunburstNodeQuery = Extract<NodeQuery, { chartType: "sunburst" }>;
export type ScatterNodeQuery = Extract<NodeQuery, { chartType: "scatter" }>;
