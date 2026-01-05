import type { SubjectContext } from "../../model/TreeNodeModel";

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