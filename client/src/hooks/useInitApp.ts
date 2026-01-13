import { useEffect } from "react";
import LocalDB from "../services/LocalDB";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { useUser } from "@clerk/clerk-react";
import { refreshTree } from "../stores/utils";

export default function useInitApp() {

    const initTree = useDeathLogStore((state) => state.initTree);
    const { isSignedIn, user, isLoaded } = useUser();


    useEffect(() => {

        if (navigator.onLine && isLoaded) {
            if (isSignedIn && user && user.primaryEmailAddress?.emailAddress) { // observe user.primaryEmailAddress?.emailAddress edge case
                LocalDB.setUserEmail(user.primaryEmailAddress?.emailAddress);
            }
            else {
                LocalDB.setUserEmail("__LOCAL__");
            }
        }

        refreshTree(initTree);

    }, [user, isLoaded, isSignedIn]);
}