import useOnlineStatus from "../../../hooks/useOnlineStatus";
import { useStatsContext } from "../hooks/useStatsContext";
import OwnerProfileHeader from "./OwnerProfileHeader";
import SharedProfileHeader from "./SharedProfileHeader";

export default function ProfileHeader() {
	const ctx = useStatsContext();
	const isOnline = useOnlineStatus();

	if (!isOnline) {
		return (
			<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
				{ctx.isSharedPage
					? "You cannot view a shared page while offline!"
					: "You're offline. Reconnect to view your profile metrics."}
			</div>
		);
	}

	if (!ctx.isSharedPage && ctx.username === "") {
		return (
			<div className="border-base-300 bg-base-300 rounded-2xl border p-6 shadow-sm">
				Sign in or register an account in order to share your Death Log
			</div>
		);
	}

	if (ctx.isSharedPage) {
		return (
			<SharedProfileHeader
				username={ctx.username}
				profile={ctx.profile}
			/>
		);
	}
	return <OwnerProfileHeader tables={ctx.tables} profile={ctx.profile} />;
}
