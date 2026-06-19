import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import GenericChart from "../charts/GenericChart";
import GenericDeathChart from "../charts/GenericDeathChart";
import HeatMapCalendar from "../charts/HeatMapCalendar";

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const { query } = slot;

	if (query.case === "flat" && query.chartType === "calendar")
		return <HeatMapCalendar initQuery={query} />;
	if (query.case === "flat" && query.transform === "cumulative")
		return <GenericDeathChart initQuery={query} />;
	return <GenericChart initQuery={query} />;
}
