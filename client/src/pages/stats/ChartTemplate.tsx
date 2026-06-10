import EChartsReact from "react-echarts-library";
import useChartAnimation from "./hooks/useChartAnimation";
import darkerChalk from "../../../shared/darker_chalk.json";
import type { EChartsOption } from "echarts";

type Props = {
	option: EChartsOption;
	height?: number;
};

export default function ChartTemplate({ option }: Props) {
	option = useChartAnimation(option);

	return (
		<div className="border-base-300 bg-base-200 rounded-2xl border p-2 shadow-lg">
			<EChartsReact
				option={option}
				theme={darkerChalk}
				style={{ height: "350px" }}
			/>
		</div>
	);
}
