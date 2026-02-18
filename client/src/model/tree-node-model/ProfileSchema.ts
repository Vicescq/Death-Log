import { CONSTANTS } from "../../../shared/constants";
import { formatString } from "../../utils/general";
import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

export const createProfileSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("profile"),
		groupings: z.array(ProfileGroupSchema),
	});
};

export const ProfileGroupSchema = z.object({
	id: z.string().length(8),
	title: z
		.string()
		.transform((title) => formatString(title))
		.pipe(z.string().length(CONSTANTS.NUMS.INPUT_MAX_LESS)),
	members: z.array(z.string()),
	description: z.string().length(CONSTANTS.NUMS.INPUT_MAX),
	dateStart: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }),
	dateEnd: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }).nullable(),
	dateStartRel: z.boolean(),
	dateEndRel: z.boolean(),
});

export type Profile = z.infer<ReturnType<typeof createProfileSchema>>;
export type ProfileGroup = z.infer<typeof ProfileGroupSchema>;
