import { Link, useLocation } from "react-router";
import type { StatsView } from "../../../model/StatsViewSchema";
import Dropdown from "../../../components/Dropdown";

type Props = {
	allViews: StatsView[];
	activeViewId: string;
	onViewChange: (id: string) => void;
};

export default function StatsNav({ allViews, activeViewId, onViewChange }: Props) {
	const location = useLocation();
	const isActive = (path: string) =>
		new RegExp(`${path}/*$`).test(location.pathname);
	const activeView =
		allViews.find((v) => v.id === activeViewId) ?? allViews[0];
	return (
		<div className="border-neutral flex flex-col items-center gap-4 border-b-2 p-1 sm:flex-row">
			{isActive("/stats") && (
				<Dropdown
					className="w-full sm:w-auto"
					trigger={
						<>
							{activeView.name}
							<span>▾</span>
						</>
					}
					triggerClassName="btn btn-sm btn-accent w-full gap-1"
					contentClassName="menu rounded-lg bg-accent z-10 w-52 shadow text-black mt-1"
				>
					{allViews.map((view) => (
						<li key={view.id}>
							<button
								className={
									activeViewId === view.id ? "active" : ""
								}
								onClick={() => onViewChange(view.id)}
							>
								{view.name}
							</button>
						</li>
					))}
				</Dropdown>
			)}
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
