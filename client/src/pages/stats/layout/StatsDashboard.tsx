import { useState } from "react";
import NavBar from "../../../components/nav-bar/NavBar";
import ProfileHeader from "./ProfileHeader";
import StatsNav from "./StatsNav";
import { Outlet } from "react-router";
import {
	baseDefaultView,
	customViewTest,
} from "../../../services/stats-query/preset-views";
import type { StatsViewState } from "../hooks/useStatsViews";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

export default function StatsDashboard() {
	const context = useState<StatsViewState>({
		defaultViews: [baseDefaultView],
		customViews: [customViewTest],
		currEditingView: null,
		activeViewId: baseDefaultView.id,
	});
	const [viewsState, setViewsState] = context;
	const allViews = [...viewsState.defaultViews, ...viewsState.customViews];

	function handleActiveViewChange(id: string) {
		setViewsState((prev) => ({ ...prev, activeViewId: id }));
	}

	return (
		<>
			<NavBar />

			<div className="bg-base-100 min-h-screen py-6">
				<div className="m-auto w-full space-y-6 px-3 sm:max-w-[85%] sm:px-0 lg:max-w-6xl">
					<div className="border-base-300 bg-accent/5 rounded-lg border px-4 py-3">
						<span className="text-sm opacity-80">
							Best viewed on desktop for optimal chart
							visualization. Fullscreen view of a chart is also
							available!
						</span>
					</div>

					<ProfileHeader />

					<StatsNav
						allViews={allViews}
						activeViewId={viewsState.activeViewId}
						onViewChange={handleActiveViewChange}
					/>

					<Outlet context={context} />
				</div>
			</div>
		</>
	);
}
