import { useEffect } from "react";
import { useAuth } from "@clerk/react";
import { useMutation } from "@tanstack/react-query";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { GlobalStatsService } from "../services/stats/GlobalStatsService";
import Backend from "../services/Backend";
import useOnlineStatus from "./useOnlineStatus";

export function useGlobalStatsSync() {
	const isOnline = useOnlineStatus();
	const { isLoaded, isSignedIn, getToken } = useAuth();

	const status = useDeathLogStore((state) => state.status);
	const tree = useDeathLogStore((state) => state.tree);
	const contributeStats = useDeathLogStore(
		(state) => state.crudState.contributeStats,
	);
	const hasFakeData = useDeathLogStore((state) => state.hasFakeData);

	const { mutate: syncStats } = useMutation({
		mutationFn: async () => {
			const token = await getToken();
			if (!token) throw new Error();

			const slice = GlobalStatsService.computeSlice(
				useDeathLogStore.getState().tree,
			);
			const res = await Backend.postGlobalStats(token, slice);
			if (!res.ok) throw new Error();
		},
	});

	const eligible =
		contributeStats &&
		status === "ready" &&
		isLoaded &&
		isSignedIn &&
		!hasFakeData &&
		isOnline;

	useEffect(() => {
		if (!eligible) return;

		const timer = setTimeout(
			syncStats,
			GlobalStatsService.SYNC_DEBOUNCE_MS,
		);
		return () => clearTimeout(timer);
	}, [eligible, tree, syncStats]);
}
