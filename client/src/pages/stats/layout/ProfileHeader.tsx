import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { PRESET_CHARTS } from "../../../services/stats-query/presets";
import { useStatsContext } from "../hooks/useStatsContext";
import type { SharedProfile } from "../../../model/stats-query-model/shared-charts";
import Backend from "../../../services/Backend";
import FeedbackToast from "../../../components/FeedbackToast";

export default function ProfileHeader() {
	const { tables, isSharedPage } = useStatsContext();
	const { getToken } = useAuth();
	const { user } = useUser();
	const [isSharing, setIsSharing] = useState(false);
	const [shareMsg, setShareMsg] = useState<
		| null
		| "Cannot share at this time"
		| "Corrupted data detected, please go to Data Management page"
		| "Sharing was successful!"
	>(null);

	async function handleShare() {
		const token = await getToken();
		if (!token || !user?.username) return;

		setIsSharing(true);
		try {
			const chartSlots = PRESET_CHARTS.map((slot) => {
				const spec = StatsPipeline.Override(slot.id, slot.spec);
				const data = StatsPipeline.Query(spec, tables);
				return StatsPipeline.Share(slot, data);
			});
			const profile: SharedProfile = { chartSlots };
			const res = await Backend.shareProfile(
				token,
				user.username,
				profile,
			);
			if (res.status >= 200 && res.status < 300) {
				setShareMsg("Sharing was successful!");
			} else if (res.status >= 400 && res.status < 500) {
				setShareMsg(
					"Corrupted data detected, please go to Data Management page",
				);
			} else if (res.status >= 500) {
				setShareMsg("Cannot share at this time");
			}
		} catch {
			setShareMsg("Cannot share at this time");
		} finally {
			setIsSharing(false);
		}
	}

	if (user && user.username) {
		return (
			<>
				<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
					<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="border-accent border-b-2 pb-2">
							<h1 className="text-3xl font-bold">
								{user.username}
							</h1>
						</div>

						<div className="flex gap-2">
							<button className="btn btn-primary">Follow</button>
							{!isSharedPage ? (
								<button
									className="btn btn-info"
									onClick={handleShare}
									disabled={isSharing}
								>
									{isSharing ? "Sharing..." : "Share"}
								</button>
							) : null}
						</div>
					</div>

					<div className="mt-6 grid grid-cols-2 gap-4">
						<div className="bg-accent/10 rounded-lg px-4 py-3">
							<div className="text-accent truncate text-2xl font-bold">
								42
							</div>
							<div className="text-xs font-semibold uppercase opacity-70">
								Followers
							</div>
						</div>
						<div className="bg-accent/10 rounded-lg px-4 py-3">
							<div className="text-accent truncate text-2xl font-bold">
								1234
							</div>
							<div className="text-xs font-semibold uppercase opacity-70">
								Following
							</div>
						</div>
					</div>
				</div>
				<FeedbackToast
					bgCSS={
						shareMsg == "Sharing was successful!"
							? "success"
							: "error"
					}
					displayed={shareMsg != null}
					msg={shareMsg ?? "__DEV_ERROR__"}
					onClose={() => setShareMsg(null)}
				/>
			</>
		);
	}

	return (
		<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
			Sign in or register an account in order to share your Death Log
		</div>
	);
}
