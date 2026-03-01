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
		.pipe(
			z
				.string()
				.max(CONSTANTS.NUMS.INPUT_MAX_LESSER, {
					error: CONSTANTS.ERROR.MAX_LENGTH,
				})
				.min(1, {
					error: CONSTANTS.ERROR.EMPTY,
				}),
		),
	members: z.array(z.string()),
	description: z.string().max(CONSTANTS.NUMS.TEXTAREA_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	dateStart: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }),
	dateEnd: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }).nullable(),
	dateStartRel: z.boolean(),
	dateEndRel: z.boolean(),
});

export type Profile = z.infer<ReturnType<typeof createProfileSchema>>;
export type ProfileGroup = z.infer<typeof ProfileGroupSchema>;
