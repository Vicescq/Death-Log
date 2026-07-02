import type { GameSource } from "../types";

export const silksong: GameSource = {
	gameName: "Hollow Knight: Silksong",
	remarkPool: [
		"Bad silk timing",
		"Missed the parry",
		"Needle bounce fail",
		"Fell into thorns",
		"Bad heal timing",
		"Overcommitted attack",
		"Got poise broke",
	],
	groupTitlePool: ["Act 1 Bosses", "Hunter Trials", "Steel Needle Run"],
	profilePool: [
		{ name: "Main Save" },
		{ name: "Steel Soul Run" },
		{ name: "New Save Slot" },
		{ name: "Speedrun Attempt" },
		{ name: "Randomizer Seed" },
	],
	subjectPool: [
		{ name: "Lace", context: "Boss" },
		{ name: "Trobbio", context: "Boss" },
		{ name: "Moss Mother", context: "Boss" },
		{ name: "Bell Beast", context: "Boss" },
		{ name: "First Sentinel", context: "Boss" },
		{ name: "Widow", context: "Boss" },
		{ name: "Last Judge", context: "Boss" },
		{ name: "Grand Mother Silk", context: "Boss" },
		{ name: "Deathcrown", context: "Mini Boss" },
		{ name: "Sister Splinter", context: "Mini Boss" },
		{ name: "Bilewater", context: "Location" },
		{ name: "Deep Docks", context: "Location" },
		{ name: "Wisp Thicket", context: "Location" },
		{
			name: "Hunter Trappers",
			context: "Generic Enemy",
			reoccurring: true,
		},
		{
			name: "Cogwork Soldiers",
			context: "Generic Enemy",
			reoccurring: true,
		},
	],
};
