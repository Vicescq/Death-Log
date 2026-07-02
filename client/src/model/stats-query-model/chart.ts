import z from "zod";
import type { ChartSpec } from "./chart-spec";
import type { ChartTab } from "./tabs";

export type ChartSlot = {
	id: string;
	tab: ChartTab;
	spec: ChartSpec;
};

export const CategoryPointSchema = z.object({ x: z.string(), y: z.number() });
export type CategoryPoint = z.infer<typeof CategoryPointSchema>;

export type SunburstNode = {
	name: string;
	value: number;
	children: SunburstNode[];
};
export const SunburstNodeSchema: z.ZodType<SunburstNode> = z.lazy(() =>
	z.object({
		name: z.string(),
		value: z.number(),
		children: z.array(SunburstNodeSchema),
	}),
);

export const ScatterPointSchema = z.object({
	name: z.string(),
	x: z.number(),
	y: z.number(),
});
export type ScatterPoint = z.infer<typeof ScatterPointSchema>;

export const GraphNodeSchema = z.object({
	id: z.string(),
	name: z.string(),
	value: z.number(),
	symbolSize: z.number(),
	category: z.number().min(0),
});

export const GraphEdgeSchema = z.object({
	id: z.string(),
	source: z.string(),
	target: z.string(),
});

export const GraphSchema = z.object({
	nodes: z.array(GraphNodeSchema),
	edges: z.array(GraphEdgeSchema),
	categories: z.array(z.object({ name: z.string() })),
});
export type Graph = z.infer<typeof GraphSchema>;

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
