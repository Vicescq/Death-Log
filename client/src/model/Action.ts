import type { DistinctTreeNode } from "./TreeNodeModel";

export type ActionType = "add" | "delete" | "update" | "toBeUpdated" | "init";

export type Action = {
    type: ActionType,
    targets: (DistinctTreeNode | string)[]
}

export type DistinctAction = ActionAdd | ActionDelete | ActionUpdate | ActionToBeUpdated | ActionInit;

export type ActionAdd = Action & {
    type: "add",
    targets: DistinctTreeNode[] // len 1
}

export type ActionDelete = Action & {
    type: "delete",
    targets: string[]
}

export type ActionUpdate = Action & {
    type: "update",
    targets: DistinctTreeNode[] // len 1
}

export type ActionToBeUpdated = Action & {
    type: "toBeUpdated",
    targets: string[] // len 1
}

export type ActionInit = Action & {
    type: "init",
    targets: DistinctTreeNode[]
}