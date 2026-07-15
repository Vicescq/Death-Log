import type { ReactNode } from "react";
import type { EChartsOption } from "echarts";
import EChartsReact from "react-echarts-library";
import darkerChalk from "../../../../shared/darker_chalk.json";
import { defaultEchartStyling } from "../../../../shared/defaults";
import useChartAnimation from "../hooks/useChartAnimation";
import ChartCard from "./ChartCard";
import ChartEmpty from "./ChartEmpty";
import CalendarHeader from "./CalendarHeader";

type Props = {
	title: string;
	option: EChartsOption | null;
	description?: string;
	isCalendar?: boolean;
	currentDate?: Date;
	onDateChange?: (date: Date) => void;
	onSettings?: () => void;
	fullscreenControls?: ReactNode;
};

export default function ChartCanvas({
	title,
	option,
	description,
	isCalendar,
	currentDate,
	onDateChange,
	onSettings,
	fullscreenControls,
}: Props) {
	const animatedOption = useChartAnimation(option);

	return (
		<ChartCard
			title={title}
			description={description}
			onSettings={onSettings}
			fullscreenControls={fullscreenControls}
		>
			{isCalendar && currentDate && onDateChange && (
				<CalendarHeader
					currentDate={currentDate}
					onChange={onDateChange}
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
	);
}
