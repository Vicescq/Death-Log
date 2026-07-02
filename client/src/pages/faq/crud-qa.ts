import type { QA } from "./FAQ";

export const CRUD_QA: QA = [
	{
		question: "How do I add a game, profile, or subject?",
		answer: "Use the + button in the floating menu at the bottom of the Death Log page. It opens a form scoped to whatever level you're currently viewing, add a Game from the top level, a Profile from inside a Game, and so on.\n\nSubjects have a couple extra fields: a context (Boss, Location, Generic Enemy, Mini Boss, Other) and whether it's reoccurring.",
	},
	{
		question: "How do I log a death?",
		answer: "Click the folder icon of a Subject to open its counter. From there, the up/down buttons log or undo a death, and you can attach an optional remark and mark the timestamp as unreliable if you're just estimating it.",
	},
	{
		question: "How do I edit a game, profile, or subject?",
		answer: "Tap the pencil icon on its card to open the edit form. Profiles have a second icon for editing their Profile Groups specifically.",
	},
	{
		question: "How do I edit or delete a single death entry?",
		answer: "From a Subject's counter page, open its death history. Each logged death can be edited (remark, timestamp, reliability) or deleted individually from there.",
	},
	{
		question: "How do I delete a game, profile, or subject?",
		answer: "Open the edit form (pencil icon) and use the delete field at the bottom, type DEL to confirm before the delete button becomes active. This is a safeguard since deleting a Game or Profile also deletes everything nested inside it.",
	},
];
