import z from "zod";
import { CONSTANTS } from "../../../../shared/constants";
import { isoToDateSTD } from "../utils/dateUtils";

export const EditDeathFormSchema = z.object({
	remark: z.string().max(CONSTANTS.NUMS.DEATH_REMARK_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	date: z.iso.date({ error: CONSTANTS.ERROR.DATE }).refine(
		(isoDate) => {
			const today = isoToDateSTD(new Date().toISOString());
			return Date.parse(isoDate) <= Date.parse(today);
		},
		{
			error: CONSTANTS.ERROR.TODAY,
		},
	),
	time: z.iso.time({ precision: 0, error: CONSTANTS.ERROR.TIME }),
	timestampRel: z.literal(["T", "F"]),
});

export const DeathCounterFormSchema = EditDeathFormSchema.pick({
	remark: true,
	timestampRel: true,
});

export type EditDeathForm = z.infer<typeof EditDeathFormSchema>;
export type DeathCounterForm = z.infer<typeof DeathCounterFormSchema>;
