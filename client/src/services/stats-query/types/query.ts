import type { NodeQuery } from "./node-query";
import type { DeathQuery } from "./death-query";
import type { EChartsOption } from "echarts";

export type { QueryLimit } from "./limit";

export type Query = NodeQuery | DeathQuery;

export type QueryResult =
    | { status: "ok"; option: EChartsOption }
    | { status: "no-data" }
    | { status: "insufficient"; minDataPoints: number; option: EChartsOption };
