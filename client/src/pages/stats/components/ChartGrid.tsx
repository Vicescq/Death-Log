import ChartSlotRenderer from "./ChartSlotRenderer";
import { PRESET_CHARTS } from "../../../services/stats-query/presets";
import type { StatsTab } from "../../../model/stats-query-model/chart-slot";

export default function ChartGrid({ tab }: { tab: StatsTab }) {
	const charts = PRESET_CHARTS.filter((slot) => slot.tab === tab);

	if (charts.length === 0) {
		return (
			<div className="border-base-300 text-base-content/60 rounded-lg border border-dashed py-16 text-center">
				No charts here yet.
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{charts.map((slot) => (
				<ChartSlotRenderer key={slot.id} slot={slot} />
			))}
		</div>
	);
}
