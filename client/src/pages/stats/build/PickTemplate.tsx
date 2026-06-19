import { useNavigate } from "react-router";
import useBuildWizard from "../hooks/useBuildWizard";

export default function PickTemplate() {
	const { wizard } = useBuildWizard();
	const [, setWizard] = wizard;
	const navigate = useNavigate();

	function startFresh() {
		setWizard({ templateReady: true, draft: {} });
		navigate("/stats/build/chart");
	}

	return (
		<div className="space-y-3">
			<p className="opacity-80">Step 1 — Choose a starting point</p>
			<div className="flex flex-col gap-3 sm:flex-row">
				<button
					onClick={startFresh}
					className="border-base-300 bg-base-200 hover:border-primary flex flex-1 flex-col gap-1 rounded-xl border p-6 text-left transition-colors"
				>
					<p className="font-semibold">Start Fresh</p>
					<p className="text-sm opacity-60">
						Build a new chart from scratch
					</p>
				</button>
				<button
					disabled
					className="border-base-300 bg-base-200 flex flex-1 flex-col gap-1 rounded-xl border p-6 text-left opacity-40"
				>
					<p className="font-semibold">From Existing Chart</p>
					<p className="text-sm opacity-60">
						Use an existing chart as a starting point
					</p>
				</button>
			</div>
		</div>
	);
}
