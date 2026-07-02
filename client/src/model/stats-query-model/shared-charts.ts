import z from "zod";
import {
	CategoryPointSchema,
	SunburstNodeSchema,
	ScatterPointSchema,
} from "./chart";
import { CHART_TYPES } from "./chart-spec";

const SharedChartSpecSchema = z.object({
	type: z.enum(CHART_TYPES),
	title: z.string(), // owner's timezone is baked in for temporal charts
	calendarRange: z.string().optional(),
	data: z.object({
		category: z.array(CategoryPointSchema).nullish(),
		sunburst: z.array(SunburstNodeSchema).nullish(),
		scatter: z.array(ScatterPointSchema).nullish(),
	}),
});
export type SharedChartSpec = z.infer<typeof SharedChartSpecSchema>;

const SharedChartSlotSchema = z.object({
	id: z.string(),
	tab: z.enum(["Overview", "Specialized"]),
	spec: SharedChartSpecSchema,
});
export type SharedChartSlot = z.infer<typeof SharedChartSlotSchema>;

export type SharedProfile = {
	chartSlots: SharedChartSlot[];
};

export const SharedProfileViewSchema = z.object({
	followerCount: z.number(),
	followingCount: z.number(),
	chartSlots: z.array(SharedChartSlotSchema),
});
export type SharedProfileView = z.infer<typeof SharedProfileViewSchema>;
