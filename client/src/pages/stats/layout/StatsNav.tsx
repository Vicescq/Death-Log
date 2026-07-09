import { Link, useLocation } from "react-router";
import { STATS_TABS } from "../../../model/stats-query-model/tabs";

export default function StatsNav() {
	const location = useLocation();
	const path = location.pathname.replace(/\/+$/, "");

	return (
		<div className="border-neutral flex flex-col items-center gap-4 border-b-2 p-1 sm:flex-row">
			<div className="tabs tabs-bordered">
				{STATS_TABS.map((tab) => (
					<Link
						key={tab.localPath}
						to={tab.localPath}
						className={`tab ${path === tab.localPath ? "tab-active" : ""}`}
						role="tab"
					>
						{tab.label}
					</Link>
				))}
			</div>
		</div>
	);
}
