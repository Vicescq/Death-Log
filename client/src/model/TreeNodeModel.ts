export type TreeNodeType = "game" | "profile" | "subject" | "ROOT_NODE";
export type DeathType = "both" | "fullTries" | "resets";

export type TreeNode = {
    type: TreeNodeType,
    id: string,
    parentID: string | null,
    childIDS: string[],
}

export type DistinctTreeNode = Game | Profile | Subject  // for discriminant unions

export type TangibleTreeNode = TreeNode & {
    name: string,
    completed: boolean
    notes: string | null
    dateStart: string,
    dateEnd: string | null,
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
    type: "game"
    genre: string | null,
}

export type Profile = TangibleTreeNodeParent & {
    type: "profile"
    challenge: boolean,
}

export type Subject = TangibleTreeNode & {
    type: "subject"
    notable: boolean,
    fullTries: number,
    resets: number,
}