import z from "zod";

export const CloudBackupSummarySchema = z.object({
	id: z.number(),
	date: z.string(),
	sizeBytes: z.number(),
	version: z.number(),
	auto: z.boolean(),
});

export type CloudBackupSummary = z.infer<typeof CloudBackupSummarySchema>;
