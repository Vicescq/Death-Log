import z from "zod";

export const CHART_TYPES = [
	"bar",
	"pie",
	"line",
	"time-line",
	"calendar",
	"sunburst",
	"graph",
	"scatter",
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

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

export const ChartDataSchema = z.discriminatedUnion("kind", [
	z.object({
		kind: z.literal("category"),
		points: z.array(CategoryPointSchema),
	}),
	z.object({
		kind: z.literal("scatter"),
		points: z.array(ScatterPointSchema),
	}),
	z.object({ kind: z.literal("graph"), graph: GraphSchema }),
	z.object({
		kind: z.literal("sunburst"),
		nodes: z.array(SunburstNodeSchema),
	}),
]);

export type ChartData = z.infer<typeof ChartDataSchema>;
