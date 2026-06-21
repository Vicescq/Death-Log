import { UserButton } from "@clerk/clerk-react";
import useOnlineStatus from "../../hooks/useOnlineStatus";

export default function ProfileButton({ className }: { className?: string }) {
	const online = useOnlineStatus();

	if (!online) {
		return (
			<div
				className="tooltip tooltip-bottom"
				data-tip="Offline — profile unavailable"
			>
				<div className="avatar avatar-placeholder">
					<div className="bg-neutral text-neutral-content w-7 rounded-full opacity-50">
						<svg
							viewBox="0 0 24 24"
							className="h-4 w-4"
							fill="currentColor"
							aria-hidden
						>
							<path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z" />
						</svg>
					</div>
				</div>
			</div>
		);
	}

	return (
		<button className={className}>
			<UserButton />
		</button>
	);
}
