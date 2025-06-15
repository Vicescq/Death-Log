import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../firebase-config";
import type { UserContextType } from "../contexts/userContext";
import TreeContextManager from "../features/TreeContextManager";
import IndexedDBService from "../services/IndexedDBService";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import type { HistoryContextType } from "../contexts/historyContext";
import APIService from "../services/APIService";
import { URLMapContext, type URLMapContextType } from "../contexts/urlMapContext";
import URLMapContextManager from "../features/URLMapContextManager";

export default function useAuthObserver(setUser: UserContextType[1], setTree: TreeContextType[1], setHistory: HistoryContextType[1], setURLMap: URLMapContextType[1]) {
    useEffect(() => {
        const unsubcribe = onAuthStateChanged(auth, (user) => {
            try {
                if (user) {
                    console.log("SIGNED IN!");
                    (async () => {
                        const token = await user.getIdToken();
                        if (user.email) {
                            localStorage.setItem("email", user.email);

                            const nodes = await IndexedDBService.getNodes(user.email);
                            const urlMappings = await IndexedDBService.getURLMappings(user.email);

                            const newTree = TreeContextManager.initTree(nodes);
                            const newURLMap = URLMapContextManager.initURLMap(urlMappings);

                            setTree(newTree);
                            setURLMap(newURLMap);
                        }
                    })();
                }
                else {
                    console.log("SIGNED OUT!");
                    (async () => {
                        localStorage.setItem("email", "__LOCAL__");

                        const nodes = await IndexedDBService.getNodes("__LOCAL__");
                        const urlMappings = await IndexedDBService.getURLMappings("__LOCAL__");

                        const newTree = TreeContextManager.initTree(nodes);
                        const newURLMap = URLMapContextManager.initURLMap(urlMappings);

                        setTree(newTree);
                        setURLMap(newURLMap)
                    })();
                }
                setHistory({ newActionStartIndex: 0, actionHistory: [] });
                setUser(user);
            }
            catch (error) {
                console.error(error)
            }
        });
        return unsubcribe;
    }, [])
}