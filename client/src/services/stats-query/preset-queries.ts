import {
	defaultStatsFilters,
	defaultStatsDeathFilters,
	defaultStatsSortSettings,
	defaultStatsDeathSortSettings,
} from "../../../shared/defaults";
import type { NodeQuery, TimeLineNodeQuery } from "./types/node-query";
import type { DeathQuery, HmcDeathQuery } from "./types/death-query";

export const top10SubjectsMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	title: "Top 10 Subject Deaths",
	scope: { type: "global" },
	filter: defaultStatsFilters,
	sort: defaultStatsSortSettings,
	limit: { count: 10, dir: "end" },
	echartsConfig: {},
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
	title: "Games with the most Deaths",
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
	title: "Cumulation of Deaths Over Time",
	scope: { type: "global" },
	filter: defaultStatsDeathFilters,
	sort: { sortingKey: "timestamp", ascending: true },
	echartsConfig: {},
	extract: "deathsCumulative",
	chartType: "time-line",
};

export const top5BossesMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	title: "Top 5 Bosses with the most Deaths",
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
