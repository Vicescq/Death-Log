import { ClerkDegraded, ClerkFailed } from "@clerk/clerk-react";

export default function ClerkStatusBanner() {
	return (
		<>
			<ClerkDegraded>
				<div className="alert alert-info justify-center rounded-none text-sm">
					Account services are degraded. Some account actions may not
					work right now.
				</div>
			</ClerkDegraded>
			<ClerkFailed>
				<div className="alert alert-error justify-center rounded-none text-sm">
					Account services are currently unavailable.
				</div>
			</ClerkFailed>
		</>
	);
}
