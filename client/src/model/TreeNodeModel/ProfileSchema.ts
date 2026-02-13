import { CONSTANTS } from "../../../shared/constants";
import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

const createProfileSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("profile"),
		groupings: z.array(ProfileGroupSchema),
	});
};
const ProfileGroupSchema = z.object({
	title: z.string().length(CONSTANTS.NUMS.INPUT_MAX_LESS),
	members: z.array(z.string()),
	description: z.string().length(CONSTANTS.NUMS.INPUT_MAX),
});
type Profile = z.infer<ReturnType<typeof createProfileSchema>>;
type ProfileGroup = z.infer<typeof ProfileGroupSchema>;
