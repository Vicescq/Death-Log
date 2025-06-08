import type { TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { getDeaths } from "../../features/treeUtils";

export function createCardCSS(
    treeNode: DistinctTreeNode,
    resetDeathTypeMode: boolean,
) {
    const enabledCSS =
        "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]";
    let cardCol = "bg-zomp";
    if (treeNode.type == "subject" && !treeNode.notable) {
        cardCol = "bg-amber-500";
    }

    let cardCSS: string;
    if (treeNode.type == "subject" && treeNode.completed && !treeNode.notable) {
        cardCSS = "bg-red-800 text-amber-200";
    } else {
        cardCSS = treeNode.completed
            ? "bg-raisinblack text-amber-200"
            : `${cardCol} text-black`;
    }

    const readOnlyToggleCSS = treeNode.completed ? enabledCSS : "";
    const resetToggleCSS = resetDeathTypeMode ? enabledCSS : "";
    const settersBtnDisplay = treeNode.completed ? "hidden" : "";
    const readOnlyEnabledCSS = treeNode.completed
        ? "bg-amber-200 rounded-l shadow-[5px_2px_0px_rgba(0,0,0,1)]"
        : "";
    return {
        cardCSS,
        readOnlyToggleCSS,
        resetToggleCSS,
        settersBtnDisplay,
        readOnlyEnabledCSS,
    };
}

export function generateCardDeathCounts(
    treeNode: DistinctTreeNode,
    tree: TreeStateType,
) {
    const deathCount = getDeaths(treeNode, tree, "both");
    const fullTries = getDeaths(treeNode, tree, "fullTries");
    const resets = getDeaths(treeNode, tree, "resets");
    return { deathCount, fullTries, resets };
}