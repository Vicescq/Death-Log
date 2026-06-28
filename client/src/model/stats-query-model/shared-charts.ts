import type { CategoryPoint, SunburstNode, ScatterPoint } from "./chart";
import type { ChartType } from "./chart-spec";
import type { ChartTab } from "./tabs";

// all listed due to C# typing system
export type SharedChartSpec = {
	type: ChartType;
	title: string; // owner's timezone is baked in for temporal charts
	calendarRange?: string;
	data: {
		category?: CategoryPoint[];
		sunburst?: SunburstNode[];
		scatter?: ScatterPoint[];
	};
};

export type SharedChartSlot = {
	id: string;
	tab: ChartTab;
	spec: SharedChartSpec;
};

export type SharedProfile = {
	chartSlots: SharedChartSlot[];
	// treemap: null;
	// nodemap: null;
};
