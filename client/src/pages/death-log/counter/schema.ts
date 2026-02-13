import z from "zod";
import { CONSTANTS } from "../../../../shared/constants";
import { dateTimeSTDToISO } from "../../../utils/date";

const BaseEditDeathFormSchema = z.object({
	remark: z.string().max(CONSTANTS.NUMS.INPUT_MAX_LESS, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	date: z.iso.date({ error: CONSTANTS.ERROR.DATE }),
	time: z.iso.time({ precision: 0, error: CONSTANTS.ERROR.TIME }),
	timestampRel: z.literal(["T", "F"]),
});

export const DeathCounterFormSchema = BaseEditDeathFormSchema.pick({
	remark: true,
	timestampRel: true,
});

export const EditDeathFormSchema = BaseEditDeathFormSchema.superRefine(
	(schema, ctx) => {
		const parsedUTCdateTime = Date.parse(
			dateTimeSTDToISO(schema.date, schema.time),
		);

		if (parsedUTCdateTime > Date.now()) {
			ctx.addIssue({
				code: "custom",
				message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
				path: ["date"],
			});
			ctx.addIssue({
				code: "custom",
				message: CONSTANTS.ERROR.DATETIME_SURPASSED_TODAY,
				path: ["time"],
			});
		}
	},
);

export type EditDeathForm = z.infer<typeof EditDeathFormSchema>;
export type DeathCounterForm = z.infer<typeof DeathCounterFormSchema>;
