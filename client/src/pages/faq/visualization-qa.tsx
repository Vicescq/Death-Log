import { Link } from "react-router";
import type { QA } from "./FAQ";

export const VISUALIZATION_QA: QA = [
	{
		question: "Where do I see my stats and visualizations?",
		answer: (
			<>
				Head to the{" "}
				<Link to="/stats" className="link link-primary">
					Stats page
				</Link>
				, that's where all your charts and visualizations live.
			</>
		),
	},
	{
		question: "What are the stats charts based on?",
		answer: "Every chart is built directly from your logged deaths and subjects, there's no separate data entry for stats. Log your deaths in the Death Log and the charts update from that same data.",
	},
	{
		question: "What is the reliability toggle on a chart?",
		answer: "Some entries can have an unreliable timestamp or date, for example if you logged a death well after it happened and aren't sure exactly when. The reliability toggle lets you include or exclude those uncertain entries from a chart.\n\nSee 'What is Reliability?' question at the top of this page for more info.",
	},
	{
		question: "Can other people see my charts?",
		answer: "No. Your stats are generated and viewed entirely on your own device, they are never uploaded or visible to anyone else.",
	},
	{
		question:
			"I have the same subject name in two different profiles, why doesn't the chart combine them?",
		answer: "Charts like Top 10 Bosses group entries by exact name, including capitalization. 'Malenia' and 'malenia' are treated as two separate entries, not combined into one. If you want a subject tallied together across different profiles (for example, the same boss fought in two playthroughs), spell and capitalize its name exactly the same way in both.",
	},
];
