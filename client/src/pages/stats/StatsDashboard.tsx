import NavBar from "../../components/nav-bar/NavBar";
import {
	collectNodes,
	createBarChartOptions,
	createPieChartOptions,
	createLineChartOptions,
	toBarChartData,
} from "./utils";
import ChartTemplate from "./ChartTemplate";
import ProfileHeader from "./ProfileHeader";
import StatsNav from "./StatsNav";
import useMediaQuery from "../../hooks/useMediaQuery";

export default function StatsDashboard() {
	const barChartData = toBarChartData(
		collectNodes({
			ascending: true,
			sortingKey: "deaths",
		}),
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

	return (
		<>
			<NavBar />

			<div className="bg-base-100 min-h-screen py-6">
				<div className="m-auto w-full space-y-6 px-3 sm:max-w-[85%] sm:px-0 lg:max-w-6xl">
					<div className="border-base-300 bg-accent/5 rounded-lg border px-4 py-3">
						<span className="text-sm opacity-80">
							Best viewed on desktop for optimal chart
							visualization.
						</span>
					</div>

					<ProfileHeader />

					<StatsNav />

					<div className="space-y-6">
						<ChartTemplate option={barOption} />
						{vpMatched ? <GridLayout /> : <LinearLayout />}
						<ChartTemplate option={lineOption} />
					</div>
				</div>
			</div>
		</>
	);
}
