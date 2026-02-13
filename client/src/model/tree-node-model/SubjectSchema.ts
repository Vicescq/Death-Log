import { CONSTANTS } from "../../../shared/constants";
import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

export const createSubjectSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("subject"),
		log: z.array(DeathSchema),
		reoccurring: z.boolean(),
		context: SubjectContextSchema,
		timeSpent: z.string().nullable(),
	});
};

export const DeathSchema = z.object({
	id: z.string().length(8),
	parentID: z.string().length(8),
	timestamp: z.iso.datetime(),
	timestampRel: z.boolean(),
	remark: z.string().length(CONSTANTS.NUMS.INPUT_MAX_LESS).nullable(),
});

export const SubjectContextSchema = z.literal([
	"Boss",
	"Location",
	"Other",
	"Generic Enemy",
	"Mini Boss",
]);

export type Subject = z.infer<ReturnType<typeof createSubjectSchema>>;
export type Death = z.infer<typeof DeathSchema>;
export type SubjectContext = z.infer<typeof SubjectContextSchema>;
export type SubjectCharacteristics = Pick<Subject, "reoccurring" | "context">;
