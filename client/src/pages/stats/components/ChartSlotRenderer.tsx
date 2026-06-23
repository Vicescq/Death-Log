import { useMemo, useRef, useState } from "react";
import EChartsReact from "react-echarts-library";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { flattenTree } from "../../../services/stats-query/FlattenStage";
import { query } from "../../../services/stats-query/QueryStage";
import {
	overrideSpec,
	effectiveShowUnreliable,
} from "../../../services/stats-query/chart-overrides";
import useChartAnimation from "../hooks/useChartAnimation";
import { useCalendarDate } from "../hooks/useCalendarDate";
import ChartCard from "./ChartCard";
import ChartEmpty from "./ChartEmpty";
import CalendarHeader from "./CalendarHeader";
import ChartSettingsForm from "./ChartSettingsForm";
import Modal from "../../../components/Modal";
import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const [showAnyway, setShowAnyway] = useState(false);
	const tree = useDeathLogStore((state) => state.tree);
	const { currentDate, setCurrentDate, year, month } = useCalendarDate();
	const settingsModalRef = useRef<HTMLDialogElement>(null);

	const [overrideVersion, setOverrideVersion] = useState(0);

	const spec = useMemo(
		() => overrideSpec(slot.id, slot.spec),
		[slot.id, slot.spec, overrideVersion],
	);

	const isCalendar = spec.type === "calendar";

	const result = useMemo(
		() =>
			query(spec, flattenTree(tree), {
				calendarRange: `${year}-${month}`,
			}),
		[spec, tree, year, month],
	);

	const animatedOption = useChartAnimation(
		result.status !== "no-data" ? result.option : {},
	);

	const showChart =
		result.status === "ok" ||
		(result.status === "insufficient" && showAnyway);

	return (
		<>
			<ChartCard
				title={spec.title}
				onSettings={() => settingsModalRef.current?.showModal()}
			>
				{isCalendar && (
					<CalendarHeader
						currentDate={currentDate}
						onChange={setCurrentDate}
					/>
				)}
				{showChart ? (
					<EChartsReact
						option={animatedOption}
						theme={darkerChalk}
						style={defaultEchartStyling}
						notMerge
					/>
				) : result.status === "no-data" ? (
					<ChartEmpty status="no-data" />
				) : (
					<ChartEmpty
						status="insufficient"
						onShowAnyway={() => setShowAnyway(true)}
					/>
				)}
			</ChartCard>

			<Modal
				ref={settingsModalRef}
				header={`${spec.title} — Settings`}
				closeBtnName="Close"
				onClose={() => setOverrideVersion((v) => v + 1)}
				content={
					<ChartSettingsForm
						key={overrideVersion}
						id={slot.id}
						title={spec.title}
						hasReliability={slot.spec.whenReliable != null}
						showUnreliable={effectiveShowUnreliable(slot.id)}
					/>
				}
			/>
		</>
	);
}
