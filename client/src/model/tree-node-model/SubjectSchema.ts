import { CONSTANTS } from "../../../shared/constants";
import { createTreeNodeSchema, TreeNodeShapeSchema } from "./TreeNodeSchema";
import z from "zod";

const timeSpentRegex = /^(?!00:00:00$)(00|0[1-9]|[1-9]\d+):[0-5]\d:[0-5]\d$/;

export const DeathSchema = z.object({
	id: z.string().length(8),
	parentID: z.string().length(8),
	timestamp: z.iso.datetime(),
	timestampRel: z.boolean(),
	remark: z
		.string()
		.max(CONSTANTS.NUMS.INPUT_MAX_LESSER, {
			error: CONSTANTS.ERROR.MAX_LENGTH,
		})
		.nullable(),
});

export const SubjectContextSchema = z.literal([
	"Boss",
	"Location",
	"Other",
	"Generic Enemy",
	"Mini Boss",
]);

const SubjectFieldsSchema = z.object({
	log: z.array(DeathSchema),
	reoccurring: z.boolean(),
	context: SubjectContextSchema,
	timeSpent: z
		.string()
		.nullable()
		.refine(
			(timeSpent) => {
				if (timeSpent != null) {
					return timeSpentRegex.test(timeSpent);
				}
				return true;
			},
			{ error: CONSTANTS.ERROR.TIMESPENT },
		),
});

export const SubjectShapeSchema = TreeNodeShapeSchema.extend({
	type: z.literal("subject"),
}).extend(SubjectFieldsSchema.shape);

export const createSubjectSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName)
		.extend({ type: z.literal("subject") })
		.extend(SubjectFieldsSchema.shape);
};

export type Subject = z.infer<ReturnType<typeof createSubjectSchema>>;
export type Death = z.infer<typeof DeathSchema>;
export type SubjectContext = z.infer<typeof SubjectContextSchema>;
export type SubjectCharacteristics = Pick<Subject, "reoccurring" | "context">;

/**
 * Differs from timeSpent field on subject schema, this is for the card editor which has slightly different model requirements. null -> `N / A`
 */
export const TimeSpentEditFormSchema = z.object({
	timeSpent: z.string().refine(
		(timeSpent) => {
			if (timeSpent != "N / A") {
				return timeSpentRegex.test(timeSpent);
			}
			return true;
		},
		{ error: CONSTANTS.ERROR.TIMESPENT },
	),
});
