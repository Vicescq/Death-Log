import type { ModalListItemToggleType } from "../components/modals/ModalListItemTypes";
import type { TreeStateType } from "../contexts/treeContext";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import TreeContextService from "../services/TreeContextService";

export function changeToggleSettingState(addItemCardModalListItemArray: ModalListItemToggleType[], status: boolean, index: number) {
    return addItemCardModalListItemArray.map((li, i) => {
        if (index == i) {
            li = { ...li, enable: status };
        }
        return li;
    });
}

export function changeCompletedStatus(node: DistinctTreeNode, newStatus: boolean, tree: TreeStateType) {
    const dateEnd = newStatus ? new Date().toISOString() : null;
    const updatedNode: DistinctTreeNode = {
        ...node,
        completed: newStatus,
        dateEnd: dateEnd,
    };
    const { treeCopy, actions } = TreeContextService.updateNode(
        tree,
        updatedNode,
    );
    return {treeCopy, actions};
}