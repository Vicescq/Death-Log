import { useEffect, useState } from "react";
import IndexedDBService from "../services/IndexedDBService";
import { useTreeStore } from "./StateManagers/useTreeStore";
import type { TreeStateType } from "../contexts/treeContext";

export default function useLoadDeathLog(tree: TreeStateType, parentID: string) {
    const initTree = useTreeStore((state) => state.initTree);
    const [loading, setLoading] = useState(true);
    const [deletedID, setDeletedID] = useState(false);

    useEffect(() => {
        if (tree.size == 0) {
            IndexedDBService.getNodes(localStorage.getItem("email")!)
                .then((nodes) => {
                    initTree(nodes);
                })
                .catch((e) => {
                    if (e instanceof Error) {
                        console.error(e.message);
                        throw new Error(e.message);
                    } else {
                        console.error("I HAVE NO IDEA HOW IT GOES HERE");
                        throw new Error("I HAVE NO IDEA HOW IT GOES HERE")
                    }
                });
        }
        if (tree.size != 0) {
            setLoading(false);
            if (!tree.get(parentID)) {
                setDeletedID(true);
            }
        }
    }, [tree.size]);

    return { loading, deletedID }
}