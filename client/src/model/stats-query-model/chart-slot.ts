import { z } from "zod";
import { ChartSpecSchema } from "./chart-spec";

export const ChartSlotSchema = z.object({
	id: z.string().length(8),
	spec: ChartSpecSchema,
	displayed: z.boolean(),
});

export type ChartSlot = z.infer<typeof ChartSlotSchema>;
