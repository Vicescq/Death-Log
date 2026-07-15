import z from "zod";

export const CrudStateSchema = z.object({
	count: z.number(),
	lastBackup: z.number(),
	autoBackup: z.boolean(),
	contributeStats: z.boolean(),
});

export type CrudState = z.infer<typeof CrudStateSchema>;

export const DEFAULT_CRUD_STATE: CrudState = {
	count: 0,
	lastBackup: 0,
	autoBackup: false,
	contributeStats: true,
};
