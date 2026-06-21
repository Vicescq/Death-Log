import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import LocalDB from "../services/LocalDB";
import useOnlineStatus from "./useOnlineStatus";

export default function useInitApp() {
	const { user, isLoaded } = useUser();
	const refreshTree = useDeathLogStore((state) => state.refreshTree);
	const online = useOnlineStatus();

	useEffect(() => {
		let email: string;
		if (!online) {
			email = LocalDB.getUserEmail();
		} else if (!isLoaded) {
			return;
		} else {
			email = user?.primaryEmailAddress?.emailAddress ?? "__LOCAL__";
		}
		LocalDB.setUserEmail(email);
		refreshTree();
	}, [online, isLoaded, user, refreshTree]);
}
