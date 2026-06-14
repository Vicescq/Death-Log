import type { XAXisOption } from "echarts/types/dist/shared";

type EChartsAxisType = "value" | "category" | "time" | "log";

export type EChartsConfig = {
	range?: string;
	visualMap?: {
		min?: number;
		max?: number;
	};
	xAxis?: {
		type?: EChartsAxisType;
	};
	yAxis?: {
		type?: EChartsAxisType;
	};
};

export type CategoryPoint = {
	x: string;
	y: number;
	meta?: string;
};

export type SunburstNode = {
	name: string;
	value: number;
	children?: SunburstNode[];
};

export type ScatterPoint = {
	name: string;
	x: number;
	y: number;
};
