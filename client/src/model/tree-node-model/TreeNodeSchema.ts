import z from "zod";
import { CONSTANTS } from "../../../shared/constants";
import { formatString, validateNameUniqueness } from "../../utils/general";
import type { Game } from "./GameSchema";
import type { Profile } from "./ProfileSchema";
import type { RootNode } from "./RootNodeSchema";
import type { Subject } from "./SubjectSchema";

export const TreeNodeShapeSchema = z.object({
	type: z.literal(["game", "profile", "subject", "ROOT_NODE"]),
	id: z.string().length(8),
	parentID: z.string(),
	childIDS: z.array(z.string()),
	name: z
		.string()
		.max(CONSTANTS.NUMS.INPUT_MAX, {
			error: CONSTANTS.ERROR.MAX_LENGTH,
		})
		.min(1, {
			error: CONSTANTS.ERROR.EMPTY,
		}),
	completed: z.boolean(),
	notes: z.string().max(CONSTANTS.NUMS.TEXTAREA_MAX, {
		error: CONSTANTS.ERROR.MAX_LENGTH,
	}),
	dateStart: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }),
	dateEnd: z.iso.datetime({ error: CONSTANTS.ERROR.DATE }).nullable(),
	dateStartRel: z.boolean(),
	dateEndRel: z.boolean(),
	isFake: z.boolean(),
});

export const createTreeNodeSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return TreeNodeShapeSchema.extend({
		name: z
			.string()
			.transform((name) => formatString(name))
			.pipe(
				z
					.string()
					.max(CONSTANTS.NUMS.INPUT_MAX, {
						error: CONSTANTS.ERROR.MAX_LENGTH,
					})
					.min(1, {
						error: CONSTANTS.ERROR.EMPTY,
					})
					.refine(
						(name) =>
							validateNameUniqueness(
								name,
								siblingNames,
								currEditingName,
							),
						{
							error: CONSTANTS.ERROR.NON_UNIQUE,
						},
					),
			),
	});
};

export type TreeNode = z.infer<ReturnType<typeof createTreeNodeSchema>>;
export type DistinctTreeNode = Game | Profile | Subject | RootNode;
export type Tree = Map<string, DistinctTreeNode>;
