import { z } from "zod";
import { NodeQuerySchema } from "./node-query";
import { DeathQuerySchema } from "./death-query";
import type { EChartsOption } from "echarts";

export type { QueryLimit } from "./limit";

export const QuerySchema = z.union([NodeQuerySchema, DeathQuerySchema]);

export type Query = z.infer<typeof QuerySchema>;

export type QueryResult =
    | { status: "ok"; option: EChartsOption }
    | { status: "no-data" }
    | { status: "insufficient"; minDataPoints: number; option: EChartsOption };
