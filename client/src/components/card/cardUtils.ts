import type { TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode, Game, Profile, Subject } from "../../model/TreeNodeModel";
import { getDeaths } from "../../contexts/managers/treeUtils";
import type { CardMainPageTransitionState, CardModalStateGame, CardModalStateProfile, CardModalStateSubject } from "./CardTypes";

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
        composite: "bg-cyan-800 text-black",
        reoccurring: "bg-lime-300 text-black",
    }

    let cardCSS = cardCSSConfig.default;

    if (treeNode.type == "subject") {
        if (treeNode.composite) {
            cardCSS = cardCSSConfig.composite;
        }
        else if (treeNode.reoccurring) {
            cardCSS = cardCSSConfig.reoccurring;
        }
    }

    if (treeNode.completed) {
        cardCSS = cardCSSConfig.completed;
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

export function createCardModalState(node: DistinctTreeNode): CardModalStateGame | CardModalStateProfile | CardModalStateSubject {
    switch (node.type) {
        case "game":
            return { name: node.name };
        case "profile":
            return { name: node.name };
        default:
            return { name: node.name, composite: node.composite, reoccurring: node.reoccurring } as CardModalStateSubject;
    }
}

export function createCardMainPageTransitionState(node: DistinctTreeNode): CardMainPageTransitionState {
    switch (node.type) {
        case "game":
            return { type: "GameToProfiles", parentID: node.id };

        case "profile":
            return { type: "ProfileToSubjects", parentID: node.id };
        
        case "subject":
            return {type: "Terminal", parentID: "__TERMINAL__"};
    }
}