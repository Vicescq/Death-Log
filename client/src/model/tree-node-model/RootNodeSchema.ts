import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

export const createRootNodeSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("ROOT_NODE"),
	});
};

export type RootNode = z.infer<ReturnType<typeof createRootNodeSchema>>;
