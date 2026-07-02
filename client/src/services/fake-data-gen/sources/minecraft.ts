import type { GameSource } from "../types";

export const minecraft: GameSource = {
	gameName: "Minecraft",
	remarkPool: [
		"Fell in lava",
		"Creeper exploded me",
		"Fell from height",
		"Starved to death",
		"Drowned in ocean",
		"Ender Dragon breath",
		"Wither skull hit",
		"Skeleton kited me",
	],
	groupTitlePool: [
		"Hardcore Run",
		"Speedrun Attempt",
		"Survival Challenges",
	],
	profilePool: [
		{ name: "Survival World" },
		{ name: "Hardcore World" },
		{ name: "Speedrun Attempt" },
		{ name: "Creative Testing" },
		{ name: "Modded Playthrough" },
	],
	subjectPool: [
		{ name: "Ender Dragon", context: "Boss" },
		{ name: "Wither", context: "Boss" },
		{ name: "Warden", context: "Boss" },
		{ name: "Elder Guardian", context: "Mini Boss" },
		{ name: "Piglin Brute", context: "Mini Boss" },
		{ name: "Ravager", context: "Mini Boss" },
		{ name: "Creeper", context: "Generic Enemy", reoccurring: true },
		{ name: "Zombie", context: "Generic Enemy", reoccurring: true },
		{ name: "Skeleton", context: "Generic Enemy", reoccurring: true },
		{ name: "Enderman", context: "Generic Enemy", reoccurring: true },
		{ name: "Phantom", context: "Generic Enemy", reoccurring: true },
		{ name: "The Nether", context: "Location" },
		{ name: "The End", context: "Location" },
		{ name: "Deep Dark", context: "Location" },
		{ name: "Ancient City", context: "Location" },
	],
};
