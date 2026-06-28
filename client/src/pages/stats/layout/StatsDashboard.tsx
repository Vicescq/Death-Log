import { useMemo } from "react";
import { Outlet } from "react-router";
import NavBar from "../../../components/nav-bar/NavBar";
import ProfileHeader from "./ProfileHeader";
import StatsNav from "./StatsNav";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { StatsContext, type StatsContextState } from "../hooks/useStatsContext";

type Props = {
	isSharedPage?: boolean;
};

export default function StatsDashboard({ isSharedPage }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const tables = useMemo(() => StatsPipeline.Flatten(tree), [tree]);
	const statsContextState = useMemo<StatsContextState>(
		() => ({ tables, isSharedPage }),
		[tables, isSharedPage],
	);

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

					<StatsContext.Provider value={statsContextState}>
						<ProfileHeader />

						<StatsNav />

						<Outlet />
					</StatsContext.Provider>
				</div>
			</div>
		</>
	);
}
