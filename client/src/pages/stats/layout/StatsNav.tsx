import { Link, useLocation } from "react-router";

const TABS = [
	{ to: "/stats", label: "Overview", exact: true },
	{ to: "/stats/specialized", label: "Specialized", exact: false },
	{ to: "/stats/manage", label: "Manage", exact: false },
] as const;

export default function StatsNav() {
	const location = useLocation();
	const path = location.pathname.replace(/\/+$/, "") || "/stats";

	return (
		<div className="border-neutral flex flex-col items-center gap-4 border-b-2 p-1 sm:flex-row">
			<div className="tabs tabs-bordered">
				{TABS.map((tab) => {
					const active = tab.exact
						? path === tab.to
						: path.startsWith(tab.to);
					return (
						<Link
							key={tab.to}
							to={tab.to}
							className={`tab ${active ? "tab-active" : ""}`}
							role="tab"
						>
							{tab.label}
						</Link>
					);
				})}
			</div>
		</div>
	);
}
