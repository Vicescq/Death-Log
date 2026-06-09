import { Link, useLocation } from "react-router";

export default function StatsNav() {
	const location = useLocation();
	const isActive = (path: string) => location.pathname === path;

	return (
		<div className="border-b border-base-300">
			<div className="tabs tabs-bordered">
				<Link
					to="/stats"
					className={`tab ${isActive("/stats") ? "tab-active" : ""}`}
					role="tab"
				>
					Overview
				</Link>

				<Link
					to="/stats/build"
					className={`tab ${isActive("/stats/build") ? "tab-active" : ""}`}
					role="tab"
				>
					Build Your Own Chart
				</Link>
			</div>
		</div>
	);
}
