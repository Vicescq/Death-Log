import z from "zod";
import { CONSTANTS } from "../../../../shared/constants";

export const EditDeathFormSchema = z.object({
	remark: z.string().max(CONSTANTS.NUMS.DEATH_REMARK_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	date: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	time: z.iso.time({ precision: 0, error: CONSTANTS.ERROR.TIME }),
	timestampRel: z.literal(["T", "F"]),
});

export const DeathCounterFormSchema = EditDeathFormSchema.pick({
	remark: true,
	timestampRel: true,
});

export type EditDeathForm = z.infer<typeof EditDeathFormSchema>;
export type DeathCounterForm = z.infer<typeof DeathCounterFormSchema>;
