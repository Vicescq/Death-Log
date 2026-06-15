import { z } from "zod";
import { EChartsConfigSchema } from "./chart";
import { DeathQueryScopeSchema } from "./scope";
import { QueryLimitSchema } from "./limit";

export const DeathFiltersSchema = z.object({
    timestampRel: z.boolean(),
    unreliableTimestamp: z.boolean(),
});

export const DeathSortSettingsSchema = z.object({
    sortingKey: z.union([z.literal("timestamp"), z.literal("remark")]),
    ascending: z.boolean(),
});

const DeathQueryBaseSchema = z.object({
    fetch: z.literal("deaths"),
    title: z.string(),
    scope: DeathQueryScopeSchema,
    filter: DeathFiltersSchema,
    searchQuery: z.string().optional(),
    sort: DeathSortSettingsSchema,
    limit: QueryLimitSchema.optional(),
    echartsConfig: EChartsConfigSchema,
    minDataPoints: z.number().optional(),
});

const DeathQueryChartConfigSchema = z.union([
    z.object({ extract: z.literal("deathsByDay"), chartType: z.literal("hmc") }),
    z.object({ extract: z.literal("deathsCumulative"), chartType: z.literal("time-line") }),
]);

export const DeathQuerySchema = DeathQueryBaseSchema.and(DeathQueryChartConfigSchema);

export type DeathFilters = z.infer<typeof DeathFiltersSchema>;
export type DeathSortSettings = z.infer<typeof DeathSortSettingsSchema>;
export type DeathQuery = z.infer<typeof DeathQuerySchema>;

export type HmcDeathQuery = Extract<DeathQuery, { chartType: "hmc" }>;
export type TimeLineDeathQuery = Extract<DeathQuery, { chartType: "time-line" }>;
