import { useState } from "react";
import { ChartSlotSchema } from "../../../model/stats-query-model/chart-slot";
import { baseDefaultView } from "../../../services/stats-query/preset-views";
import GridPositionKey from "../components/GridPositionKey";
import ViewList from "../components/ViewList";
import ViewListChart from "../components/ViewListChart";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

export default function StatsManage() {
	ChartSlotSchema.parse(baseDefaultView.charts[0]); // for dev errors

	const [chartSlots, setChartSlots] = useState(baseDefaultView.charts);

	return (
		<div className="space-y-6">
			<div className="space-y-1">
				<h2 className="text-base font-semibold">Manage Overview</h2>
				<p className="text-sm opacity-60">
					Choose which charts appear on the Overview tab and drag to
					reorder them.
				</p>
			</div>

			<ViewList />

			<GridPositionKey />

			<div className="border-base-300 bg-base-200 divide-base-300 divide-y rounded-lg border">
				<DragDropProvider
					onDragEnd={(e) => {
						setChartSlots((chartSlots) => move(chartSlots, e));
					}}
				>
					{chartSlots.map((slot, i) => (
						<ViewListChart key={slot.id} index={i} slot={slot} />
					))}
				</DragDropProvider>
			</div>

			<div className="flex justify-end gap-2">
				<button
					className="btn btn-error"
					onClick={() => setChartSlots(baseDefaultView.charts)}
				>
					Reset Ordering
				</button>
				<button className="btn btn-primary">Save</button>
			</div>
		</div>
	);
}
