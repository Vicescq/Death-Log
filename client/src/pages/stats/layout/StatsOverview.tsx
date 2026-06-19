import ChartSlotRenderer from "../components/ChartSlotRenderer";
import useStatsViews from "../hooks/useStatsViews";

export default function StatsOverview() {
	const [viewsContext] = useStatsViews();
	const allViews = [...viewsContext.defaultViews, ...viewsContext.customViews];
	const activeView =
		allViews.find((v) => v.id === viewsContext.activeViewId) ?? allViews[0];
	const activeCharts = activeView.charts.filter((slot) => slot.displayed);
	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
			{activeCharts.map((slot) => (
				<ChartSlotRenderer key={slot.id} slot={slot} />
			))}
		</div>
	);
}
