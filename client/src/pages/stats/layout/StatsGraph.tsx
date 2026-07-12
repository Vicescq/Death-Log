import { useMemo } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { GRAPH_QUERY } from "../../../services/stats-query/presets";
import ChartCanvas from "../components/ChartCanvas";

export default function StatsGraph() {
	const tree = useDeathLogStore((state) => state.tree);

	const data = useMemo(
		() => StatsPipeline.Collect(GRAPH_QUERY, tree),
		[tree],
	);

	const option = useMemo(
		() => (data ? StatsPipeline.Chart(GRAPH_QUERY, data) : null),
		[data],
	);

	return (
		<div className="h-screen">
			<p className="mb-3 text-sm opacity-70">
				Tip: scroll or pinch to zoom out if the graph looks cut off.
			</p>
			<p className="mb-3 text-sm opacity-70">
				Note: pinch to zoom is very sensitive on phones and other
				touchscreens. A laptop or desktop is preferred for exploring the
				graph.
			</p>
			<ChartCanvas title="Graph" option={option} />
		</div>
	);
}
