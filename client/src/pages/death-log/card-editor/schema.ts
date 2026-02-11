import z from "zod";
import { CONSTANTS } from "../../../../shared/constants";
import { dateTimeSTDToISO } from "../utils/dateUtils";

export const NodeFormSchema = z
	.object({
		name: z
			.string()
			.max(CONSTANTS.NUMS.INPUT_MAX, {
				error: CONSTANTS.ERROR.MAX_LENGTH,
			})
			.min(1, { error: CONSTANTS.ERROR.EMPTY }),
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
	})
	.refine(
		(schema) => {
			if (schema.dateEnd) {
				return (
					Date.parse(schema.dateStart) <= Date.parse(schema.dateEnd)
				);
			} else {
				return (
					Date.parse(schema.dateStart) <=
					Date.parse(new Date().toISOString())
				);
			}
		},
		{ error: CONSTANTS.ERROR.DATE, path: ["dateStart"] },
	)
	.refine(
		(schema) => {
			if (schema.dateEnd) {
				// console.log("S:", new Date(Date.parse(schema.dateStart)).toISOString())
				// console.log("E:", new Date(Date.parse(schema.dateEnd)).toISOString())
				// console.log("T:", new Date().toISOString())
				return (
					Date.parse(schema.dateStart) <=
						Date.parse(schema.dateEnd) &&
					Date.parse(schema.dateEnd) <=
						Date.parse(new Date().toISOString())
				);
			} else {
				return true;
			}
		},
		{ error: CONSTANTS.ERROR.DATE, path: ["dateEnd"] },
	)
	.refine(
		(schema) => {
			if (schema.dateEnd && schema.timeEnd) {
				const timeStartCompare = dateTimeSTDToISO(
					schema.dateStart,
					schema.timeStart,
				);
				const timeEndCompare = dateTimeSTDToISO(
					schema.dateEnd,
					schema.timeEnd,
				);
				const isSameDay =
					Date.parse(schema.dateStart) == Date.parse(schema.dateEnd);
				return (
					isSameDay &&
					Date.parse(timeStartCompare) <= Date.parse(timeEndCompare)
				);
			}
			return true;
		},
		{ error: CONSTANTS.ERROR.TIME, path: ["timeStart"] },
	);

export type NodeForm = z.infer<typeof NodeFormSchema>;
