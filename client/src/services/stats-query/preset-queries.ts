import {
	defaultStatsFilters,
	defaultStatsDeathFilters,
	defaultStatsSortSettings,
	defaultStatsDeathSortSettings,
} from "../../../shared/defaults";
import type {
	NodeQuery,
	ScatterNodeQuery,
	SunburstNodeQuery,
} from "./types/node-query";
import type { DeathQuery, HmcDeathQuery } from "./types/death-query";

export const top10SubjectsMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	title: "Top 10 Subjects (Deaths)",
	scope: { type: "global" },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	limit: { count: 10, dir: "end" },
	echartsConfig: { xAxis: { type: "value" }, yAxis: { type: "category" } },
	extract: "nodeDeaths",
	chartType: "bar",
};

export const allDeathsOnCalendarQuery: HmcDeathQuery = {
	fetch: "deaths",
	title: "Death Calendar",
	scope: { type: "global" },
	filter: defaultStatsDeathFilters,
	sort: defaultStatsDeathSortSettings,
	echartsConfig: {},
	extract: "deathsByDay",
	chartType: "hmc",
};

export const top10GamesMostDeathsQuery: NodeQuery = {
	fetch: "games",
	title: "Top 10 Games (Deaths)",
	scope: { type: "global" },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	limit: { count: 10, dir: "end" },
	echartsConfig: {},
	extract: "nodeDeaths",
	chartType: "bar",
};

export const cumulationDeathsOverTimeQuery: DeathQuery = {
	fetch: "deaths",
	title: "Deaths Over Time",
	scope: { type: "global" },
	filter: defaultStatsDeathFilters,
	sort: { sortingKey: "timestamp", ascending: true },
	echartsConfig: {},
	extract: "deathsCumulative",
	chartType: "time-line",
};

export const deathHierarchyQuery: SunburstNodeQuery = {
	fetch: "games",
	title: "Top Death Sources",
	scope: { type: "global" },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	limit: { count: 5, dir: "end" },
	echartsConfig: {},
	extract: "hierarchy",
	chartType: "sunburst",
	maxDepth: 3,
	topN: 3,
	threshold: 0.5,
};

export const subjectsDeathsVsTimeQuery: ScatterNodeQuery = {
	fetch: "subjects",
	title: "Deaths vs Time Spent",
	scope: { type: "global" },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	echartsConfig: {},
	extract: "nodeScatter",
	chartType: "scatter",
	minDataPoints: 5,
};

export const testNoDataQuery: NodeQuery = {
	fetch: "subjects",
	title: "[Test] No Data",
	scope: { type: "profile", ids: [] },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	echartsConfig: {},
	extract: "nodeDeaths",
	chartType: "bar",
};

export const top5BossesMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	title: "Top 5 Bosses (Deaths)",
	scope: { type: "global" },
	filter: {
		...defaultStatsFilters,
		location: false,
		genericEnemy: false,
		other: false,
		miniBoss: false,
	},
	sort: defaultStatsSortSettings,
	limit: { count: 5, dir: "end" },
	echartsConfig: {},
	extract: "nodeDeaths",
	chartType: "pie",
};
