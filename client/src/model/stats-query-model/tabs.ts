type StatsTabContext = {
	label: string;
	localPath: string;
};

export const STATS_TABS = [
	{
		label: "Overview",
		localPath: "/stats",
	},

	{
		label: "Calendar",
		localPath: "/stats/calendar",
	},
	{
		label: "Graph",
		localPath: "/stats/graph",
	},
	{
		label: "Specialized",
		localPath: "/stats/specialized",
	},
] as const satisfies readonly StatsTabContext[];

export type StatsTab = (typeof STATS_TABS)[number]["label"];

export type ChartTab = Exclude<StatsTab, "Graph" | "Calendar">;
