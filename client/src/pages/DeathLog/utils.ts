import type { DistinctTreeNode, SubjectContext } from "../../model/TreeNodeModel";

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

export function calcDeaths(node: DistinctTreeNode){

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
}export function convertDefaultCardModalDateFormatToISO(cardModalDateFormat: string) {
    const parsedDate = cardModalDateFormat.split("-");
    const dateObj = new Date(Number(parsedDate[0]), Number(parsedDate[1]) - 1, Number(parsedDate[2]));
    return dateObj.toISOString();
}

