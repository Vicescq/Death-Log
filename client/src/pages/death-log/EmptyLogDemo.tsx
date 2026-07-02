import { useState } from "react";
import { Link } from "react-router";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import LocalDB from "../../services/LocalDB";
import FakeData from "../../services/fake-data-gen/FakeData";
import FeedbackToast, {
	type FeedbackToastState,
} from "../../components/FeedbackToast";

export default function EmptyLogDemo() {
	const refreshTree = useDeathLogStore((state) => state.refreshTree);
	const [feedbackToast, setFeedbackToast] = useState<FeedbackToastState>({
		displayed: false,
		msg: "",
		css: "error",
	});

	async function handlePopulate() {
		try {
			await LocalDB.clearAndInsertData(FakeData.generate());
			await refreshTree();
		} catch (e) {
			if (e instanceof Error) {
				setFeedbackToast({
					displayed: true,
					css: "error",
					msg: "Something unexpected happened while generating sample data. Please try again.",
				});
			}
		}
	}

	return (
		<div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
			<FeedbackToast
				msg={feedbackToast.msg}
				bgCSS={feedbackToast.css}
				displayed={feedbackToast.displayed}
				onClose={() =>
					setFeedbackToast((prev) => ({ ...prev, displayed: false }))
				}
			/>
			<h2 className="text-xl font-bold">Your death log is empty</h2>
			<p className="text-sm opacity-70">
				Want to see what the Death Log app can do? Populate it with fake
				data to see the stats visualizations in action. Head to{" "}
				<Link to="/data-management" className="link link-primary">
					Data Management
				</Link>{" "}
				if you want to undo the fake data or reseed your log later.
			</p>
			<button className="btn btn-accent" onClick={handlePopulate}>
				Populate with fake data
			</button>
			<p className="mt-4 text-sm opacity-70">
				Or start from scratch by adding a game you want to log in the
				toolbar below.
			</p>
		</div>
	);
}
