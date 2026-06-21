export type CategoryPoint = {
	x: string;
	y: number;
};

export type SunburstNode = {
	name: string;
	value: number;
	children: SunburstNode[];
};

export type ScatterPoint = {
	name: string;
	x: number;
	y: number;
};
