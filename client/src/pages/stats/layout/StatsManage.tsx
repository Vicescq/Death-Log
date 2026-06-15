import GridPositionKey from "../components/GridPositionKey";
import GripIcon from "../components/GripIcon";
import ViewList from "../components/ViewList";

const PLACEHOLDER_CHARTS = [
	{ title: "Death Calendar", type: "hmc" },
	{ title: "Top 10 Games (Deaths)", type: "bar" },
	{ title: "Top 10 Subjects (Deaths)", type: "bar" },
	{ title: "Deaths Over Time", type: "time-line" },
	{ title: "Top 5 Bosses (Deaths)", type: "pie" },
	{ title: "Top Death Sources", type: "sunburst" },
	{ title: "Deaths vs Time Spent", type: "scatter" },
];

export default function StatsManage() {
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
				{PLACEHOLDER_CHARTS.map((chart, i) => (
					<div
						key={chart.title}
						className="flex items-center gap-3 px-4 py-3"
					>
						<GripIcon />
						<span className="text-base-content/40 w-5 text-center text-xs tabular-nums">
							{i + 1}
						</span>
						<span className="flex-1 text-sm">{chart.title}</span>
						<span className="badge badge-accent badge-sm font-mono">
							{chart.type}
						</span>
						<input
							type="checkbox"
							className="checkbox checkbox-sm"
							defaultChecked
						/>
					</div>
				))}
			</div>

			<div className="flex justify-end gap-2">
				<button className="btn">Reset to default</button>
				<button className="btn btn-primary">Save</button>
			</div>
		</div>
	);
}
