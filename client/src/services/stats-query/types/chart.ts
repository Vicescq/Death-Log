export type ChartMetaData = {
	title?: string;
	range?: string;
	visualMap?: {
		min?: number;
		max?: number;
	};
};

export type SimpleChartData = {
	x: string;
	y: number;
};

export type TimeChartData = [string, number];
