import { baseDefaultView } from "../../../services/stats-query/preset-views";
import ChartSlotRenderer from "../components/ChartSlotRenderer";
import useStatsViews from "../hooks/useStatsViews";

export default function StatsOverview() {
	const [viewsContext, setViewsContext] = useStatsViews();
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{baseDefaultView.charts.map((slot) => (
				<ChartSlotRenderer key={slot.id} slot={slot} />
			))}
		</div>
	);
}
