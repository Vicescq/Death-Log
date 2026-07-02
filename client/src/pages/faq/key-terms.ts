import type { QA } from "./FAQ";

export const KEY_TERMS: QA = [
	{
		question: "What is a Game?",
		answer: 'The top level of your log. A Game groups everything you track for a particular title, for example "Elden Ring" or "Sekiro". Every Profile lives under a Game.',
	},
	{
		question: "What is a Profile?",
		answer: "A Profile sits under a Game and represents a single playthrough or character, for example a specific save file or run. Every Subject lives under a Profile. \n\nProfile examples: 'First playthrough', 'Hardcore playthrough', 'Magic only run', etc.",
	},
	{
		question: "What is a Subject?",
		answer: "A Subject is the specific thing you're dying to: a boss, a location, an enemy type, or anything else you want to track. This is where your Deaths are logged.\n\nFor example, 'Radahn', 'Malenia', 'Leyndell', are all subjects to the game Elden Ring and some arbitrary profile.",
	},
	{
		question: "What is a Death?",
		answer: "A single logged death against a Subject, with a timestamp and an optional remark. Deaths are what all the stats and charts are built from.",
	},
	{
		question: "What is a Profile Group?",
		answer: "A Profile Group is a custom subset of Subjects within a Profile, useful for scoping stats to just the bosses in a specific area or phase of a run.\n\nFor example if the game is Terraria, and the profile is called First playthrough, you might have profile groups like the following based on that profile: 'Pre Hardmode', 'Hardmode', 'Post moonlord'.",
	},
	{
		question: "Why do these terms exist?",
		answer: "Purely for organizational reasons. You can think of Games, Profiles, and Subjects as folders. This lets you visualize stats for a specific 'folder' and allow more granular visualization.\n\nA Game is a folder for Profiles, a Profile is a folder for many Subjects, a Subject is a folder to particular Death in time.",
	},
	{
		question: "What is Reliability?",
		answer: "Reliability is a flag you set on the data itself, not on a chart. When you log a death, or set a subject's start or end date, you can mark that timestamp as unreliable if you're only estimating it, say you forgot to log something in the moment and are backfilling it later with a rough guess.\n\nIt matters because a guessed date can skew anything time based, like a calendar heatmap or a trend line, since there's no visual difference between a precise entry and a rough one unless you flag it.\n\nNothing is ever deleted or hidden by default. Charts where timing matters expose a reliability toggle in their settings, letting you choose per chart whether to include or exclude the entries you've marked unreliable.",
	},
];
