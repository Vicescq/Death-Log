import type { CategoryPoint, SunburstNode, ScatterPoint } from "./chart";
import type { StatsTab } from "./chart-slot";
import type { ChartType } from "./chart-spec";

// all listed due to C# typing system
export type SharedChartSpec = {
	type: ChartType;
	title: string;
	data: {
		category?: CategoryPoint[];
		sunburst?: SunburstNode[];
		scatter?: ScatterPoint[];
	};
};

export type SharedChartSlot = {
	id: string;
	tab: StatsTab;
	spec: SharedChartSpec;
};

export type SharedProfile = {
	chartSlots: SharedChartSlot[];
	// treemap: null;
	// nodemap: null;
};
