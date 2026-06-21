import type { ChartSpec } from "./chart-spec";

export const STATS_TABS = ["overview", "specialized"] as const;

export type StatsTab = (typeof STATS_TABS)[number];

export type ChartSlot = {
	id: string;
	tab: StatsTab;
	spec: ChartSpec;
};
