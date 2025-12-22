import { useEffect } from "react";
import LocalDB from "../services/LocalDB";
import { useDeathLogStore } from "../stores/useDeathLogStore";
import { useUser } from "@clerk/clerk-react";
import { assertIsNonNull } from "../utils";

export default function useInitApp() {

    const initTree = useDeathLogStore((state) => state.initTree);
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {

        if (navigator.onLine && isLoaded) {
            if (isSignedIn && user) {
                assertIsNonNull(user.primaryEmailAddress?.emailAddress); // possibly fail? why wouldnt a user have a prim email?
                LocalDB.setUserEmail(user.primaryEmailAddress?.emailAddress);
            }
            else {
                LocalDB.setUserEmail("__LOCAL__");
            }
        }

        LocalDB.getNodes().then((nodes) => {
            initTree(nodes);
        }).catch((e) => {
            if (e instanceof Error) {
                console.error(e)
                // throw e
            }
        })


    }, [user, isLoaded, isSignedIn]);

}