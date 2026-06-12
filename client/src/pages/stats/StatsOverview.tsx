import GenericChart from "./GenericChart";
import { StatsQuery } from "../../services/stats-query/StatsQuery";
import useMediaQuery from "../../hooks/useMediaQuery";
import { defaultFilters } from "../../../shared/defaults";
import HeatMapCalendar from "./HeatMapCalendar";

export default function StatsOverview() {
	const barOption = StatsQuery.fetching("subjects")
		.scopedByGroup(["am9QhjpC&FGzOQQcA"])
		.filter(defaultFilters)
		.sort({ sortingKey: "deaths", ascending: false })
		.limit(10)
		.toBarChart({ title: "Test" });

	function GridLayout() {
		return (
			<>
				<div className="grid gap-6 lg:grid-cols-2">
					<HeatMapCalendar title="Deaths" />
					<GenericChart option={barOption} />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<GenericChart option={barOption} />
					<GenericChart option={barOption} />
				</div>
			</>
		);
	}

	function LinearLayout() {
		return (
			<>
				<HeatMapCalendar title="Deaths" />{" "}
				<GenericChart option={barOption} />
				<GenericChart option={barOption} />
				<GenericChart option={barOption} />
			</>
		);
	}

	const { vpMatched } = useMediaQuery("(width >= 1024px)");
	{
		return (
			<>
				<div className="space-y-6">
					{vpMatched ? <GridLayout /> : <LinearLayout />}
				</div>
			</>
		);
	}
}
