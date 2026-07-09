import { Link } from "react-router";
import type { QA } from "./FAQ";

export const ACCOUNT_QA: QA = [
	{
		question: "Do I need an account to use Death Log?",
		answer: "No. You can log deaths and view your own stats fully offline without ever signing in. An account is only needed if you want to set up auto backup of your death log to the cloud.",
	},
	{
		question: "How do I sign in?",
		answer: (
			<>
				Sign in and registration are handled through a secure third
				party service called Clerk. Head to your{" "}
				<Link to="/user-settings" className="link link-primary">
					account settings
				</Link>{" "}
				to create an account or log in.
			</>
		),
	},
	{
		question: "Can I change my username?",
		answer: (
			<>
				Yes, from your{" "}
				<Link to="/user-settings" className="link link-primary">
					account settings
				</Link>
				, which is where your account details are managed.
			</>
		),
	},
	{
		question: "What happens if I delete my account?",
		answer: "Deleting your account permanently removes your server side data (your username and any cloud backup). It does not touch the death log data stored locally on your device, that stays put.",
	},
];
