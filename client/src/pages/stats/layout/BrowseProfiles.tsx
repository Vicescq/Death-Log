import { useEffect, useState } from "react";
import Backend from "../../../services/Backend";
import {
	DiscoveredUsersSchema,
	type DiscoveredUsers,
} from "../../../model/discovered-users";
import DiscoveredUserCard from "../components/DiscoveredUserCard";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

export default function BrowseProfiles() {
	const [discovered, setDiscovered] = useState<DiscoveredUsers | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function loadProfiles() {
			setIsLoading(true);
			setError(null);
			try {
				const res = await Backend.browseProfiles();
				if (!res.ok) {
					setError("Could not load profiles");
					return;
				}

				const result = DiscoveredUsersSchema.safeParse(await res.json());
				if (!result.success) {
					setError("Could not load profiles");
					return;
				}
				setDiscovered(result.data);
			} catch {
				setError("Could not load profiles");
			} finally {
				setIsLoading(false);
			}
		}

		loadProfiles();
	}, []);

	const users = discovered?.randomUsers ?? [];
	useConsoleLogOnStateChange(discovered, discovered);

	return (
		<div className="space-y-6">
			<div className="border-accent pb-2">
				<h2 className="text-2xl font-bold">Discover Users</h2>
			</div>

			{isLoading && (
				<div className="flex justify-center py-16">
					<span className="loading loading-spinner loading-lg text-accent" />
				</div>
			)}

			{error && !isLoading && (
				<div className="border-error/40 bg-error/10 text-error rounded-lg border p-4 text-center">
					{error}
				</div>
			)}

			{!isLoading &&
				!error &&
				discovered &&
				(users.length === 0 ? (
					<div className="border-base-300 text-base-content/60 rounded-lg border border-dashed py-16 text-center">
						No users to discover yet.
					</div>
				) : (
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
						{users.map((user) => (
							<DiscoveredUserCard
								key={user.username}
								user={user}
							/>
						))}
					</div>
				))}
		</div>
	);
}
