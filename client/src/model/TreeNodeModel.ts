export type TreeNodeType = "game" | "profile" | "subject" | "ROOT_NODE";

export type TreeNode = {
    type: TreeNodeType,
    id: string,
    parentID: string | null,
    childIDS: string[],
}

export type TangibleTreeNode = TreeNode & {
    name: string,
    date: string,
    completed: boolean
}

export type TangibleTreeNodeParent = TangibleTreeNode & {
    path: string
}

export type RootNode = TreeNode & {
    type: "ROOT_NODE",
    id: "ROOT_NODE",
    parentID: null
}

export type Game = TangibleTreeNodeParent & {

}

export type Profile = TangibleTreeNodeParent & {
    challenge: boolean
}

export type Subject = TangibleTreeNode & {
    notable: boolean,
    fullTries: number,
    resets: number
}