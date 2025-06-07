import type { ModalListItemToggleType } from "../components/modals/ModalListItemTypes";
import type { TreeStateType } from "../contexts/treeContext";
import type { DistinctTreeNode } from "../model/TreeNodeModel";
import TreeContextManager from "../features/TreeContextManager";
import type { ToggleSetting } from "../components/Toggle";

export function changeToggleSettingState(addItemCardModalListItemArray: ModalListItemToggleType[], newStatus: boolean, index: number, toggleSetting?: ToggleSetting) {

    function isSubjectContext(setting: ToggleSetting) {
        return setting == "boss" || setting == "location" || setting == "other"
    }

    const updatedAddItemCardModalListItemArray = addItemCardModalListItemArray.map((li, i) => {
        if (index == i) {
            li = { ...li, enable: newStatus }
        }
        return li;
    })

    updatedAddItemCardModalListItemArray.forEach((li, i) => {
        // if li is NOT the current target AND li is either game, location ... AND target in question is either game, location ... then turn it off
        if ((i != index) && isSubjectContext(li.toggleSetting) && isSubjectContext(updatedAddItemCardModalListItemArray[index].toggleSetting)) {
            updatedAddItemCardModalListItemArray[i] = { ...li, enable: false };
        }

        // if target AND 
        else if ((i == index) && isSubjectContext(li.toggleSetting) && (newStatus == false)) {
            updatedAddItemCardModalListItemArray[i] = { ...li, enable: true };
        }
    })

    return updatedAddItemCardModalListItemArray
}


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