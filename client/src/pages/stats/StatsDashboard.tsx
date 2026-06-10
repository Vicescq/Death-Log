import NavBar from "../../components/nav-bar/NavBar";
import ProfileHeader from "./ProfileHeader";
import StatsNav from "./StatsNav";
import { Outlet } from "react-router";

export default function StatsDashboard() {
	return (
		<>
			<NavBar />

			<div className="bg-base-100 min-h-screen py-6">
				<div className="m-auto w-full space-y-6 px-3 sm:max-w-[85%] sm:px-0 lg:max-w-6xl">
					<div className="border-base-300 bg-accent/5 rounded-lg border px-4 py-3">
						<span className="text-sm opacity-80">
							Best viewed on desktop for optimal chart
							visualization.
						</span>
					</div>

					<ProfileHeader />

					<StatsNav />

					<Outlet />
				</div>
			</div>
		</>
	);
}
