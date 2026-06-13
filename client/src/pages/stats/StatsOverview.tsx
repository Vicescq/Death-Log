import GenericChart from "./GenericChart";
import GenericDeathChart from "./GenericDeathChart";
import HeatMapCalendar from "./HeatMapCalendar";
import {
	allDeathsOnCalendarQuery,
	cumulationDeathsOverTimeQuery,
	top10GamesMostDeathsQuery,
	top10SubjectsMostDeathsQuery,
	top5BossesMostDeathsQuery,
} from "../../services/stats-query/preset-queries";

export default function StatsOverview() {
	{
		return (
			<>
				<div className="space-y-6">
					<div className="hidden gap-6 lg:grid lg:grid-cols-2">
						<HeatMapCalendar query={allDeathsOnCalendarQuery} />
						<GenericChart query={top10GamesMostDeathsQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
						<GenericDeathChart
							query={cumulationDeathsOverTimeQuery}
						/>
						<GenericChart query={top5BossesMostDeathsQuery} />
					</div>
					<div className="flex flex-col gap-4 lg:hidden">
						<HeatMapCalendar query={allDeathsOnCalendarQuery} />
						<GenericChart query={top10GamesMostDeathsQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
						<GenericDeathChart
							query={cumulationDeathsOverTimeQuery}
						/>
						<GenericChart query={top5BossesMostDeathsQuery} />
					</div>
				</div>
			</>
		);
	}
}
