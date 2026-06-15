import { createTreeNodeSchema, TreeNodeShapeSchema } from "./TreeNodeSchema";
import z from "zod";

export const GameShapeSchema = TreeNodeShapeSchema.extend({
	type: z.literal("game"),
});

export const createGameSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("game"),
	});
};

export type Game = z.infer<ReturnType<typeof createGameSchema>>;
