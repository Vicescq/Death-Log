import type { TreeStateType } from "../../contexts/treeContext";
import type { DistinctTreeNode, Game, Profile, Subject } from "../../model/TreeNodeModel";
import { getDeaths } from "../../features/treeUtils";
import type { CardModalStateGame, CardModalStateProfile, CardModalStateSubject } from "../Modal";

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

export function createCardModalGameState(node: Game): CardModalStateGame {
    return { name: node.name, dateStartR: node.dateStartR, dateEndR: node.dateEndR };
}

export function createCardModalProfileState(node: Profile): CardModalStateProfile {
    return { name: node.name, dateStartR: node.dateStartR, dateEndR: node.dateEndR };
}

export function createCardModalSubjectState(node: Subject): CardModalStateSubject {
    return { name: node.name, dateStartR: node.dateStartR, dateEndR: node.dateEndR, composite: node.composite, reoccuring: node.reoccurring };
}