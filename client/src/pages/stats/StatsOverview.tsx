import ChartTemplate from "./ChartTemplate";
import {
	collectNodes,
	createBarChartOptions,
	createLineChartOptions,
	createPieChartOptions,
	toBarChartData,
} from "./utils";
import useMediaQuery from "../../hooks/useMediaQuery";
import { defaultFilters } from "../../../shared/defaults";

export default function StatsOverview() {
	const barChartData = toBarChartData(
		collectNodes(
			{
				ascending: true,
				sortingKey: "deaths",
			},
			defaultFilters,
			"game",
		),
	);

	const barOption = createBarChartOptions(barChartData);
	const pieOption = createPieChartOptions(barChartData);
	const lineOption = createLineChartOptions(barChartData);

	function GridLayout() {
		return (
			<>
				<div className="grid gap-6 lg:grid-cols-2">
					<ChartTemplate option={pieOption} />
					<ChartTemplate option={lineOption} />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<ChartTemplate option={barOption} height={300} />
					<ChartTemplate option={pieOption} height={300} />
				</div>
			</>
		);
	}

	function LinearLayout() {
		return (
			<>
				<ChartTemplate option={pieOption} />
				<ChartTemplate option={lineOption} />
				<ChartTemplate option={barOption} height={300} />
				<ChartTemplate option={pieOption} height={300} />
			</>
		);
	}

	const { vpMatched } = useMediaQuery("(width >= 1024px)");
	{
		return (
			<>
				<div className="space-y-6">
					<ChartTemplate option={barOption} />
					{vpMatched ? <GridLayout /> : <LinearLayout />}
					<ChartTemplate option={lineOption} />
				</div>
			</>
		);
	}
}
