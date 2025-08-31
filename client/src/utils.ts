import type { SelectDropdownOption } from "./components/SelectDropdown";
import type { DistinctTreeNode, Game, ParentTreeNode, Profile, RootNode, Subject, TreeNode } from "./model/TreeNodeModel";

export const contextOptions: SelectDropdownOption[] = [
    { value: "boss", text: "Boss" },
    { text: "Mini Boss", value: "miniBoss" },
    { text: "Generic Enemy", value: "genericEnemy" },
    { value: "location", text: "Location" },
    { value: "other", text: "Other" },
];

export function assertIsRootNode(node: TreeNode): asserts node is RootNode {
    if (node.type != "ROOT_NODE") {
        throw new Error("DEV ERROR! expected root node type is somehow wrong!")
    }
}

export function assertIsDistinctTreeNode(node: TreeNode): asserts node is DistinctTreeNode {
    if (node.type == "ROOT_NODE") {
        throw new Error("DEV ERROR! expected Distinct node node type is somehow wrong!")
    }
}

export function assertIsGame(node: TreeNode): asserts node is Game {
    if (node.type != "game") {
        throw new Error("DEV ERROR! expected game type is somehow wrong!")
    }
}

export function assertIsProfile(node: TreeNode): asserts node is Profile {
    if (node.type != "profile") {
        throw new Error("DEV ERROR! expected profile type is somehow wrong!")
    }
}

export function assertIsSubject(node: TreeNode): asserts node is Subject {
    if (node.type != "profile") {
        throw new Error("DEV ERROR! expected subject type is somehow wrong!")
    }
}

export function assertIsNonNull<T>(value: T): asserts value is NonNullable<T> {
    if (value === undefined || value === null) {
        throw new Error("DEV ERROR OR USER ERROR! expected non nullable type is somehow wrong! If you deliberately deleted email key in localstorage, that IS the reason why this reason popped up. Do not touch that email key!")
    }
}

