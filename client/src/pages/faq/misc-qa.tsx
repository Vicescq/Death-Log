import { Link } from "react-router";
import type { QA } from "./FAQ";

export const MISC_QA: QA = [
	{
		question: "Can I install Death Log as an app on my phone?",
		answer: "Yes, Death Log is an installable Progressive Web App (PWA), there's no separate mobile app or app store download. Open the site in your mobile browser and use its \"Add to Home Screen\" or \"Install app\" option, and it'll behave like a native app from your home screen. Your local data stays tied to whichever device and browser you're using though, so installing it fresh on a new device doesn't automatically bring over your existing log, unless you export your data or set up cloud auto backup.",
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
