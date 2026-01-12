import type { DistinctTreeNode, Profile, SubjectContext, Tree } from "../../model/TreeNodeModel";
import { assertIsNonNull, assertIsProfile, assertIsSubject } from "../../utils";
import type { BreadcrumbMember } from "./DeathLogBreadcrumb";

export function calcRequiredPages(size: number, pageSize: number) {
    return Math.max(1, Math.ceil(size / pageSize));
}

export function paginateCardArray(paginatedCards: React.JSX.Element[][], cards: React.JSX.Element[], maxPage: number, maxItemPerPage: number) {
    let sliceIndexStart = 0
    let sliceIndexEnd = maxItemPerPage
    for (let i = 0; i < maxPage; i++) {
        paginatedCards.push(cards.slice(sliceIndexStart, sliceIndexEnd));
        sliceIndexStart += maxItemPerPage;
        sliceIndexEnd += maxItemPerPage;
    }
}

export function mapContextKeyToProperStr(contextKey: SubjectContext) {
    const subjectContextMap = {
        "boss": "Boss",
        "location": "Location",
        "other": "Other",
        "genericEnemy": "Generic Enemy",
        "miniBoss": "Mini Boss"
    }
    return subjectContextMap[contextKey]
}

export function mapProperStrToContextKey(properStr: string): SubjectContext {
    const properStrMap: Record<string, SubjectContext> = {
        "Boss": "boss",
        "Location": "location",
        "Other": "other",
        "Generic Enemy": "genericEnemy",
        "Mini Boss": "miniBoss"
    }
    return properStrMap[properStr]
}

export function calcDeaths(node: DistinctTreeNode, tree: Tree) {
    let sum = 0;
    switch (node.type) {
        case "game":
            node.childIDS.forEach((id) => {
                const profile = tree.get(id);
                if (profile) { // assertIsNonNull bug during deleteNode, so decided to use if {...} instead
                    profile.childIDS.forEach((id) => {
                        const subject = tree.get(id);
                        if (subject) {
                            assertIsSubject(subject);
                            sum += subject.deaths;
                        }
                    })
                }
            })
            return sum
        case "profile":
            node.childIDS.forEach((id) => {
                const subject = tree.get(id);
                if (subject) {
                    assertIsSubject(subject);
                    sum += subject.deaths;
                }
            })
            return sum;
        default:
            return node.deaths;
    }
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

export function formatBreadcrumbMembers(breadcrumbMembers: BreadcrumbMember[], vpMatchedHighest: boolean, vpMatchedHigh: boolean, vpMatchedMid: boolean): BreadcrumbMember[] {
    let formattedBreadcrumbMembers: BreadcrumbMember[] = [
        { name: "Death Log", link: "/log" },
        ...breadcrumbMembers,
    ];

    if (formattedBreadcrumbMembers.length == 4) {
        if (!vpMatchedMid) { // condense first 3
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }, { name: formattedBreadcrumbMembers[1].name, link: formattedBreadcrumbMembers[1].link }, { name: formattedBreadcrumbMembers[2].name, link: formattedBreadcrumbMembers[2].link }] }, ...formattedBreadcrumbMembers.slice(3)];
        }

        else if (!vpMatchedHigh) { // condense first 2
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }, { name: formattedBreadcrumbMembers[1].name, link: formattedBreadcrumbMembers[1].link }] }, ...formattedBreadcrumbMembers.slice(2)];
        }

        else if (!vpMatchedHighest) { // condense first
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }] }, ...formattedBreadcrumbMembers.slice(1)];
        }
    }

    else if (formattedBreadcrumbMembers.length == 3) {
        if (!vpMatchedMid) { // condense first 2
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }, { name: formattedBreadcrumbMembers[1].name, link: formattedBreadcrumbMembers[1].link }] }, ...formattedBreadcrumbMembers.slice(2)];
        }

        else if (!vpMatchedHigh) { // condense first
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }] }, ...formattedBreadcrumbMembers.slice(1)];
        }
    }

    else if (formattedBreadcrumbMembers.length == 2) {
        if (!vpMatchedMid) { // condense first
            formattedBreadcrumbMembers = [{ link: "", name: "...", condensedMembers: [{ name: formattedBreadcrumbMembers[0].name, link: formattedBreadcrumbMembers[0].link }] }, ...formattedBreadcrumbMembers.slice(1)];
        }
    }
    return formattedBreadcrumbMembers
}

export function cardHasBeenEdited(original: DistinctTreeNode, modalState: DistinctTreeNode, parentNode: Profile | null, parentModalState: Profile | null) {
    if (original.name != modalState.name) {
        return true;
    }

    if (defaultCardModalDateFormat(original.dateStart) != defaultCardModalDateFormat(modalState.dateStart)) { // time resets if change to same date
        return true;
    }

    if (original.dateEnd && modalState.dateEnd && (defaultCardModalDateFormat(original.dateEnd) != defaultCardModalDateFormat(modalState.dateEnd))) {
        return true;
    }

    if (original.dateStartRel != modalState.dateStartRel) {
        return true;
    }

    if (original.dateEndRel != modalState.dateEndRel) {
        return true;
    }

    if (original.notes != modalState.notes) {
        return true;
    }

    if (original.type == "subject" && modalState.type == "subject") {
        if (original.reoccurring != modalState.reoccurring) {
            return true
        }
        if (original.timeSpent != modalState.timeSpent) {
            return true
        }
        if (original.context != modalState.context) {
            return true
        }

        if (parentNode && parentModalState){
            // if(parentNode.groupings)
        }
    }

    return false
}