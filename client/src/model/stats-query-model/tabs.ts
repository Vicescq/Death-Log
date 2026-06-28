type StatsTabContext = {
	label: string;
	localPath: string;
	sharedPath: string;
};

export const STATS_TABS = [
	{
		label: "Overview",
		localPath: "/stats",
		sharedPath: "/profiles/:username/stats",
	},
	{
		label: "Specialized",
		localPath: "/stats/specialized",
		sharedPath: "/profiles/:username/stats/specialized",
	},
	{
		label: "Browse Profiles",
		localPath: "/stats/browse-profiles",
		sharedPath: "/profiles/:username/stats/browse-profiles",
	},
] as const satisfies readonly StatsTabContext[];

export type StatsTab = (typeof STATS_TABS)[number]["label"];

export type ChartTab = Exclude<StatsTab, "Browse Profiles">;
