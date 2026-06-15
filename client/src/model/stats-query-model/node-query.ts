import { z } from "zod";
import { FiltersSchema, SortSchema } from "../formSchemas";
import { EChartsConfigSchema } from "./chart";
import { NodeQueryScopeSchema } from "./scope";
import { QueryLimitSchema } from "./limit";

const NodeQueryChartConfigSchema = z.union([
    z.object({ extract: z.literal("nodeDeaths"), chartType: z.literal("bar") }),
    z.object({ extract: z.literal("nodeDeaths"), chartType: z.literal("pie") }),
    z.object({ extract: z.literal("nodeDeaths"), chartType: z.literal("line") }),
    z.object({
        extract: z.literal("nodeTimeline"),
        dateExtract: z.union([z.literal("start"), z.literal("end")]),
        chartType: z.literal("time-line"),
    }),
    z.object({
        extract: z.literal("hierarchy"),
        chartType: z.literal("sunburst"),
        maxDepth: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        topN: z.number(),
        threshold: z.number(),
    }),
    z.object({ extract: z.literal("nodeScatter"), chartType: z.literal("scatter") }),
]);

const NodeQueryBaseSchema = z.object({
    title: z.string(),
    filter: FiltersSchema,
    searchQuery: z.string().optional(),
    sort: SortSchema,
    limit: QueryLimitSchema.optional(),
    echartsConfig: EChartsConfigSchema,
    minDataPoints: z.number().optional(),
});

export const GamesQuerySchema = NodeQueryBaseSchema.extend({
    fetch: z.literal("games"),
    scope: z.object({ type: z.literal("global") }),
}).and(NodeQueryChartConfigSchema);

export const ProfilesQuerySchema = NodeQueryBaseSchema.extend({
    fetch: z.literal("profiles"),
    scope: z.union([
        z.object({ type: z.literal("global") }),
        z.object({ type: z.literal("game"), ids: z.array(z.string()) }),
    ]),
}).and(NodeQueryChartConfigSchema);

export const SubjectsQuerySchema = NodeQueryBaseSchema.extend({
    fetch: z.literal("subjects"),
    scope: NodeQueryScopeSchema,
}).and(NodeQueryChartConfigSchema);

export const NodeQuerySchema = z.union([
    GamesQuerySchema,
    ProfilesQuerySchema,
    SubjectsQuerySchema,
]);

export type GamesQuery = z.infer<typeof GamesQuerySchema>;
export type ProfilesQuery = z.infer<typeof ProfilesQuerySchema>;
export type SubjectsQuery = z.infer<typeof SubjectsQuerySchema>;
export type NodeQuery = z.infer<typeof NodeQuerySchema>;

export type BarNodeQuery = Extract<NodeQuery, { chartType: "bar" }>;
export type LineNodeQuery = Extract<NodeQuery, { chartType: "line" }>;
export type TimeLineNodeQuery = Extract<NodeQuery, { chartType: "time-line" }>;
export type SunburstNodeQuery = Extract<NodeQuery, { chartType: "sunburst" }>;
export type ScatterNodeQuery = Extract<NodeQuery, { chartType: "scatter" }>;
