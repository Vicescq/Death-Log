import type { Query } from "../../model/stats-query-model/sql";

export const top10SubjectsMostDeathsQuery: Query = {
	case: "flat",
	title: "Top 10 Subjects (Deaths)",
	chartType: "bar",
	echartsConfig: { xAxis: { type: "value" }, yAxis: { type: "category" } },
	sql: "SELECT * FROM (SELECT subjectName as x, COUNT(*) as y FROM ? GROUP BY subjectName ORDER BY y DESC LIMIT 10) ORDER BY y ASC",
};

export const top10GamesMostDeathsQuery: Query = {
	case: "flat",
	title: "Top 10 Games (Deaths)",
	chartType: "bar",
	echartsConfig: {},
	sql: "SELECT * FROM (SELECT gameName as x, COUNT(*) as y FROM ? GROUP BY gameName ORDER BY y DESC LIMIT 10) ORDER BY y ASC",
};

export const top5BossesMostDeathsQuery: Query = {
	case: "flat",
	title: "Top 5 Bosses (Deaths)",
	chartType: "pie",
	echartsConfig: {},
	sql: "SELECT subjectName as x, COUNT(*) as y FROM ? WHERE subjectContext = 'Boss' GROUP BY subjectName ORDER BY y DESC LIMIT 5",
};

export const allDeathsOnCalendarQuery: Query = {
	case: "calendar",
	title: "Death Calendar",
	echartsConfig: {},
	includeUnreliableTimestamp: false,
};

export const cumulationDeathsOverTimeQuery: Query = {
	case: "flat",
	title: "Deaths Over Time",
	chartType: "time-line",
	transform: "cumulative",
	sql: "SELECT datetime as x, COUNT(*) as y FROM ? GROUP BY datetime ORDER BY x",
	echartsConfig: {},
	includeUnreliableTimestamp: false,
};

export const deathHierarchyQuery: Query = {
	case: "hierarchy",
	title: "Top Death Sources",
	echartsConfig: {},
	topN: 3,
	threshold: 0.5,
	maxDepth: 3,
};

export const abcdef: Query = {
	case: "flat",
	title: "subject count over time",
	chartType: "time-line",
	transform: "cumulative",
	sql: "SELECT datetime as x, COUNT(*) as y FROM ? GROUP BY datetime ORDER BY x",
	echartsConfig: {},
	includeUnreliableTimestamp: false,
};