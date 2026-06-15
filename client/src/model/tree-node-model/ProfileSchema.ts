import { CONSTANTS } from "../../../shared/constants";
import { formatString, validateNameUniqueness } from "../../utils/general";
import { createTreeNodeSchema, TreeNodeShapeSchema } from "./TreeNodeSchema";
import z from "zod";

export const ProfileGroupShapeSchema = z.object({
	id: z.string().length(8),
	title: z
		.string()
		.max(CONSTANTS.NUMS.INPUT_MAX, {
			error: CONSTANTS.ERROR.MAX_LENGTH,
		})
		.min(1, {
			error: CONSTANTS.ERROR.EMPTY,
		}),
	members: z.array(z.string()),
	description: z.string().max(CONSTANTS.NUMS.TEXTAREA_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	dateStart: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }),
	dateEnd: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }).nullable(),
	dateStartRel: z.boolean(),
	dateEndRel: z.boolean(),
	completed: z.boolean(),
});

export const ProfileShapeSchema = TreeNodeShapeSchema.extend({
	type: z.literal("profile"),
	groupings: z.array(ProfileGroupShapeSchema),
});

export const createProfileSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("profile"),
		groupings: z.array(
			createProfileGroupSchema(siblingNames, currEditingName),
		),
	});
};

export const createProfileGroupSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) =>
	ProfileGroupShapeSchema.extend({
		title: z
			.string()
			.transform((title) => formatString(title))
			.pipe(
				z
					.string()
					.max(CONSTANTS.NUMS.INPUT_MAX, {
						error: CONSTANTS.ERROR.MAX_LENGTH,
					})
					.min(1, {
						error: CONSTANTS.ERROR.EMPTY,
					}),
			)
			.refine(
				(title) =>
					validateNameUniqueness(
						title,
						siblingNames,
						currEditingName,
					),
				{ error: CONSTANTS.ERROR.NON_UNIQUE },
			),
	});

export type Profile = z.infer<ReturnType<typeof createProfileSchema>>;
export type ProfileGroup = z.infer<ReturnType<typeof createProfileGroupSchema>>;
