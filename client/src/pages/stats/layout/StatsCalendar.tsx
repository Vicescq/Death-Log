import { useMemo } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { CALENDAR_QUERY } from "../../../services/stats-query/presets";
import type { CalendarQuery } from "../../../model/stats-query-model/query";
import ChartCanvas from "../components/ChartCanvas";
import ReliabilitySettingsModal from "../components/ReliabilitySettingsModal";
import { useCalendarDate } from "../hooks/useCalendarDate";
import { useReliabilityOverride } from "../hooks/useReliabilityOverride";
import useMediaQuery from "../../../hooks/useMediaQuery";

const CELL_SIZE_SM = 30;
const CELL_SIZE_MD = 75;
const CELL_SIZE_LG = 90;

export default function StatsCalendar() {
	const tree = useDeathLogStore((state) => state.tree);
	const { currentDate, setCurrentDate, year, month } = useCalendarDate();
	const { modalRef, overrideVersion, openSettings, onModalClose } =
		useReliabilityOverride();

	const { vpMatched: isMd } = useMediaQuery("(width >= 768px)");
	const { vpMatched: isLg } = useMediaQuery("(width >= 1024px)");
	const cellSize = isLg ? CELL_SIZE_LG : isMd ? CELL_SIZE_MD : CELL_SIZE_SM;

	const query: CalendarQuery = useMemo(
		() => ({ ...CALENDAR_QUERY, range: `${year}-${month}`, cellSize }),
		[year, month, cellSize],
	);

	const data = useMemo(
		() => StatsPipeline.Collect(query, tree),
		[query, tree, overrideVersion],
	);

	const option = useMemo(
		() => (data ? StatsPipeline.Chart(query, data) : null),
		[query, data],
	);

	return (
		<div className="h-screen">
			<ChartCanvas
				title="Deaths by Day"
				description={CALENDAR_QUERY.description}
				option={option}
				isCalendar
				currentDate={currentDate}
				onDateChange={setCurrentDate}
				onSettings={openSettings}
			/>

			<ReliabilitySettingsModal
				modalRef={modalRef}
				onClose={onModalClose}
				overrideVersion={overrideVersion}
				queryId={CALENDAR_QUERY.id}
				queryTitle={CALENDAR_QUERY.title}
			/>
		</div>
	);
}
