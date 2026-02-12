import { NodeFormSchema } from "../card-editor/schema";
import z from "zod";

export const AddFormSchema = NodeFormSchema.pick({
	name: true,
	context: true,
	reoccurring: true,
});

export type AddForm = z.infer<typeof AddFormSchema>;
