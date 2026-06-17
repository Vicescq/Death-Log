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
	id: "custom00",
	charts: [{ id: "default3", preset: top10SubjectsMostDeathsQuery }],
	name: "Test Custom View",
	description: "Hard coded custom view",
	source: "custom",
};

export const baseDefaultView: StatsView = {
	id: "default1",
	charts: [
		{ id: "default1", preset: allDeathsOnCalendarQuery },
		{ id: "default2", preset: top10GamesMostDeathsQuery },
		{ id: "default3", preset: top10SubjectsMostDeathsQuery },
		{ id: "default4", preset: cumulationDeathsOverTimeQuery },
		{ id: "default5", preset: top5BossesMostDeathsQuery },
		{ id: "default6", preset: deathHierarchyQuery },
	],
	name: "Default",
	description: "The default charts to be displayed.",
	source: "default",
};
