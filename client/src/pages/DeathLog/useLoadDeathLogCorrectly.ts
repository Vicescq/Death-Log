import { useEffect, useState } from "react";
import type { Tree } from "../../model/TreeNodeModel";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

export default function useLoadDeathLogCorrectly(tree: Tree, parentID: string) {

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

    useConsoleLogOnStateChange(tree, "TREE:", tree);

    return { loading, deletedID }
}