import { z } from "zod";
import { QuerySchema } from "./sql";

export const ChartSlotSchema = z.object({
	id: z.string().length(8),
	preset: QuerySchema,
});

export type ChartSlot = z.infer<typeof ChartSlotSchema>;
