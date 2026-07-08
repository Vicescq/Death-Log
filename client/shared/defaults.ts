import type { Filters, SortSettings } from "../src/model/formSchemas";
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
	groupIDs: [],
};

export const defaultSortSettings: SortSettings = {
	ascending: false,
	sortingKey: "created",
};

export const defaultEchartStyling: React.CSSProperties = {
	minHeight: "400px",
	height: "100%",
	width: "100%",
};
