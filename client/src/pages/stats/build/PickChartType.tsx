import { CHART_TYPES } from "../../../model/stats-query-model/chart-spec";
import useBuildWizard from "../hooks/useBuildWizard";
import SkippedStep from "./SkippedStep";

const SORTED_CHART_TYPES = [...CHART_TYPES].sort();

export default function PickChartType() {
	const { wizard } = useBuildWizard();
	const [wizardState] = wizard;

	if (!wizardState.templateReady) return <SkippedStep />;

	return (
		<div className="space-y-3">
			<p className="opacity-80">Step 2 — Pick a chart type</p>
			<div className="flex flex-col gap-2">
				{SORTED_CHART_TYPES.map((type) => (
					<button
						key={type}
						className="border-base-300 bg-base-200 hover:border-primary rounded-xl border p-4 text-left capitalize transition-colors"
					>
						{type}
					</button>
				))}
			</div>
		</div>
	);
}
