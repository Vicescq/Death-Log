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
	isCalendar?: boolean;
	currentDate?: Date;
	onDateChange?: (date: Date) => void;
	onSettings?: () => void;
	hideMenu?: boolean;
};

export default function ChartCanvas({
	title,
	option,
	isCalendar,
	currentDate,
	onDateChange,
	onSettings,
	hideMenu,
}: Props) {
	const animatedOption = useChartAnimation(option);

	return (
		<ChartCard title={title} onSettings={onSettings} hideMenu={hideMenu}>
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
