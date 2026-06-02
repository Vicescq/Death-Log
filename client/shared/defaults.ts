import type { Filters } from "../src/pages/death-log/formSchemas";
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
};
