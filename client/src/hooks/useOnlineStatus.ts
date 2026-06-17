import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
	window.addEventListener("online", callback);
	window.addEventListener("offline", callback);
	return () => {
		window.removeEventListener("online", callback);
		window.removeEventListener("offline", callback);
	};
}

/**
 * Reactive connectivity status — re-renders on the window online/offline events.
 * Backed by `useSyncExternalStore` for a tear-safe, effect-free subscription.
 */
export default function useOnlineStatus() {
	return useSyncExternalStore(subscribe, () => navigator.onLine);
}
