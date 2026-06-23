import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import useOnlineStatus from "./useOnlineStatus";

export default function useInitApp() {
	const { user, isLoaded } = useUser();
	const refreshTree = useDeathLogStore((state) => state.refreshTree);
	const online = useOnlineStatus();

	useEffect(() => {
		if (!online) {
		} else if (!isLoaded) {
			return;
		} else {
		}
	}, [online, isLoaded, user]);

	useEffect(() => {
		refreshTree();
	}, []);
}
