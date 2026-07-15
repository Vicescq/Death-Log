import type {
	CalendarQuery,
	GraphQuery,
	Query,
} from "../../model/stats-query-model/query";

export const PRESET_CHARTS: Query[] = [
	{
		id: "deaths-by-game-profile-subject",
		tab: "Overview",
		title: "Deaths by Game / Profile / Subject",
		description:
			"Deaths broken down by game, then profile, then subject. Only the top 5 games and the biggest contributors within each are shown; the rest are rolled up into an Other slice.",
		method: "deathsBySunburst",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	},

	{
		id: "top-5-bosses-by-deaths",
		tab: "Overview",
		title: "Top 5 Bosses (Deaths)",
		description: "Your five deadliest bosses, ranked by death count.",
		method: "bossDeathsBySubject",
		chartType: "pie",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "top-10-games-by-deaths",
		tab: "Overview",
		title: "Top 10 Games (Deaths)",
		description: "Your ten deadliest games, ranked by total death count.",
		method: "deathsByGame",
		chartType: "bar",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "deaths-by-context",
		tab: "Overview",
		title: "Deaths by Context",
		description:
			"Total deaths grouped by subject context (Boss, Location, etc.), sorted alphabetically.",
		method: "deathsByContext",
		chartType: "bar",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "cumulative-deaths-over-time",
		tab: "Overview",
		title: "Cumulative Deaths Over Time",
		description: "Your running total of deaths, one step per death.",
		method: "deathsCumulative",
		chartType: "time-line",
		scope: [],
		reliability: { isTemporal: true, field: "timestamp" },
	},
	{
		id: "top-30-recent-completed-subjects",
		tab: "Overview",
		title: "Top 30 Most Recently Completed",
		description:
			"Your thirty most recently completed subjects, ranked by deaths.",
		method: "deathsByRecentCompleted",
		chartType: "line",
		scope: [],
		reliability: { isTemporal: true, field: "dateEnd" },
	},
	{
		id: "top-10-games-by-subject-count",
		tab: "Overview",
		title: "Top 10 Games (Subject Count)",
		description: "Your ten games with the most tracked subjects.",
		method: "subjectCountByGame",
		chartType: "pie",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "deaths-vs-time-spent",
		tab: "Overview",
		title: "Deaths vs. Time Spent",
		description: "Each subject plotted by death count against time spent.",
		method: "deathsVsTimeSpent",
		chartType: "scatter",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "top-5-profiles-by-deaths",
		tab: "Overview",
		title: "Top 5 Profiles (Deaths)",
		description: "Your five deadliest profiles, ranked by death count.",
		method: "deathsByProfile",
		chartType: "bar",
		scope: [],
		reliability: { isTemporal: false },
	},
	{
		id: "deaths-by-profile-group-subject",
		tab: "Overview",
		title: "Deaths by Profile Group / Subject",
		description:
			"Deaths broken down by profile group, then subject. Only the top 5 groups and the biggest contributors within each are shown; the rest are rolled up into an Other slice.",
		method: "deathsByProfileGroup",
		chartType: "sunburst",
		scope: [],
		reliability: { isTemporal: false },
	},
];

export const GRAPH_QUERY = {
	id: "graph",
	title: "Graph",
	description: "",
	method: "graph",
	chartType: "graph",
	scope: [],
	reliability: { isTemporal: false },
} satisfies Omit<GraphQuery, "draggable" | "zoom" | "showLabels">;

export const CALENDAR_QUERY = {
	id: "deaths-by-day",
	title: "Deaths by Day",
	description:
		"Total deaths per day, shown as a calendar heatmap. Darker cells mean more deaths that day; use the month picker to navigate.",
	method: "deathsByDay",
	chartType: "calendar",
	scope: [],
	reliability: { isTemporal: true, field: "timestamp" },
} satisfies Omit<CalendarQuery, "range" | "cellSize">;
