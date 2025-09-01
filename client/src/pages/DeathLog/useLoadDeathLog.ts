import { useEffect, useState } from "react";
import IndexedDBService from "../../services/IndexedDBService";
import { useTreeStore } from "../../stores/useTreeStore";
import type { Tree } from "../../model/TreeNodeModel";
import { assertIsNonNull } from "../../utils";

export default function useLoadDeathLog(tree: Tree, parentID: string) {

    const initTree = useTreeStore((state) => state.initTree);
    const [loading, setLoading] = useState(true);
    const [deletedID, setDeletedID] = useState(false);

    useEffect(() => {
        if (tree.size == 0) {
            const localStorageRes = localStorage.getItem("email");
            assertIsNonNull(localStorageRes);
            IndexedDBService.getNodes(localStorageRes)
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
            if (parentID != "ROOT_NODE" && !tree.get(parentID)) {
                setDeletedID(true);
            }
        }
    }, [tree.size]);

    return { loading, deletedID }
}