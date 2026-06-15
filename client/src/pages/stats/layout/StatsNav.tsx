import { Link, useLocation } from "react-router";

export default function StatsNav() {
	const location = useLocation();
	const isActive = (path: string) =>
		new RegExp(`${path}/*$`).test(location.pathname);
	return (
		<div className="border-base-300 border-b">
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
				<Link
					to="/stats/manage"
					className={`tab ${isActive("/stats/manage") ? "tab-active" : ""}`}
					role="tab"
				>
					Manage
				</Link>
			</div>
		</div>
	);
}
