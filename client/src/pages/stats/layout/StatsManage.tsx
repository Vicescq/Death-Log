import { useState } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { PRESET_CHARTS } from "../../../services/stats-query/presets";
import { STATS_TABS } from "../../../model/stats-query-model/chart-slot";
import type {
	ChartSlot,
	StatsTab,
} from "../../../model/stats-query-model/chart-slot";
import ViewListChart from "../manage/ViewListChart";

type ManageSlot = ChartSlot & { displayed: boolean };

const TAB_LABELS: Record<StatsTab, string> = {
	overview: "Overview",
	specialized: "Specialized",
};

export default function StatsManage() {
	const [byTab, setByTab] = useState<Record<StatsTab, ManageSlot[]>>(() => {
		const init = {} as Record<StatsTab, ManageSlot[]>;
		for (const tab of STATS_TABS) {
			init[tab] = PRESET_CHARTS.filter((s) => s.tab === tab).map((s) => ({
				...s,
				displayed: true,
			}));
		}
		return init;
	});

	function handleToggle(tab: StatsTab, id: string, displayed: boolean) {
		setByTab((prev) => ({
			...prev,
			[tab]: prev[tab].map((s) =>
				s.id === id ? { ...s, displayed } : s,
			),
		}));
	}

	return (
		<div className="space-y-8">
			{STATS_TABS.map((tab) => (
				<section key={tab} className="space-y-3">
					<div className="flex">
						<div className="flex-1 space-y-1">
							<h2 className="text-base font-semibold">
								Manage {TAB_LABELS[tab]}
							</h2>
							<p className="text-sm opacity-60">
								Drag to reorder; toggle to show or hide a chart.
							</p>
						</div>
						<button className="btn btn-accent">
							Reset to defaults
						</button>
					</div>

					{byTab[tab].length === 0 ? (
						<div className="border-base-300 text-base-content/60 rounded-lg border border-dashed py-10 text-center text-sm">
							No charts on this tab.
						</div>
					) : (
						<div className="border-base-300 bg-base-200 divide-base-300 divide-y rounded-lg border">
							<DragDropProvider
								onDragEnd={(e) =>
									setByTab((prev) => ({
										...prev,
										[tab]: move(prev[tab], e),
									}))
								}
							>
								{byTab[tab].map((slot, i) => (
									<ViewListChart
										key={slot.id}
										index={i}
										group={tab}
										slot={slot}
										displayed={slot.displayed}
										onDisplayChange={(displayed) =>
											handleToggle(
												tab,
												slot.id,
												displayed,
											)
										}
									/>
								))}
							</DragDropProvider>
						</div>
					)}
				</section>
			))}
		</div>
	);
}
