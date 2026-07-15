import { useEffect } from "react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { useAutoBackup } from "./useAutoBackup";
import { useGlobalStatsSync } from "./useGlobalStatsSync";

export default function useInitApp() {
	const refreshTree = useDeathLogStore((state) => state.refreshTree);

	useAutoBackup();
	useGlobalStatsSync();

	useEffect(() => {
		refreshTree();
	}, []);
}
