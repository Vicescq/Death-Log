import {
	defaultFilters,
	defaultDeathFilters,
	defaultDeathSortSettings,
	defaultSortSettings,
} from "../../../shared/defaults";
import type { NodeQuery, TimeLineNodeQuery } from "./types/node-query";
import type { HmcDeathQuery } from "./types/death-query";

export const top10SubjectsMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	scope: { type: "global" },
	filter: defaultFilters,
	sort: { sortingKey: "deaths", ascending: false },
	limit: 10,
	chartMetaData: { title: "Top Deaths" },
	chartType: "bar",
};

export const allDeathsOnCalendarQuery: HmcDeathQuery = {
	fetch: "deaths",
	scope: { type: "global" },
	filter: defaultDeathFilters,
	sort: defaultDeathSortSettings,
	chartMetaData: {},
	chartType: "hmc",
};

export const allSubjectDeathsOverTimeQuery: TimeLineNodeQuery = {
	fetch: "subjects",
	scope: { type: "global" },
	filter: defaultFilters,
	sort: { ...defaultSortSettings, ascending: true },
	chartMetaData: { title: "Subject Deaths Over Time" },
	chartType: "time-line",
	dateExtract: "start",
};
