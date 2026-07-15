import { useAuth } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import Backend from "../../../../services/Backend";
import { GlobalStatsCountsSchema } from "../../../../model/DTOs/global-stats";
import useOnlineStatus from "../../../../hooks/useOnlineStatus";
import GlobalStatCard from "./GlobalStatCard";
import { formatCount, shareOfTotal } from "./format";

function Notice({ children }: { children: string }) {
	return (
		<div className="bg-base-200 rounded-2xl p-6 text-center">
			{children}
		</div>
	);
}

export default function StatsGlobal() {
	const { isLoaded, isSignedIn, getToken } = useAuth();
	const isOnline = useOnlineStatus();

	const { data, isPending, isError } = useQuery({
		queryKey: ["global-stats"],
		enabled: isSignedIn && isOnline,

		// once per session
		staleTime: Infinity,
		gcTime: Infinity,
		queryFn: async ({ signal }) => {
			const token = await getToken();
			if (!token) throw new Error();

			const res = await Backend.getGlobalStats(token, signal);
			if (!res.ok) throw new Error();

			const parsed = GlobalStatsCountsSchema.safeParse(await res.json());
			if (!parsed.success) throw new Error();

			return parsed.data;
		},
	});

	if (!isLoaded) return <Notice>Loading...</Notice>;
	if (!isOnline)
		return (
			<Notice>
				You are offline. Global Stats needs a connection to load.
			</Notice>
		);
	if (!isSignedIn)
		return (
			<Notice>
				Sign in to see the community's Global Stats, and to contribute
				your own.
			</Notice>
		);
	if (isPending) return <Notice>Loading community stats...</Notice>;
	if (isError) return <Notice>Could not load community stats.</Notice>;

	return (
		<div className="space-y-8">
			<GlobalStatCard
				size="hero"
				label="Deaths Logged by Everyone"
				value={formatCount(data.deaths)}
				hint="Across every player who contributes stats"
			/>

			<section>
				<h2 className="mb-3 text-sm font-semibold tracking-wide uppercase opacity-60">
					All Time
				</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<GlobalStatCard
						label="Games Logged"
						value={formatCount(data.games)}
						hint="across all players"
					/>
					<GlobalStatCard
						label="Profiles Logged"
						value={formatCount(data.profiles)}
						hint="across all players"
					/>
					<GlobalStatCard
						label="Subjects Logged"
						value={formatCount(data.subjects)}
						hint="across all players"
					/>
				</div>
			</section>

			<section>
				<h2 className="mb-3 text-sm font-semibold tracking-wide uppercase opacity-60">
					Deaths by Category
				</h2>
				<div className="space-y-4">
					<GlobalStatCard
						label="Bosses"
						value={formatCount(data.bossDeaths)}
						hint={shareOfTotal(data.bossDeaths, data.deaths)}
					/>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<GlobalStatCard
							label="Mini Bosses"
							value={formatCount(data.miniBossDeaths)}
							hint={shareOfTotal(
								data.miniBossDeaths,
								data.deaths,
							)}
						/>
						<GlobalStatCard
							label="Locations"
							value={formatCount(data.locationDeaths)}
							hint={shareOfTotal(
								data.locationDeaths,
								data.deaths,
							)}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<GlobalStatCard
							label="Generic Enemies"
							value={formatCount(data.genericDeaths)}
							hint={shareOfTotal(data.genericDeaths, data.deaths)}
						/>
						<GlobalStatCard
							label="Other"
							value={formatCount(data.otherDeaths)}
							hint={shareOfTotal(data.otherDeaths, data.deaths)}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
