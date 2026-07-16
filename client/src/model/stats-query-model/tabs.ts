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
		label: "Global Stats",
		localPath: "/stats/global",
	},
	{
		label: "Calendar",
		localPath: "/stats/calendar",
	},
	{
		label: "Graph",
		localPath: "/stats/graph",
	},
] as const satisfies readonly StatsTabContext[];

export type StatsTab = (typeof STATS_TABS)[number]["label"];

export type ChartTab = Exclude<
	StatsTab,
	"Graph" | "Calendar" | "Global Stats"
>;
