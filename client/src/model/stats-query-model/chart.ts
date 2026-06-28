import type { ChartSpec } from "./chart-spec";
import type { ChartTab } from "./tabs";

export type ChartSlot = {
	id: string;
	tab: ChartTab;
	spec: ChartSpec;
};

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

export type ChartData =
	| { kind: "category"; points: CategoryPoint[] }
	| { kind: "sunburst"; nodes: SunburstNode[] };

export type DeathRow = {
	id: string;
	timestampLocal: string;
	timestampRel: boolean;
	remark: string | null;
	subjectID: string;
	subjectName: string;
	subjectContext: string;
	profileID: string;
	profileName: string;
	gameID: string;
	gameName: string;
};

export type SubjectRow = {
	id: string;
	name: string;
	context: string;
	dateStartLocal: string;
	dateStartRel: boolean;
	dateEndLocal: string | null;
	dateEndRel: boolean;
	timeSpent: string | null;
	completed: boolean;
	reoccurring: boolean;
	profileID: string;
	profileName: string;
	gameID: string;
	gameName: string;
	deaths: number;
	timeSpentMins: number;
};

export type Tables = {
	deaths: DeathRow[];
	subjects: SubjectRow[];
};
