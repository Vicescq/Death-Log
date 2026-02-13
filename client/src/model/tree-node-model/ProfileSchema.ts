import { CONSTANTS } from "../../../shared/constants";
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
	title: z.string().length(CONSTANTS.NUMS.INPUT_MAX_LESS),
	members: z.array(z.string()),
	description: z.string().length(CONSTANTS.NUMS.INPUT_MAX),
});

export type Profile = z.infer<ReturnType<typeof createProfileSchema>>;
export type ProfileGroup = z.infer<typeof ProfileGroupSchema>;
