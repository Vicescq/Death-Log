import { useState, useEffect } from "react";
import type { TreeStateType } from "../contexts/treeContext";

export default function useLoadMainPageCorrectly(tree: TreeStateType, parentID: string) {
    const [loading, setLoading] = useState(true);
    const [deletedID, setDeletedID] = useState(false);

    useEffect(() => {
        if (tree.size != 0) {
            setLoading(false);
            if (!tree.get(parentID)) {
                setDeletedID(true);
            }
        }
    }, [tree.size]);

    return {loading, deletedID}
}