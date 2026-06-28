import { useMemo, useRef, useState } from "react";
import EChartsReact from "react-echarts-library";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { OverrideStage } from "../../../services/stats-query/OverrideStage";
import useChartAnimation from "../hooks/useChartAnimation";
import { useCalendarDate } from "../hooks/useCalendarDate";
import ChartCard from "./ChartCard";
import ChartEmpty from "./ChartEmpty";
import CalendarHeader from "./CalendarHeader";
import ChartSettingsForm from "./ChartSettingsForm";
import Modal from "../../../components/Modal";
import { useStatsContext } from "../hooks/useStatsContext";
import type { ChartSlot } from "../../../model/stats-query-model/chart";

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const { tables, isSharedPage } = useStatsContext();
	const { currentDate, setCurrentDate, year, month } = useCalendarDate(
		slot.spec.calendarRange,
	);
	const settingsModalRef = useRef<HTMLDialogElement>(null);

	const [overrideVersion, setOverrideVersion] = useState(0);

	const spec = useMemo(
		() => StatsPipeline.Override(slot.id, slot.spec),
		[slot.id, slot.spec, overrideVersion],
	);

	const isCalendar = spec.type === "calendar";
	const hasReliability = slot.spec.whenReliable != null;

	const data = useMemo(
		() => StatsPipeline.Query(spec, tables),
		[spec, tables],
	);

	const option = useMemo(
		() => StatsPipeline.Chart(spec, data, `${year}-${month}`),
		[spec, data, year, month],
	);

	const animatedOption = useChartAnimation(option);

	return (
		<>
			<ChartCard
				title={spec.title}
				onSettings={
					hasReliability && !isSharedPage
						? () => settingsModalRef.current?.showModal()
						: undefined
				}
			>
				{isCalendar && (
					<CalendarHeader
						currentDate={currentDate}
						onChange={setCurrentDate}
					/>
				)}
				{animatedOption === null ? (
					<ChartEmpty />
				) : (
					<EChartsReact
						option={animatedOption}
						theme={darkerChalk}
						style={defaultEchartStyling}
						notMerge
					/>
				)}
			</ChartCard>

			{hasReliability && !isSharedPage && (
				<Modal
					ref={settingsModalRef}
					header={`${spec.title} Settings`}
					closeBtnName="Close"
					onClose={() => setOverrideVersion((v) => v + 1)}
					content={
						<ChartSettingsForm
							key={overrideVersion}
							id={slot.id}
							hasReliability={hasReliability}
							showUnreliable={OverrideStage.showUnreliable(
								slot.id,
							)}
						/>
					}
				/>
			)}
		</>
	);
}
