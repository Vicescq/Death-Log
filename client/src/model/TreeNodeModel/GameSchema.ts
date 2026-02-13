import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

const createGameSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("game"),
	});
};
type Game = z.infer<ReturnType<typeof createGameSchema>>;
