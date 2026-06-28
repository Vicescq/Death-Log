import ChartSlotRenderer from "./ChartSlotRenderer";
import { PRESET_CHARTS } from "../../../services/stats-query/presets";
import type { ChartTab } from "../../../model/stats-query-model/tabs";

export default function ChartGrid({ tab }: { tab: ChartTab }) {
	const charts = PRESET_CHARTS.filter((slot) => slot.tab === tab);

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{charts.map((slot) => (
				<ChartSlotRenderer key={slot.id} slot={slot} />
			))}
		</div>
	);
}
