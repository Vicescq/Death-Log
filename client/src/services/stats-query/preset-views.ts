import type { StatsView } from "../../model/StatsViewSchema";
import {
	allDeathsOnCalendarQuery,
	top10GamesMostDeathsQuery,
	top10SubjectsMostDeathsQuery,
	cumulationDeathsOverTimeQuery,
	top5BossesMostDeathsQuery,
	deathHierarchyQuery,
} from "./preset-queries";

export const customViewTest: StatsView = {
	id: "custom_0",
	charts: [
		{
			id: "default3",
			query: top10SubjectsMostDeathsQuery,
			displayed: true,
		},
		{ id: "default5", query: deathHierarchyQuery, displayed: true },
		{ id: "default1", query: top10GamesMostDeathsQuery, displayed: true },
	],
	name: "Test Custom View",
	description: "Hard coded custom view",
	source: "custom",
};

export const baseDefaultView: StatsView = {
	id: "default0",
	charts: [
		{ id: "default0", query: allDeathsOnCalendarQuery, displayed: true },
		{ id: "default1", query: top10GamesMostDeathsQuery, displayed: true },
		{
			id: "default2",
			query: top10SubjectsMostDeathsQuery,
			displayed: true,
		},
		{
			id: "default3",
			query: cumulationDeathsOverTimeQuery,
			displayed: true,
		},
		{ id: "default4", query: top5BossesMostDeathsQuery, displayed: true },
		{ id: "default5", query: deathHierarchyQuery, displayed: true },
	],

	name: "General View",
	description: "The default, general case charts to be displayed.",
	source: "default",
};
