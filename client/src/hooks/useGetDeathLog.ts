import { useEffect } from "react";
import TreeContextManager from "../features/TreeContextManager";
import type { TreeContextType, TreeStateType } from "../contexts/treeContext";
import IndexedDBService from "../services/IndexedDBService";
import type { UserStateType } from "../contexts/userContext";

export default function useGetDeathLog(tree: TreeStateType, setTree: TreeContextType[1], user: UserStateType) {
    useEffect(() => {
        try {
            (async () => {
                const email = await IndexedDBService.getCurrentUser(); // idk why email could be undefined even if  await is invoked 
                if (email){
                    tree.clear();
                    const nodes = await IndexedDBService.getNodes(email);
                    const newTree = TreeContextManager.initTree(tree, nodes);
                    setTree(newTree);
                }
            })();
        }
        catch (error) {
            console.error(error)
        }
    }, [user]);
}