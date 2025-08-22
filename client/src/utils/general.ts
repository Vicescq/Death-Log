export function createShallowCopyMap<T>(map: Map<string, T>) {
    const objLiteralFromTree = Object.fromEntries(map);
    const objLiteralFromTreeShallowCopy = { ...objLiteralFromTree };
    return new Map(Object.entries(objLiteralFromTreeShallowCopy));
}