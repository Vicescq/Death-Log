import { Link } from "react-router";
import type { QA } from "./FAQ";

export const ACCOUNT_QA: QA = [
	{
		question: "Do I need an account to use Death Log?",
		answer: "No. You can log deaths and view your own stats fully offline without ever signing in. An account is only needed if you want to share your stats publicly or follow other users.",
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
		question: "What does sharing my profile do?",
		answer: (
			<>
				Hitting Share on your{" "}
				<Link to="/stats" className="link link-primary">
					stats page
				</Link>{" "}
				snapshots your current stats and publishes them to a public
				profile page. Anyone who navigates to your profile can view that
				snapshot, even if they're signed out.
				<br />
				<br />
				Use the public preview toggle to see exactly what visitors will
				see.
			</>
		),
	},
	{
		question: "What does following someone do?",
		answer: "Following is purely social, it lets you keep track of other users you're interested in and shows up in their follower count. It doesn't affect what data you can see beyond what they've chosen to share.",
	},
	{
		question: "What happens if I delete my account?",
		answer: "Deleting your account permanently removes your server side data (username, shared profile, follows). It does not touch the death log data stored locally on your device, that stays put.",
	},
];
