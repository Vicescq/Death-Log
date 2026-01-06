export type Tree = Map<string, TreeNode>;

export type SubjectContext = "boss" | "location" | "other" | "genericEnemy" | "miniBoss";

export type TreeNode = {
    type: "game" | "profile" | "subject" | "ROOT_NODE",
    id: string,
    parentID: string,
    childIDS: string[],
    name: string,
    completed: boolean
    notes: string
    dateStart: string,
    dateEnd: string | null,
    dateStartRel: boolean,
    dateEndRel: boolean,
}

export type RootNode = TreeNode & {
    type: "ROOT_NODE",
    id: "ROOT_NODE",
    parentID: "NONE", // string instead of null because of annoying TS compiler warnings
    name: "",
    completed: false,
    notes: "",
    dateStart: "",
    dateEnd: "",
}

export type DistinctTreeNode = Game | Profile | Subject  // for discriminant unions

export type Game = TreeNode & {
    type: "game"
}

export type Profile = TreeNode & {
    type: "profile"
    groupings: ProfileGroup[]
}

export type ProfileGroup = {
    title: string,
    members: string[]
    description: string
}

export type Subject = TreeNode & {
    type: "subject"
    deaths: number
    reoccurring: boolean,
    context: SubjectContext,
    timeSpent: string | null
}