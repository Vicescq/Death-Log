import type { Filters, SortSettings } from "../src/pages/death-log/formSchemas";
import type {
	DeathFilters,
	DeathQuery,
	DeathSortSettings,
	NodeQuery,
} from "../src/services/stats-query/StatsQuery";
import { isoToDateSTD } from "../src/utils/date";

export const defaultFilters: Filters = {
	uncompleted: true,
	completed: true,
	reoccurring: true,
	azRange: "A-Z",
	dateFrom: isoToDateSTD(new Date().toISOString()),
	dateTo: isoToDateSTD(new Date().toISOString()),
	dateRangeEnabled: false,
	deathRange: ">=0",
	reliableStart: true,
	unreliableStart: true,
	reliableEnd: true,
	unreliableEnd: true,
	notes: true,
	noNotes: true,
	timeSpent: true,
	noTimeSpent: true,
	boss: true,
	location: true,
	other: true,
	genericEnemy: true,
	miniBoss: true,
};

export const defaultSortSettings: SortSettings = {
	ascending: false,
	sortingKey: "created",
};

export const defaultDeathFilters: DeathFilters = {
	timestampRel: true,
	unreliableTimestamp: true,
};

export const defaultDeathSortSettings: DeathSortSettings = {
	ascending: false,
	sortingKey: "timestamp",
};

export const defaultEchartStyling: React.CSSProperties = {
	minHeight: "350px",
	height: "100%",
	width: "100%",
};

export const top10SubjectsMostDeathsQuery: NodeQuery = {
	fetch: "subjects",
	scope: { type: "global" },
	filter: defaultFilters,
	sort: { sortingKey: "deaths", ascending: false },
	limit: 10,
	chartMetaData: { title: "Top Deaths" },
};

export const allDeathsOnCalendarQuery: DeathQuery = {
	fetch: "deaths",
	scope: { type: "global" },
	filter: defaultDeathFilters,
	sort: defaultDeathSortSettings,
	chartMetaData: {},
};
