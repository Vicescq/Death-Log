export type TreeNodeType = "game" | "profile" | "subject" | "ROOT_NODE";

export type DeathType = "both" | "fullTries" | "resets";
export type DeathCountOperation = "add" | "subtract";

export type SubjectContext = "boss" | "location" | "other";

export type TreeNode = {
    type: TreeNodeType,
    id: string,
    parentID: string | null,
    childIDS: string[],
    name: string,
    completed: boolean
    notes: string | null
    dateStart: string,
    dateEnd: string | null,
}

export type RootNode = TreeNode & {
    type: "ROOT_NODE",
    id: "ROOT_NODE",
    parentID: null,
    name: "",
    completed: false,
    notes: null,
    dateStart: "",
    dateEnd: "",
}

export type DistinctTreeNode = Game | Profile | Subject  // for discriminant unions




export type Game = TreeNode & {
    type: "game"
}

export type Profile = TreeNode & {
    type: "profile"
}

export type Subject = TreeNode & {
    type: "subject"
    fullTries: number,
    resets: number,

    reoccurring: boolean,
    composite: boolean,
    compositeRelations: string[],

    subjectContext: SubjectContext
}


