import { Link, Outlet } from "react-router";
import NavBar from "../../../components/nav-bar/NavBar";
import ProfileHeader from "./ProfileHeader";
import StatsNav from "./StatsNav";
import { StatsContext, type StatsContextState } from "../hooks/useStatsContext";

export default function DashboardShell({
	value,
}: {
	value: StatsContextState;
}) {
	return (
		<>
			<NavBar />

			<div className="bg-base-100 min-h-screen py-6">
				<div className="m-auto w-full space-y-6 px-3 sm:max-w-[85%] sm:px-0 lg:max-w-6xl">
					{value.status === "notfound" ? (
						<div className="border-base-300 bg-base-300 flex flex-col items-center gap-4 rounded-2xl border p-10 text-center">
							<p className="text-lg font-semibold">
								This profile doesn't exist or hasn't shared any
								stats.
							</p>
							<Link to="/stats" className="btn btn-accent">
								Go to my profile
							</Link>
						</div>
					) : (
						<>
							<div className="border-base-300 bg-accent/5 rounded-lg border px-4 py-3">
								<span className="text-sm opacity-80">
									Best viewed on desktop for optimal chart
									visualization. Fullscreen view of a chart is
									also available!
								</span>
							</div>

							<StatsContext.Provider value={value}>
								<ProfileHeader />

								<StatsNav />

								<Outlet />
							</StatsContext.Provider>
						</>
					)}
				</div>
			</div>
		</>
	);
}
