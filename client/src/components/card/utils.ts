import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { CardMainPageTransitionState } from "../../pages/deathLog/DeathLogRouter";

export function createCardCSS(
    treeNode: DistinctTreeNode,
) {

    const settersCSS = treeNode.completed ? "hidden" : "";
    const highlightingCSS = treeNode.completed ?
        "bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]" : "";
    let reoccurringCSS = "";
    if (treeNode.type == "subject" && treeNode.reoccurring) {
        reoccurringCSS = "hidden";
    }

    const cardCSSConfig = {
        default: "bg-zomp text-black",
        completed: "bg-raisinblack text-amber-200",
        composite: "bg-cyan-800 text-black",
        reoccurring: "bg-hunyadi text-black",
        compositeANDreoccurring: "bg-purple-400 text-black",
    }

    let cardCSS = cardCSSConfig.default;

    if (treeNode.type == "subject") {
        if (treeNode.reoccurring) {
            cardCSS = cardCSSConfig.reoccurring;
        }
    }

    if (treeNode.completed) {
        cardCSS = cardCSSConfig.completed;
    }

    return { cardCSS, settersCSS, highlightingCSS, reoccurringCSS }
}

export function createCardMainPageTransitionState(node: DistinctTreeNode): CardMainPageTransitionState {
    switch (node.type) {
        case "game":
            return { type: "GameToProfiles", parentID: node.id };

        case "profile":
            return { type: "ProfileToSubjects", parentID: node.id };

        case "subject":
            return { type: "Terminal", parentID: "__TERMINAL__" };
    }
}

export function isCardModalStateEqual(cardModalState: DistinctTreeNode, node: DistinctTreeNode) {

    const keys = Object.keys(cardModalState);
    for (let i = 0; i < keys.length; i++) {
        const nodeKey = keys[i] as keyof DistinctTreeNode
        if (nodeKey == "childIDS" || nodeKey == "id" || nodeKey == "parentID") {
            continue;
        }

        if (cardModalState[nodeKey] != node[nodeKey]) {
            return false
        }
    }
    return true
}

export function defaultCardModalDateFormat(isoSTR: string) {
    const dateObj = new Date(isoSTR);
    const year = String(dateObj.getFullYear());
    let month = String(dateObj.getMonth() + 1);
    let day = String(dateObj.getDate());
    if (month.length == 1) {
        month = "0" + month;
    }
    if (day.length == 1) {
        day = "0" + day;
    }
    return `${year}-${month}-${day}`;
}

export function convertDefaultCardModalDateFormatToISO(cardModalDateFormat: string) {
    const parsedDate = cardModalDateFormat.split("-");
    const dateObj = new Date(Number(parsedDate[0]), Number(parsedDate[1]) - 1, Number(parsedDate[2]));
    return dateObj.toISOString();
}

export function isCardModalDateAtLimit(date: string) {
    if (
        Date.parse(
            convertDefaultCardModalDateFormatToISO(
                date,
            ),
        ) >= Date.parse(new Date().toISOString())
    ) {
        date = defaultCardModalDateFormat(
            new Date().toISOString(),
        );
    }
    return date
}

export function getCardDeathCount(node: DistinctTreeNode) {
    let deathCount = 0;
    switch (node.type) {
        case "game":
            deathCount = node.totalDeaths;
            break;
        case "profile":
            deathCount = node.deathEntries.length;
            break;
        case "subject":
            deathCount = node.deaths;
    }
    return deathCount;
}