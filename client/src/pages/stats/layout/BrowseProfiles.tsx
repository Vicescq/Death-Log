import { useUser } from "@clerk/react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import Backend from "../../../services/Backend";
import { DiscoveredUsersSchema } from "../../../model/discovered-users";
import DiscoveredUserCard from "../components/DiscoveredUserCard";
import ProfileSearch from "../components/ProfileSearch";
import Spinner from "../../../components/Spinner";
import StatsErrorMessage from "../../../components/StatsErrorMessage";
import useOnlineStatus from "../../../hooks/useOnlineStatus";

export default function BrowseProfiles() {
	const { user } = useUser();
	const username = user?.username ?? undefined;
	const isOnline = useOnlineStatus();

	const { data, isLoading, isError, isSuccess } = useQuery({
		queryKey: ["browseProfiles", username],
		queryFn: async ({ signal }) => {
			const res = await Backend.browseProfiles(username, signal);
			if (!res.ok) throw new Error();
			return DiscoveredUsersSchema.parse(await res.json());
		},
	});

	const users = data?.randomUsers ?? [];

	if (!isOnline) {
		return (
			<div className="border-base-300 rounded-lg py-8 text-center">
				Cannot browse profiles if offline!
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{isLoading && <Spinner />}

			{isError && <StatsErrorMessage message="Could not load profiles" />}

			{isSuccess && (
				<>
					<ProfileSearch />

					<div className="border-accent">
						<h2 className="text-2xl font-bold">Discover Users</h2>
					</div>

					{users.length === 0 ? (
						<StatsErrorMessage message="No users to discover yet." />
					) : (
						<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
							{users.map((discoveredUser) => (
								<DiscoveredUserCard
									key={discoveredUser.username}
									user={discoveredUser}
								/>
							))}
						</div>
					)}

					<div className="divider divider-neutral" />

					<div className="flex justify-center">
						<Link
							to="/stats/popular-profiles"
							className="btn bg-base-300 hover:bg-info w-56 hover:text-black"
						>
							View Popular Profiles
						</Link>
					</div>
				</>
			)}
		</div>
	);
}
