import type { TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import { getDeaths } from "../../features/treeUtils";

export function createCardCSS(
    treeNode: DistinctTreeNode,
    resetDeathTypeMode: boolean,
) {

    const settersCSS = treeNode.completed ? "hidden" : "";
    const highlightingCSS = treeNode.completed ?
        "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    const resetToggleHighlightingCSS = resetDeathTypeMode ? "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    let reoccurringCSS = "";
    if (treeNode.type == "subject" && treeNode.reoccurring) {
        reoccurringCSS = "hidden";
    }


    const cardCSSConfig = {
        default: "bg-zomp text-black",
        completed: "bg-raisinblack text-amber-200",
        unotable: "bg-amber-500 text-black",
        composite: "bg-cyan-800 text-black",
        reoccurring: "bg-lime-300 text-black",
    }

    let cardCSS = "";

    if (treeNode.type == "subject") {
        if (!treeNode.notable && !treeNode.completed) {
            cardCSS = cardCSSConfig.unotable;
        }
        else if (treeNode.composite && !treeNode.completed) {
            cardCSS = cardCSSConfig.composite;
        }
        else if (treeNode.reoccurring) {
            cardCSS = cardCSSConfig.reoccurring;
        }
        else {
            if (!treeNode.completed) {
                cardCSS = cardCSSConfig.default;
            }
            if (treeNode.completed) {
                cardCSS = cardCSSConfig.completed;
            }
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



    return { cardCSS, settersCSS, highlightingCSS, resetToggleHighlightingCSS, reoccurringCSS }
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