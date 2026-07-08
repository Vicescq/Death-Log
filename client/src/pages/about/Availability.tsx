import { ClerkFailed, ClerkLoading, useClerk } from "@clerk/react";
import StatusBadge from "./StatusBadge";
import ServerStatus from "./ServerStatus";
import useOnlineStatus from "../../hooks/useOnlineStatus";

export default function Availability() {
	const isOnline = useOnlineStatus();
	const { status } = useClerk();
	return (
		<div>
			<h2 className="mb-3 text-xl font-semibold">Availability</h2>
			<div className="border-base-300 bg-base-200 flex flex-col gap-3 rounded-2xl border p-4">
				<div className="flex items-center justify-between">
					<span className="text-sm">Server</span>
					<ServerStatus isOnline={isOnline} />
				</div>
				<div className="flex items-center justify-between">
					<span className="text-sm">Account Services</span>

					{isOnline ? (
						status === "degraded" ? (
							<StatusBadge tone="warning">Degraded</StatusBadge>
						) : status === "ready" ? (
							<StatusBadge tone="success">
								Operational
							</StatusBadge>
						) : (
							<>
								<ClerkLoading>
									<StatusBadge tone="neutral">
										Checking...
									</StatusBadge>
								</ClerkLoading>

								<ClerkFailed>
									<StatusBadge tone="error">
										Unavailable
									</StatusBadge>
								</ClerkFailed>
							</>
						)
					) : (
						<StatusBadge tone="error">You are offline</StatusBadge>
					)}
				</div>
			</div>
		</div>
	);
}
