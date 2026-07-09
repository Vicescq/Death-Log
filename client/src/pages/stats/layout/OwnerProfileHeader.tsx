import { useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { useQueryClient } from "@tanstack/react-query";
import { StatsPipeline } from "../../../services/stats-query/StatsPipeline";
import { PRESET_CHARTS } from "../../../services/stats-query/presets";
import type {
	SharedProfile,
	SharedProfileView,
} from "../../../model/stats-query-model/shared-charts";
import type { Tables } from "../../../model/stats-query-model/chart";
import Backend from "../../../services/Backend";
import FeedbackToast from "../../../components/FeedbackToast";
import Modal from "../../../components/Modal";
import FollowCountCards from "../components/FollowCountCards";
import PreviewToggle from "../components/PreviewToggle";
import gear from "../../../assets/settings.svg";

type Props = {
	tables: Tables;
	profile: SharedProfileView | null;
};

export default function OwnerProfileHeader({ tables, profile }: Props) {
	const { getToken } = useAuth();
	const { user } = useUser();
	const queryClient = useQueryClient();
	const settingsModalRef = useRef<HTMLDialogElement>(null);
	const [isSharing, setIsSharing] = useState(false);
	const [isUnsharing, setIsUnsharing] = useState(false);
	const [toast, setToast] = useState<{
		msg: string;
		css: "success" | "error";
	} | null>(null);

	async function handleShare() {
		const token = await getToken(); // throws ClerkOfflineError but no need to handle due to offline handling in parent
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
			if (res.ok) {
				setToast({ msg: "Sharing was successful!", css: "success" });
			} else if (res.status == 422) {
				setToast({
					msg: "Corrupted data detected, please go to Data Management page",
					css: "error",
				});
			} else if (!res.ok) {
				setToast({ msg: "Cannot share at this time", css: "error" });
			}
		} catch {
			setToast({ msg: "Cannot share at this time", css: "error" });
		} finally {
			setIsSharing(false);
		}
	}

	async function handleUnshare() {
		const token = await getToken(); // throws ClerkOfflineError but no need to handle due to offline handling in parent
		if (!token || !user?.username) return;

		setIsUnsharing(true);
		try {
			const res = await Backend.unshareProfile(token, user.username);
			if (res.ok) {
				setToast({ msg: "Profile unshared.", css: "success" });
				queryClient.invalidateQueries({
					queryKey: ["profile", user.username],
				});
			} else {
				setToast({ msg: "Cannot unshare at this time", css: "error" });
			}
		} catch {
			setToast({ msg: "Cannot unshare at this time", css: "error" });
		} finally {
			setIsUnsharing(false);
			settingsModalRef.current?.close();
		}
	}

	if (user && user.username) {
		return (
			<>
				<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
					<PreviewToggle />
					<div className="flex flex-col items-center justify-between gap-4 md:flex-row">
						<div className="border-accent border-b-2 pb-2">
							<h1 className="text-3xl font-bold">
								{user.username}
							</h1>
						</div>

						<div className="flex w-full gap-2 md:w-auto">
							<button
								className="btn btn-info flex-1"
								onClick={handleShare}
								disabled={isSharing}
							>
								{isSharing ? "Sharing..." : "Share"}
							</button>
							<button
								className="btn btn-ghost btn-square"
								onClick={() =>
									settingsModalRef.current?.showModal()
								}
								aria-label="Profile settings"
							>
								<img src={gear} className="h-5 w-5" alt="" />
							</button>
						</div>
					</div>

					<FollowCountCards
						username={user.username}
						profile={profile}
					/>
				</div>
				<FeedbackToast
					bgCSS={toast?.css ?? "error"}
					displayed={toast != null}
					msg={toast?.msg ?? ""}
					onClose={() => setToast(null)}
				/>
				<Modal
					ref={settingsModalRef}
					header="Profile settings"
					closeBtnName="Close"
					content={
						<div className="mt-4 space-y-4">
							<button
								className="btn btn-error w-full"
								onClick={handleUnshare}
								disabled={isUnsharing}
							>
								{isUnsharing
									? "Unsharing..."
									: "Unshare profile"}
							</button>
						</div>
					}
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
