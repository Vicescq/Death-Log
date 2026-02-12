import z from "zod";
import { CONSTANTS } from "../../../shared/constants";
import { formatString } from "../../stores/utils";
import { dateTimeSTDToISO } from "./utils/dateUtils";

const createBaseNodeFormSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return z.object({
		name: z
			.string()
			.max(CONSTANTS.NUMS.INPUT_MAX, {
				error: CONSTANTS.ERROR.MAX_LENGTH,
			})
			.refine((name) => formatString(name) != "", {
				error: CONSTANTS.ERROR.EMPTY,
			})
			.refine(
				(name) => {
					const formattedName = formatString(name);
					if (currEditingName == null) {
						return !siblingNames.includes(formattedName);
					} else {
						let isUnique = true;
						siblingNames.forEach((name) => {
							if (
								name != currEditingName &&
								name == formattedName
							) {
								isUnique = false;
							}
						});
						return isUnique;
					}
				},
				{
					error: CONSTANTS.ERROR.NON_UNIQUE,
				},
			),
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
};

export const createNodeFormEditSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	const BaseNodeFormSchema = createBaseNodeFormSchema(
		siblingNames,
		currEditingName,
	);

	const NodeFormEditSchema = BaseNodeFormSchema.superRefine((schema, ctx) => {
		if (schema.dateEnd && schema.timeEnd) {
			// have to put this due to superRefine() firing even if date iso validation in BaseNodeFormSchema produces an error
			if (
				!schema.dateStart ||
				!schema.dateEnd ||
				!schema.timeStart ||
				!schema.timeEnd
			)
				return;

			// have to do this because schema.date (YYYY:MM:DD) has an implcit timezone which is binded to the user where Date.parse does not know about. Need to transform that date into UTC iso string then pass it to .parse()
			const parsedUTCdateStart = Date.parse(
				dateTimeSTDToISO(schema.dateStart, "00:00:00"),
			);
			const parsedUTCdateEnd = Date.parse(
				dateTimeSTDToISO(schema.dateEnd, "00:00:00"),
			);

			if (parsedUTCdateStart > parsedUTCdateEnd) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATE_START_SURPASSED_END,
					path: ["dateStart"],
				});
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATE_START_SURPASSED_END,
					path: ["dateEnd"],
				});
			}

			if (parsedUTCdateEnd > Date.now()) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATE_SURPASSED_TODAY,
					path: ["dateEnd"],
				});
			}
		} else {
			const parsedUTCdateStart = Date.parse(
				dateTimeSTDToISO(schema.dateStart, "00:00:00"),
			);
			if (parsedUTCdateStart > Date.now()) {
				ctx.addIssue({
					code: "custom",
					message: CONSTANTS.ERROR.DATE_SURPASSED_TODAY,
					path: ["dateStart"],
				});
			}
		}
	});

	return NodeFormEditSchema;
};

export const createNodeFormAddSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	const BaseNodeFormSchema = createBaseNodeFormSchema(
		siblingNames,
		currEditingName,
	);
	const NodeFormAddSchema = BaseNodeFormSchema.pick({
		name: true,
		context: true,
		reoccurring: true,
	});
	return NodeFormAddSchema;
};

export type NodeFormEdit = z.infer<ReturnType<typeof createNodeFormEditSchema>>;
export type NodeFormAdd = z.infer<ReturnType<typeof createNodeFormAddSchema>>;
