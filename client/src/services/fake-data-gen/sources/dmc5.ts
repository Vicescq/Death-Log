import type { GameSource } from "../types";

export const dmc5: GameSource = {
	gameName: "Devil May Cry 5",
	remarkPool: [
		"Style rank dropped",
		"Bad parry timing",
		"Ran out of DT",
		"Got juggled",
		"Missed the dodge",
		"Overextended combo",
		"Exceed timing off",
		"SSStylish death",
	],
	groupTitlePool: ["Bloody Palace", "SSS Rank Hunt", "Dante Must Die"],
	profilePool: [
		{ name: "Main Playthrough" },
		{ name: "Dante Must Die Run" },
		{ name: "Bloody Palace Grind" },
		{ name: "Human Mode Run" },
		{ name: "Co-op Run" },
	],
	subjectPool: [
		{ name: "Goliath", context: "Boss" },
		{ name: "Nidhogg", context: "Boss" },
		{ name: "Artemis", context: "Boss" },
		{ name: "Urizen", context: "Boss" },
		{ name: "King Cerberus", context: "Boss" },
		{ name: "Vergil", context: "Boss" },
		{ name: "Cavaliere Angelo", context: "Mini Boss" },
		{ name: "Behemoth", context: "Mini Boss" },
		{ name: "Empusa", context: "Generic Enemy", reoccurring: true },
		{ name: "Hell Caina", context: "Generic Enemy", reoccurring: true },
		{ name: "Fury", context: "Generic Enemy", reoccurring: true },
		{ name: "Qliphoth Root", context: "Location" },
		{ name: "Red Grave City", context: "Location" },
	],
};
