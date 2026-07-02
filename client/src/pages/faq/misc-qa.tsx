import { Link } from "react-router";
import type { QA } from "./FAQ";

export const MISC_QA: QA = [
	{
		question: "Do I have to choose between the website and a mobile app?",
		answer: "No, Death Log isn't locked to one platform. If you've been using the website, a mobile app is available too, and if you started on mobile, the full website is available as well. Your local data stays tied to whichever device and browser you're using though, so the two aren't automatically synced unless you export or share.",
	},
	{
		question: "Is Death Log free to use?",
		answer: "Yes, logging deaths, viewing your own stats, and exporting your data are all free with no account required.",
	},
	{
		question: "How can I support the project?",
		answer: (
			<>
				The biggest help is just using it and sharing it with friends.
				If you'd like to support directly, head over to the{" "}
				<Link to="/about" className="link link-primary">
					About page
				</Link>{" "}
				for a Ko-fi link.
			</>
		),
	},
	{
		question: "I found a bug or have a feature idea, where do I send it?",
		answer: (
			<>
				Visit the{" "}
				<Link to="/about" className="link link-primary">
					About page
				</Link>{" "}
				and follow the link to the GitHub repo, bugs and feature
				requests can be filed there as issues. Include what you were
				doing when it happened and, if possible, whether it's
				reproducible.
			</>
		),
	},
];
