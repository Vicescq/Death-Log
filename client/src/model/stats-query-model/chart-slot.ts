import { z } from "zod";
import { QuerySchema } from "./query";

export const ChartSlotSchema = z.object({
	id: z.string().length(8),
	query: QuerySchema,
	displayed: z.boolean(),
});

export type ChartSlot = z.infer<typeof ChartSlotSchema>;
