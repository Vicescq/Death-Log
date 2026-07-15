import { useEffect } from "react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { MultitabSync } from "../services/MultitabSync";

export default function useMultitabSync() {
	const refreshTree = useDeathLogStore((state) => state.refreshTree);

	useEffect(() => {
		return MultitabSync.subscribe((message) => {
			if (message === "reload") {
				location.reload();
			} else {
				refreshTree();
			}
		});
	}, [refreshTree]);
}
