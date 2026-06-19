import { z } from "zod";
import { EChartsConfigSchema } from "./chart";
import type { EChartsOption } from "echarts";

const QueryBaseSchema = z.object({
	title: z.string(),
	echartsConfig: EChartsConfigSchema,
	minDataPoints: z.number().optional(),
	includeUnreliableTimestamp: z.boolean().optional(),
});

export const QuerySchema = z.discriminatedUnion("case", [
	QueryBaseSchema.extend({
		case: z.literal("flat"),
		sql: z.string(),
		from: z.literal(["deaths", "subjects"]).optional(),
		chartType: z.literal(["bar", "line", "pie", "time-line", "calendar"]),
		transform: z.literal(["cumulative", "calendar"]).optional(),
	}),
	QueryBaseSchema.extend({
		case: z.literal("hierarchy"),
		chartType: z.literal(["sunburst"]),
		topN: z.number(),
		threshold: z.number(),
		maxDepth: z.literal([1, 2, 3]),
	}),
]);

export type Query = z.infer<typeof QuerySchema>;

export type QueryResult =
	| { status: "ok"; option: EChartsOption }
	| { status: "no-data" }
	| { status: "insufficient"; minDataPoints: number; option: EChartsOption };
