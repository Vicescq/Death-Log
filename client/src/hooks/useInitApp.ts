import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import LocalDB from "../services/LocalDB";
import useOnlineStatus from "./useOnlineStatus";

/**
 * Resolves which identity the app should load data under. Render-safe (no writes).
 * Returns null when the identity isn't knowable yet (online but Clerk hasn't
 * settled), so the caller waits instead of loading under a transient guess.
 */
function resolveTargetEmail(
	online: boolean,
	isLoaded: boolean,
	isSignedIn: boolean | undefined,
	email: string | undefined,
): string | null {
	// offline: Clerk can't settle — load under the last-known stored identity
	if (!online) {
		return LocalDB.peekUserEmail();
	}
	// online but Clerk not settled yet: wait
	if (!isLoaded) return null;
	return isSignedIn && email ? email : "__LOCAL__";
}

export default function useInitApp() {
	const { isSignedIn, user, isLoaded } = useUser();
	const hydrate = useDeathLogStore((state) => state.hydrate);
	const online = useOnlineStatus();

	const targetEmail = resolveTargetEmail(
		online,
		isLoaded,
		isSignedIn,
		user?.primaryEmailAddress?.emailAddress,
	);

	useEffect(() => {
		if (targetEmail === null) return; // identity unknown; wait for Clerk

		let cancelled = false;
		hydrate(targetEmail, () => cancelled);
		return () => {
			cancelled = true; // a newer identity supersedes this run
		};
	}, [targetEmail, hydrate]);
}
