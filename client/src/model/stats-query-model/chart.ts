import { z } from "zod";

const EChartsAxisTypeSchema = z.union([
    z.literal("value"),
    z.literal("category"),
    z.literal("time"),
    z.literal("log"),
]);

export const EChartsConfigSchema = z.object({
    range: z.string().optional(),
    visualMap: z.object({
        min: z.number().optional(),
        max: z.number().optional(),
    }).optional(),
    xAxis: z.object({ type: EChartsAxisTypeSchema.optional() }).optional(),
    yAxis: z.object({ type: EChartsAxisTypeSchema.optional() }).optional(),
});

export type EChartsConfig = z.infer<typeof EChartsConfigSchema>;

// Computed output types — never persisted, no Zod needed
export type CategoryPoint = {
    x: string;
    y: number;
    meta?: string;
};

export type SunburstNode = {
    name: string;
    value: number;
    children?: SunburstNode[];
};

export type ScatterPoint = {
    name: string;
    x: number;
    y: number;
};
