import { useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SharedProfileView } from "../../../model/stats-query-model/shared-charts";
import Backend from "../../../services/Backend";
import { FollowStatusSchema } from "../../../model/follow";
import FeedbackToast from "../../../components/FeedbackToast";
import FollowCountCards from "../components/FollowCountCards";
import PreviewToggle from "../components/PreviewToggle";

type Props = {
	username: string;
	profile: SharedProfileView | null;
};

type Toast = { msg: string; css: "info" | "error" } | null;

export default function SharedProfileHeader({ username, profile }: Props) {
	const { user } = useUser();
	const { getToken } = useAuth();
	const myUsername = user?.username;
	const isOwnProfile = myUsername === username;

	const { data: followStatus } = useQuery({
		queryKey: ["followStatus", username],
		enabled: Boolean(myUsername) && !isOwnProfile,
		queryFn: async ({ signal }) => {
			const token = await getToken(); // throws ClerkOfflineError but no need to handle due to offline handling in parent
			if (!token) throw new Error();
			const res = await Backend.getFollowStatus(token, username, signal);
			if (!res.ok) throw new Error();
			return FollowStatusSchema.parse(await res.json());
		},
	});
	const isFollowing = followStatus?.isFollowing ?? false;
	const [toast, setToast] = useState<Toast>(null);
	const queryClient = useQueryClient();

	const followMutation = useMutation({
		mutationFn: async () => {
			const token = await getToken(); // throws ClerkOfflineError but no need to handle due to offline handling in parent
			if (!token) throw new Error();
			const res = isFollowing
				? await Backend.unfollow(token, username)
				: await Backend.follow(token, username);
			if (!res.ok) throw new Error();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["followStatus", username],
			});
			queryClient.invalidateQueries({ queryKey: ["profile", username] });
		},
		onError: () =>
			setToast({
				msg: "Could not complete the follow/unfollow action",
				css: "error",
			}),
	});

	function handleFollow() {
		if (!myUsername) {
			setToast({ msg: "Sign in to follow users.", css: "info" });
			return;
		}
		if (isOwnProfile) {
			setToast({ msg: "You cannot follow yourself.", css: "info" });
			return;
		}
		followMutation.mutate();
	}

	return (
		<>
			<div className="border-primary bg-primary rounded-2xl border p-6 text-black shadow-sm">
				<PreviewToggle />
				<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
					<div className="border-b-2 border-black pb-2">
						<h1 className="text-3xl font-bold">{username}</h1>
					</div>

					<div className="flex w-full gap-2 md:w-auto">
						<button
							className="btn flex-1 border-none bg-black text-white disabled:cursor-not-allowed disabled:bg-black/50 disabled:text-white/70"
							onClick={handleFollow}
							disabled={followMutation.isPending}
						>
							{followMutation.isPending
								? isFollowing
									? "Unfollowing..."
									: "Following..."
								: isFollowing
									? "Unfollow"
									: "Follow"}
						</button>
					</div>
				</div>

				<FollowCountCards
					username={username}
					profile={profile}
					tone="dark"
				/>
			</div>

			<FeedbackToast
				bgCSS={toast?.css ?? "info"}
				msg={toast?.msg ?? ""}
				displayed={toast != null}
				onClose={() => setToast(null)}
			/>
		</>
	);
}
