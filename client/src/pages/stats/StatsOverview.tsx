import ChartTemplate from "./ChartTemplate";
import { StatsQuery } from "../../services/stats-query/StatsQuery";
import useMediaQuery from "../../hooks/useMediaQuery";
import {
	defaultDeathFilters,
	defaultDeathSortSettings,
	defaultFilters,
	defaultSortSettings,
} from "../../../shared/defaults";
import { useState } from "react";

export default function StatsOverview() {
	const barOption = StatsQuery.fetching("subjects")
		.scopedByGroup(["am9QhjpC&FGzOQQcA"])
		.filter(defaultFilters)
		.sort({ sortingKey: "deaths", ascending: false })
		.limit(10)
		.toBarChart();

	const calendarDeaths = StatsQuery.fetching("deaths")
		.scopedGlobally()
		.filter(defaultDeathFilters)
		.sort(defaultDeathSortSettings);

	function GridLayout() {
		return (
			<>
				<div className="grid gap-6 lg:grid-cols-2">
					<ChartTemplate option={barOption} />
					<ChartTemplate option={barOption} />
				</div>

				<div className="grid gap-6 lg:grid-cols-2">
					<ChartTemplate option={barOption} height={300} />
					<ChartTemplate option={barOption} height={300} />
				</div>
			</>
		);
	}

	function LinearLayout() {
		return (
			<>
				<ChartTemplate option={barOption} />
				<ChartTemplate option={barOption} />
				<ChartTemplate option={barOption} height={300} />
				<ChartTemplate option={barOption} height={300} />
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
					<ChartTemplate option={barOption} />
				</div>
			</>
		);
	}
}
