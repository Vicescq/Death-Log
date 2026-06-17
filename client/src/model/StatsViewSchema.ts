import { z } from "zod";
import { CONSTANTS } from "../../shared/constants";
import { ChartSlotSchema } from "./stats-query-model/chart-slot";

export const StatsViewSchema = z.object({
	id: z.string().length(8),
	name: z
		.string()
		.max(CONSTANTS.NUMS.INPUT_MAX, { error: CONSTANTS.ERROR.MAX_LENGTH })
		.min(1, { error: CONSTANTS.ERROR.EMPTY }),
	description: z
		.string()
		.max(CONSTANTS.NUMS.TEXTAREA_MAX, {
			error: CONSTANTS.ERROR.MAX_LENGTH,
		}),
	charts: z.array(ChartSlotSchema).min(1),
	source: z.literal(["default", "custom"]),
});

export type StatsView = z.infer<typeof StatsViewSchema>;
