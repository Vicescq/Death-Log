import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import NavBar from "../../../components/nav-bar/NavBar";
import Spinner from "../../../components/Spinner";
import DiscoveredUserCard from "../components/DiscoveredUserCard";
import Backend from "../../../services/Backend";
import useOnlineStatus from "../../../hooks/useOnlineStatus";
import StatsErrorMessage from "../../../components/StatsErrorMessage";
import {
	DiscoveredUserListSchema,
	type DiscoveredUser,
} from "../../../model/discovered-users";

export default function FollowList({
	mode,
}: {
	mode: "followers" | "following";
}) {
	const { username = "" } = useParams();
	const navigate = useNavigate();
	const isOnline = useOnlineStatus();

	const {
		data: users,
		isLoading,
		isError,
		isSuccess,
	} = useQuery({
		queryKey: ["follows", mode, username],

		queryFn: async ({ signal }): Promise<DiscoveredUser[] | null> => {
			const res =
				mode === "followers"
					? await Backend.getFollowers(username, signal)
					: await Backend.getFollowing(username, signal);
			if (res.status === 404) return null;
			if (!res.ok) throw new Error();
			return DiscoveredUserListSchema.parse(await res.json());
		},
	});

	const sorted = [...(users ?? [])].sort((a, b) =>
		a.username.localeCompare(b.username),
	);

	return (
		<>
			<NavBar />
			<div className="mt-14 flex justify-center">
				<div className="w-full max-w-3xl space-y-6 px-4 py-8">
					<button
						onClick={() => navigate(-1)}
						className="btn btn-sm btn-ghost w-fit"
					>
						← Back
					</button>

					<div className="border-accent border-b-2 pb-2">
						<h1 className="text-2xl font-bold">
							{username}'s{" "}
							{mode === "followers" ? "Followers" : "Following"}
						</h1>
					</div>

					{!isOnline && (
						<div className="border-base-300 rounded-lg py-16 text-center">
							Cannot view this list while offline!
						</div>
					)}

					{isOnline && isLoading && <Spinner />}

					{isOnline && isError && (
						<StatsErrorMessage message="Could not load this list" />
					)}

					{isOnline && isSuccess && users === null && (
						<div className="border-base-300 rounded-lg py-16 text-center">
							This user doesn't exist.
						</div>
					)}

					{isOnline &&
						isSuccess &&
						users !== null &&
						(sorted.length === 0 ? (
							<div className="border-base-300 rounded-lg py-16 text-center">
								{mode === "followers"
									? "No followers yet."
									: "Not following anyone yet."}
							</div>
						) : (
							<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
								{sorted.map((u) => (
									<DiscoveredUserCard
										key={u.username}
										user={u}
									/>
								))}
							</div>
						))}
				</div>
			</div>
		</>
	);
}
