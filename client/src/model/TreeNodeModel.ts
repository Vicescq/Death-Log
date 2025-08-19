export type TreeNodeType = "game" | "profile" | "subject" | "ROOT_NODE";

export type DeathType = "both" | "fullTries" | "resets";
export type DeathCountOperation = "add" | "subtract";

export type SubjectContext = "boss" | "location" | "other";

export type TreeNode = {
    type: TreeNodeType,
    id: string,
    parentID: string | null,
    childIDS: string[],
}

export type RootNode = TreeNode & {
    type: "ROOT_NODE",
    id: "ROOT_NODE",
    parentID: null
}

export type DistinctTreeNode = Game | Profile | Subject  // for discriminant unions

export type TangibleTreeNode = TreeNode & {
    name: string,
    completed: boolean
    notes: string | null
    dateStart: string,
    dateEnd: string | null,
    path: string
}


export type Game = TangibleTreeNode & {
    type: "game"
}

export type Profile = TangibleTreeNode & {
    type: "profile"
}

export type Subject = TangibleTreeNode & {
    type: "subject"
    fullTries: number,
    resets: number,
    path: ""

    reoccurring: boolean,
    composite: boolean,
    compositeRelations: string[],

    subjectContext: SubjectContext
}


