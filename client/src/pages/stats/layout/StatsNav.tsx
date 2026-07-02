import { Link, useLocation, useParams } from "react-router";
import { useUser } from "@clerk/react";
import { useStatsContext } from "../hooks/useStatsContext";
import { STATS_TABS } from "../../../model/stats-query-model/tabs";

export default function StatsNav() {
	const { isSharedPage } = useStatsContext();
	const { username } = useParams();
	const { user } = useUser();
	const location = useLocation();
	const path = location.pathname.replace(/\/+$/, "");

	const isOwnSharedPage = isSharedPage && user?.username === username;

	const tabs = STATS_TABS.map((tab) => ({
		to: isSharedPage
			? tab.sharedPath.replace(":username", username ?? "")
			: tab.localPath,
		label: tab.label,
	}));

	return (
		<div className="border-neutral flex flex-col items-center gap-4 border-b-2 p-1 sm:flex-row">
			<div className="tabs tabs-bordered">
				{tabs.map((tab) => (
					<Link
						key={tab.to}
						to={tab.to}
						className={`tab ${path === tab.to ? "tab-active" : ""}`}
						role="tab"
					>
						{tab.label}
					</Link>
				))}
			</div>

			{isSharedPage && !isOwnSharedPage && (
				<Link
					to="/stats"
					className="btn btn-sm btn-accent hover:bg-accent hover:border-accent mb-2 sm:mb-0 sm:ml-auto"
					role="tab"
				>
					← Back to my profile
				</Link>
			)}
		</div>
	);
}
