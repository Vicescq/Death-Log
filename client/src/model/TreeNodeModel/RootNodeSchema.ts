import { createTreeNodeSchema } from "./TreeNodeSchema";
import z from "zod";

const createRootNodeSchema = (
	siblingNames: string[],
	currEditingName: string | null,
) => {
	return createTreeNodeSchema(siblingNames, currEditingName).extend({
		type: z.literal("ROOT_NODE"),
	});
};
type RootNode = z.infer<ReturnType<typeof createRootNodeSchema>>;
