import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import GenericChart from "../charts/GenericChart";
import GenericDeathChart from "../charts/GenericDeathChart";
import HeatMapCalendar from "../charts/HeatMapCalendar";

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const { preset } = slot;

	if (preset.case === "calendar") return <HeatMapCalendar preset={preset} />;
	if (preset.case === "flat" && preset.transform === "cumulative")
		return <GenericDeathChart query={preset} />;
	return <GenericChart preset={preset} />;
}
