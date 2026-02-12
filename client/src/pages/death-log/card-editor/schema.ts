import z from "zod";
import { CONSTANTS } from "../../../../shared/constants";
import { formatString } from "../../../stores/utils";

export const NodeFormSchema = z.object({
	name: z
		.string()
		.max(CONSTANTS.NUMS.INPUT_MAX, {
			error: CONSTANTS.ERROR.MAX_LENGTH,
		})
		.refine((name) => formatString(name) != "", {
			error: CONSTANTS.ERROR.EMPTY,
		}),
	dateStart: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	timeStart: z.iso.time({ precision: 0, error: CONSTANTS.ERROR.TIME }),
	startRel: z.boolean(),
	dateEnd: z.iso.date({ error: CONSTANTS.ERROR.DATE }).nullable(),
	timeEnd: z.iso
		.time({ precision: 0, error: CONSTANTS.ERROR.TIME })
		.nullable(),
	endRel: z.boolean(),
	notes: z.string().max(CONSTANTS.NUMS.TEXTAREA_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),

	// only subjects use these
	reoccurring: z.boolean(),
	context: z.string(),
});

export type NodeForm = z.infer<typeof NodeFormSchema>;
