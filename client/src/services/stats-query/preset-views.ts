import type { StatsView } from "../../model/StatsViewSchema";
import type { ChartSpec } from "../../model/stats-query-model/chart-spec";

const TOP_5_GAMES_BY_DEATHS: ChartSpec = {
	type: "pie",
	dimension: "games",
	measure: { measure: "deaths", aggregate: "count" },
	sort: { axis: "y", dir: "desc" },
	lim: 5,
	title: "Top 5 Games by Deaths",
};

const DEATH_CALENDAR: ChartSpec = {
	type: "calendar",
	dimension: "timestampDeath",
	measure: { measure: "deaths", aggregate: "count" },
	sort: { axis: "y", dir: "asc" },
	title: "Death Calendar",
};

const INSUFFICIENT_PROBE: ChartSpec = {
	type: "bar",
	dimension: "games",
	measure: { measure: "deaths", aggregate: "count" },
	sort: { axis: "y", dir: "desc" },
	title: "Insufficient Probe (minDataPoints 9999)",
	minDataPoints: 9999,
};

export const BASE_DEFAULT_VIEW: StatsView = {
	id: "default0",
	charts: [
		{ id: "default0", spec: TOP_5_GAMES_BY_DEATHS, displayed: true },
		{ id: "default1", spec: INSUFFICIENT_PROBE, displayed: true },
		{ id: "default2", spec: DEATH_CALENDAR, displayed: true },
	],
	name: "General View",
	description: "The default, general case charts to be displayed.",
	source: "default",
};
