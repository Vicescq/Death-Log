import z from "zod";

export const GlobalStatsCountsSchema = z.object({
	deaths: z.number().int().nonnegative(),
	games: z.number().int().nonnegative(),
	profiles: z.number().int().nonnegative(),
	subjects: z.number().int().nonnegative(),
	bossDeaths: z.number().int().nonnegative(),
	miniBossDeaths: z.number().int().nonnegative(),
	locationDeaths: z.number().int().nonnegative(),
	genericDeaths: z.number().int().nonnegative(),
	otherDeaths: z.number().int().nonnegative(),
});

export type GlobalStatsCounts = z.infer<typeof GlobalStatsCountsSchema>;
