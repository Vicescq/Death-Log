import { Link } from "react-router";
import { BackupPolicy } from "../../services/backup/BackupPolicy";
import { formatBytes } from "../../utils/general";
import type { QA } from "./FAQ";

export const ACCOUNT_QA: QA = [
	{
		question: "Do I need an account to use Death Log?",
		answer: "No. You can log deaths and view your own stats fully offline without ever signing in. An account only unlocks the optional online extras: auto backup of your death log to the cloud, and participating in the global stats tracker.",
	},
	{
		question: "What is the global stats tracker?",
		answer: "A community wide view that tallies everyone's logged activity into a set of counters.",
	},
	{
		question: "How does auto backup work?",
		answer: (
			<>
				With an account you can switch on auto backup in your{" "}
				<Link to="/user-settings" className="link link-primary">
					account settings
				</Link>
				. It saves your Death Log to the cloud in the background,
				shortly after you stop making changes, and keeps your three most
				recent auto backups. Those are stored separately from the five
				manual backups, so a background save can never push out a backup
				you made on purpose.
			</>
		),
	},
	{
		question: "When does auto backup NOT run?",
		answer: (
			<>
				<p>
					Auto backup is a convenience, not a guarantee. Even with it
					switched on, it stays idle in all of these cases:
				</p>
				<ul className="mt-2 list-disc space-y-1 pl-5">
					<li>
						While you are signed out. Sign back in to resume it.
					</li>
					<li>While you are offline.</li>
					<li>
						While generated sample data is on this device, so fake
						data never reaches your cloud backups. It resumes once
						you undo or keep the sample data.
					</li>
					<li>
						While you are still making changes. It waits for a short
						pause in your editing before uploading, and it spaces
						out saves so it is not uploading constantly.
					</li>
					<li>
						Once your Death Log passes the{" "}
						{formatBytes(
							BackupPolicy.CLOUD_BACKUP_LIMIT_BYTES_DISPLAY,
						)}{" "}
						size cap for a single cloud backup. The server rejects
						the upload and auto backup switches itself off, since
						retrying could never succeed. Export your Death Log
						locally from{" "}
						<Link
							to="/data-management"
							className="link link-primary"
						>
							data management
						</Link>{" "}
						instead.
					</li>
				</ul>
				<p className="mt-2">
					Because of all this, keep exporting every so often even with
					auto backup on.
				</p>
			</>
		),
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
