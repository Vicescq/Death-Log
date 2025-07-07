import type { TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { getDeaths } from "../../features/treeUtils";

export type CardCSS = {
    col: string;

}


export function createCardCSS(
    treeNode: DistinctTreeNode,
    resetDeathTypeMode: boolean,
) {
    let cardCSS = "";
    const settersCSS = treeNode.completed ? "hidden" : "";
    const highlightingCSS = treeNode.completed ?
        "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    const resetToggleHighlightingCSS = resetDeathTypeMode ? "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    
    const cardCSSConfig = {
        default: "bg-zomp text-black",
        completed: "bg-raisinblack text-amber-200",
        unotable: "bg-amber-500 text-black",
        unotableCompleted: "bg-red-800 text-amber-200",
    }

    if (treeNode.type == "subject") {
        if (!treeNode.completed && treeNode.notable) {
            cardCSS = cardCSSConfig.default;
        }
        if (treeNode.completed && treeNode.notable) {
            cardCSS = cardCSSConfig.completed;
        }
        if (!treeNode.completed && !treeNode.notable) {
            cardCSS = cardCSSConfig.unotable;
        }
        if (treeNode.completed && !treeNode.notable) {
            cardCSS = cardCSSConfig.unotableCompleted;
        }
    }

    else {
        if (!treeNode.completed) {
            cardCSS = cardCSSConfig.default;
        }
        if (treeNode.completed) {
            cardCSS = cardCSSConfig.completed;
        }
    }

    return { cardCSS, settersCSS, highlightingCSS, resetToggleHighlightingCSS }
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