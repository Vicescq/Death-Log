import { z } from "zod";

export const QueryLimitSchema = z.object({
    count: z.number(),
    dir: z.union([z.literal("start"), z.literal("end")]),
});

export type QueryLimit = z.infer<typeof QueryLimitSchema>;
