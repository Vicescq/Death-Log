import type { GameSource } from "../types";

export const expedition33: GameSource = {
	gameName: "Clair Obscur: Expedition 33",
	remarkPool: [
		"Missed the parry",
		"Bad dodge timing",
		"AP mismanagement",
		"Free aim miss",
		"Turn order misplay",
		"Underleveled party",
		"Status effect stack",
	],
	groupTitlePool: ["Act 1 Bosses", "No-Death Run", "Expert Difficulty"],
	profilePool: [
		{ name: "Main Playthrough" },
		{ name: "New Game Plus" },
		{ name: "Expert Mode Run" },
		{ name: "No-Death Attempt" },
		{ name: "Speedrun Attempt" },
	],
	subjectPool: [
		{ name: "The Paintress", context: "Boss" },
		{ name: "Monolith Guardian", context: "Boss" },
		{ name: "Nevron Sentinel", context: "Mini Boss" },
		{ name: "Nevron Swarm", context: "Generic Enemy", reoccurring: true },
		{ name: "Petank Scout", context: "Generic Enemy", reoccurring: true },
		{ name: "Manikin", context: "Generic Enemy", reoccurring: true },
		{ name: "Gommage", context: "Other" },
		{ name: "Lumina Trial", context: "Other" },
		{ name: "Lumiere", context: "Location" },
		{ name: "Expedition Camp", context: "Location" },
		{ name: "Corrupted Canvas", context: "Location" },
	],
};
