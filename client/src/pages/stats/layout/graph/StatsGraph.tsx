import { useMemo, useState } from "react";
import { StatsPipeline } from "../../../../services/stats-query/StatsPipeline";
import { useDeathLogStore } from "../../../../stores/useDeathLogStore";
import { GRAPH_QUERY } from "../../../../services/stats-query/presets";
import type { GraphQuery } from "../../../../model/stats-query-model/query";
import ChartCanvas from "../../components/ChartCanvas";
import GraphControls from "./GraphControls";

const DEFAULT_DRAGGABLE = true;
const DEFAULT_ZOOM = 0.5;
const AUTO_LABEL_MAX_NODES = 50;

export default function StatsGraph() {
	const tree = useDeathLogStore((state) => state.tree);
	const [draggable, setDraggable] = useState(DEFAULT_DRAGGABLE);
	const [zoom, setZoom] = useState(DEFAULT_ZOOM);
	// null = follow the auto rule, boolean = explicit user override
	const [showLabelsOverride, setShowLabelsOverride] = useState<
		boolean | null
	>(null);

	const autoShowLabels = tree.size <= AUTO_LABEL_MAX_NODES;
	const showLabels = showLabelsOverride ?? autoShowLabels;

	const query: GraphQuery = useMemo(
		() => ({ ...GRAPH_QUERY, draggable, zoom, showLabels }),
		[draggable, zoom, showLabels],
	);

	const data = useMemo(
		() => StatsPipeline.Collect(query, tree),
		[query, tree],
	);

	const option = useMemo(
		() => StatsPipeline.Chart(query, data),
		[query, data],
	);

	function handleReset() {
		setDraggable(DEFAULT_DRAGGABLE);
		setZoom(DEFAULT_ZOOM);
		setShowLabelsOverride(null);
	}

	return (
		<div className="h-screen">
			<div className="mb-3">
				<GraphControls
					draggable={draggable}
					zoom={zoom}
					showLabels={showLabels}
					onDraggableChange={setDraggable}
					onZoomChange={setZoom}
					onShowLabelsChange={setShowLabelsOverride}
					onReset={handleReset}
				/>
			</div>

			<p className="mb-3 text-sm opacity-70">
				Tip: scroll or pinch to zoom out if the graph looks cut off.
			</p>
			<p className="mb-3 text-sm opacity-70">
				Note: pinch to zoom is very sensitive on phones and other
				touchscreens. A laptop or desktop is preferred for exploring the
				graph.
			</p>
			<ChartCanvas
				title="Graph"
				option={option}
				fullscreenControls={
					<details className="collapse-arrow border-base-300 bg-base-200 collapse border">
						<summary className="collapse-title font-semibold">
							Graph Options
						</summary>
						<div className="collapse-content">
							<GraphControls
								draggable={draggable}
								zoom={zoom}
								showLabels={showLabels}
								onDraggableChange={setDraggable}
								onZoomChange={setZoom}
								onShowLabelsChange={setShowLabelsOverride}
								onReset={handleReset}
								stacked
							/>
						</div>
					</details>
				}
			/>
		</div>
	);
}
