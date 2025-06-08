import type { TreeStateType } from "../contexts/treeContext";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import TreeContextManager from "../features/TreeContextManager";

export function changeCompletedStatus(node: DistinctTreeNode, newStatus: boolean, tree: TreeStateType) {
    const dateEnd = newStatus ? new Date().toISOString() : null;
    const updatedNode: DistinctTreeNode = {
        ...node,
        completed: newStatus,
        dateEnd: dateEnd,
    };
    const { treeCopy, actions } = TreeContextManager.updateNode(
        tree,
        updatedNode,
    );
    return { treeCopy, actions };
}