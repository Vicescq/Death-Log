import type { TreeStateType } from "../contexts/treeContext";
import Action from "../model/Action";

export default function migrateAllToDB(tree: TreeStateType) {
    const actions: Action[] = [];
    tree.forEach((node) => {
        actions.push(new Action("update", [node]));
    })
    console.log(actions)
    return actions
}