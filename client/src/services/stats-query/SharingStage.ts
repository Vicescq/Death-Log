import type { ChartData, ChartSlot } from "../../model/stats-query-model/chart";
import type {
	SharedChartSlot,
	SharedChartSpec,
} from "../../model/stats-query-model/shared-charts";

export class SharingStage {
	static toSlot(slot: ChartSlot, data: ChartData): SharedChartSlot {
		const { spec } = slot;

		const spec_: SharedChartSpec = {
			type: spec.type,
			title: spec.temporal
				? `${spec.title} (${SharingStage.timezone()})`
				: spec.title,
			data:
				data.kind === "category"
					? { category: data.points }
					: { sunburst: data.nodes },
		};

		if (spec.calendarRange) spec_.calendarRange = spec.calendarRange;

		return { id: slot.id, tab: slot.tab, spec: spec_ };
	}

	private static timezone(): string {
		return (
			Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
				.formatToParts(new Date())
				.find((p) => p.type === "timeZoneName")?.value ?? "UTC"
		);
	}
}
