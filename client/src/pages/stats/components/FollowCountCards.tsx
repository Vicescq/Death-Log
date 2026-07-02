import type { SharedProfileView } from "../../../model/stats-query-model/shared-charts";
import FollowCountCard from "./FollowCountCard";

type Props = {
	username: string;
	profile: SharedProfileView | null;
	tone?: "accent" | "dark";
};

export default function FollowCountCards({
	username,
	profile,
	tone = "accent",
}: Props) {
	const followers = profile ? profile.followerCount : "N/A";
	const following = profile ? profile.followingCount : "N/A";

	return (
		<div className="mt-6 grid grid-cols-2 gap-4">
			<FollowCountCard
				label="Followers"
				count={followers}
				to={`/profiles/${username}/followers`}
				tone={tone}
			/>
			<FollowCountCard
				label="Following"
				count={following}
				to={`/profiles/${username}/following`}
				tone={tone}
			/>
		</div>
	);
}
