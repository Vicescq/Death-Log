import { Link } from "react-router";
import type { QA } from "./FAQ";

export const DATA_QA: QA = [
	{
		question: "Where is my death log data stored?",
		answer: "Locally on your device. Death Log is local first, your log never has to touch a server to work.",
	},
	{
		question: "How do I back up my data?",
		answer: (
			<>
				Go to{" "}
				<Link to="/data-management" className="link link-primary">
					Data Management
				</Link>{" "}
				and hit Export. This downloads a JSON file containing your
				entire death log, which you can keep as a backup or move to
				another device.
			</>
		),
	},
	{
		question: "How do I restore from a backup?",
		answer: (
			<>
				Go to{" "}
				<Link to="/data-management" className="link link-primary">
					Data Management
				</Link>{" "}
				and hit Import, then select a previously exported JSON file.
				This merges that data back into your local log.
			</>
		),
	},
	{
		question: "What happens if I delete my local data?",
		answer: "It permanently wipes everything stored on this device: every game, profile, subject, and death.",
	},
	{
		question: "What do Seed and Undo do in Data Management?",
		answer: "They're paired with the fake demo data prompt shown when your log is empty. Seed regenerates that fake data, Undo removes it, so you can preview the app's charts without committing to keeping the sample data around.",
	},
	{
		question:
			"My data just disappeared and I didnt do anything, what happened?",
		answer: (
			<>
				Whether you are using it in the browser or installed as a PWA,
				there is a possiblity the browser or device evicted the data on
				its own. This can happen on cases where the device is on low
				storage.
				<br />
				<br />
				Good suggestions to avoid this: proactively exporting your own
				data via{" "}
				<Link to="/data-management" className="link link-primary">
					Data Management
				</Link>
				, OR setting up auto backup with an account helps.
			</>
		),
	},
	{
		question: "My data is corrupted! What to do?",
		answer: (
			<>
				Go to{" "}
				<Link to="/data-management" className="link link-primary">
					Data Management
				</Link>{" "}
				and delete your local data to start a fresh slate. You should be
				backing up your death log proactively. Or you may set up auto
				backup but that requires an account.
			</>
		),
	},
];
