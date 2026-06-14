import GenericChart from "../charts/GenericChart";
import GenericDeathChart from "../charts/GenericDeathChart";
import HeatMapCalendar from "../charts/HeatMapCalendar";
import {
	allDeathsOnCalendarQuery,
	cumulationDeathsOverTimeQuery,
	deathHierarchyQuery,
	subjectsDeathsVsTimeQuery,
	testNoDataQuery,
	top10GamesMostDeathsQuery,
	top10SubjectsMostDeathsQuery,
	top5BossesMostDeathsQuery,
} from "../../../services/stats-query/preset-queries";

export default function StatsOverview() {
	function Charts() {
		return (
			<>
				<HeatMapCalendar query={allDeathsOnCalendarQuery} />
				<GenericChart query={top10GamesMostDeathsQuery} />
				<GenericChart query={top10SubjectsMostDeathsQuery} />
				<GenericDeathChart query={cumulationDeathsOverTimeQuery} />
				<GenericChart query={top5BossesMostDeathsQuery} />
				<GenericChart query={deathHierarchyQuery} />
				<GenericChart query={subjectsDeathsVsTimeQuery} />
				<GenericChart query={testNoDataQuery} />
			</>
		);
	}

	return (
		<div className="space-y-6">
			<div className="hidden gap-6 lg:grid lg:grid-cols-2">
				<Charts />
			</div>
			<div className="flex flex-col gap-4 lg:hidden">
				<Charts />
			</div>
		</div>
	);
}
