import { useMemo, useState } from "react";
import EChartsReact from "react-echarts-library";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { flattenTree } from "../../../services/stats-query/FlattenStage";
import { compileSpec } from "../../../services/stats-query/CompileStage";
import useChartAnimation from "../hooks/useChartAnimation";
import { useCalendarDate } from "../hooks/useCalendarDate";
import ChartCard from "./ChartCard";
import ChartEmpty from "./ChartEmpty";
import ChartHideButton from "./ChartHideButton";
import CalendarHeader from "./CalendarHeader";
import ChartReliabilityToggle from "./ChartReliabilityToggle";
import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import type { ChartSpec } from "../../../model/stats-query-model/chart-spec";

export default function ChartSlotRenderer({ slot }: { slot: ChartSlot }) {
	const [showAnyway, setShowAnyway] = useState(false);
	const [showUnreliable, setShowUnreliable] = useState(
		slot.spec.showUnreliableDeathData ?? false,
	);
	const tree = useDeathLogStore((state) => state.tree);
	const { currentDate, setCurrentDate, year, month } = useCalendarDate(
		slot.spec,
	);

	const isCalendar = slot.spec.type === "calendar";
	const isTimeLine = slot.spec.type === "time-line";
	const usesDeathsTable =
		slot.spec.measure.measure === "deaths" &&
		slot.spec.measure.aggregate === "count";

	const specForCompile = useMemo<ChartSpec>(() => {
		let s = slot.spec;
		if (isCalendar) s = { ...s, calendarConfig: { range: `${year}-${month}` } };
		if (usesDeathsTable) s = { ...s, showUnreliableDeathData: showUnreliable };
		return s;
	}, [slot.spec, isCalendar, year, month, usesDeathsTable, showUnreliable]);

	const result = useMemo(
		() => compileSpec(specForCompile, flattenTree(tree)),
		[specForCompile, tree],
	);
	const animatedOption = useChartAnimation(
		result.status !== "no-data" ? result.option : {},
	);

	const showChart =
		result.status === "ok" ||
		(result.status === "insufficient" && showAnyway);

	return (
		<ChartCard
			title={slot.spec.title}
			settings={
				<>
					{(isCalendar || isTimeLine) && (
						<ChartReliabilityToggle
							value={showUnreliable}
							onChange={setShowUnreliable}
						/>
					)}
					{result.status === "insufficient" && showAnyway && (
						<ChartHideButton visible onHide={() => setShowAnyway(false)} />
					)}
				</>
			}
		>
			{isCalendar && (
				<CalendarHeader currentDate={currentDate} onChange={setCurrentDate} />
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
	);
}
