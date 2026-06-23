import type { CategoryPoint, ScatterPoint, SunburstNode } from "./chart";

export const CHART_TYPES = [
	"bar",
	"pie",
	"line",
	"time-line",
	"calendar",
	"sunburst",
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

export type WhenReliable =
	| "timestampRel = TRUE"
	| "dateStartRel = TRUE"
	| "dateEndRel = TRUE"
	| "dateStartRel = TRUE AND dateEndRel = TRUE";

export type SunburstPrune = {
	mode: "topN" | "threshold" | "both";
	topN: number;
	threshold: number;
	showOther?: boolean;
};

export type SunburstLevel = {
	prune?: SunburstPrune;
};

export type ChartSpec = {
	type: ChartType;
	title: string;
	table: "deaths" | "subjects";
	sql: string;
	cumulative?: boolean; // time line
	minDataPoints?: number;
	levels?: SunburstLevel[]; // sunburst
	whenReliable?: WhenReliable; // enables the {{REL}} swap + settings toggle
};
