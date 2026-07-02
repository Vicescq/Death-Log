import { useMemo, useRef, useState } from "react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { OverrideStage } from "../../../services/stats-query/OverrideStage";
import { useCalendarDate } from "../hooks/useCalendarDate";
import ChartCanvas from "./ChartCanvas";
import ChartSettingsForm from "./ChartSettingsForm";
import Modal from "../../../components/Modal";
import { useStatsContext } from "../hooks/useStatsContext";
import type { ChartSlot } from "../../../model/stats-query-model/chart";
import type { Tables } from "../../../model/stats-query-model/chart";

// used only for TS type narrowing, not used in runtime
const EMPTY_TABLES: Tables = { deaths: [], subjects: [] };

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const ctx = useStatsContext();
	const tables = ctx.isSharedPage ? EMPTY_TABLES : ctx.tables;

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
		() => StatsPipeline.Chart({ spec, data, range: `${year}-${month}` }),
		[spec, data, year, month],
	);

	return (
		<>
			<ChartCanvas
				title={spec.title}
				option={option}
				isCalendar={isCalendar}
				currentDate={currentDate}
				onDateChange={setCurrentDate}
				onSettings={
					hasReliability
						? () => settingsModalRef.current?.showModal()
						: undefined
				}
			/>

			{hasReliability && (
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
