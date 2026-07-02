import { useMemo } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { useCalendarDate } from "../hooks/useCalendarDate";
import ChartCanvas from "./ChartCanvas";
import type { SharedProfileView } from "../../../model/stats-query-model/shared-charts";

type Slot = SharedProfileView["chartSlots"][number];

export default function SharedChartSlotRenderer({ slot }: { slot: Slot }) {
	const { currentDate, setCurrentDate, year, month } = useCalendarDate(
		slot.spec.calendarRange,
	);

	const isCalendar = slot.spec.type === "calendar";

	const option = useMemo(
		() =>
			StatsPipeline.Chart({
				mode: "sharing",
				spec: slot.spec,
				range: `${year}-${month}`,
			}),
		[slot.spec, year, month],
	);

	return (
		<ChartCanvas
			title={slot.spec.title}
			option={option}
			isCalendar={isCalendar}
			currentDate={currentDate}
			onDateChange={setCurrentDate}
		/>
	);
}
