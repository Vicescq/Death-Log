import { CONSTANTS } from "../../../shared/constants";
import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

const createSubjectSchema = (
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

const DeathSchema = z.object({
	id: z.string().length(8),
	parentID: z.string().length(8),
	timestamp: z.iso.datetime(),
	timestampRel: z.boolean(),
	remark: z.string().length(CONSTANTS.NUMS.INPUT_MAX_LESS).nullable(),
});

const SubjectContextSchema = z.literal([
	"Boss",
	"Location",
	"Other",
	"Generic Enemy",
	"Mini Boss",
]);

type Subject = z.infer<ReturnType<typeof createSubjectSchema>>;
type Death = z.infer<typeof DeathSchema>;
type SubjectContext = z.infer<typeof SubjectContextSchema>;
type SubjectCharacteristics = Pick<Subject, "reoccurring" | "context">;
