export type TreeNodeType = "game" | "profile" | "subject" | "ROOT_NODE";
export type SubjectContext = "boss" | "location" | "other";
export type Milestone = {
    name: string
    start: number,
    end: number,
    description: string;
}

export type DeathEntry = {
    timestamp: string; // iso date
    id: string
}

export type TreeNode = {
    type: TreeNodeType,
    id: string,
    parentID: string,
    childIDS: string[],
    name: string,
    completed: boolean
    notes: string
    dateStart: string,
    dateEnd: string | null,
}

export type RootNode = TreeNode & {
    type: "ROOT_NODE",
    id: "ROOT_NODE",
    parentID: "NONE",
    name: "",
    completed: false,
    notes: "",
    dateStart: "",
    dateEnd: "",
}

export type DistinctTreeNode = Game | Profile | Subject  // for discriminant unions

export type Game = TreeNode & {
    type: "game"
    totalDeaths: number // just for counting, profile doesnt have this bc I can use deathEntries.length
}

export type Profile = TreeNode & {
    type: "profile"
    milestones: Milestone[]
    deathEntries: DeathEntry[]
}

export type Subject = TreeNode & {
    type: "subject"
    deaths: number
    reoccurring: boolean,
    context: SubjectContext
}


