import GenericChart from "./GenericChart";
import HeatMapCalendar from "./HeatMapCalendar";
import { allDeathsOnCalendarQuery, allSubjectDeathsOverTimeQuery } from "../../services/stats-query/preset-queries";
import { top10SubjectsMostDeathsQuery } from "../../services/stats-query/preset-queries";

export default function StatsOverview() {
	{
		return (
			<>
				<div className="space-y-6">
					<div className="hidden gap-6 lg:grid lg:grid-cols-2">
						<HeatMapCalendar
							title="Deaths"
							query={allDeathsOnCalendarQuery}
						/>
						<GenericChart query={allSubjectDeathsOverTimeQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
					</div>
					<div className="lg:hidden">
						<HeatMapCalendar
							title="Deaths"
							query={allDeathsOnCalendarQuery}
						/>{" "}
						<GenericChart query={top10SubjectsMostDeathsQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
						<GenericChart query={top10SubjectsMostDeathsQuery} />
					</div>
				</div>
			</>
		);
	}
}
