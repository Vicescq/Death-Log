import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../firebase-config";
import type { UserContextType } from "../contexts/userContext";

export default function useLoadUserSession(setUser: UserContextType[1]) {
    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("SIGNED IN!");
            }
            else {
                console.log("SIGNED OUT!");

            }
            setUser(user);
        });
        return unsubcribe;
    }, [])
}