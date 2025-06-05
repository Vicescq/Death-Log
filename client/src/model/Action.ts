import type { DistinctTreeNode } from "./TreeNodeModel";

export type ActionType = "add" | "delete" | "update";

export type Action = {
    type: ActionType,
    targets: (DistinctTreeNode | string)[],
}

export type DistinctAction = ActionAdd | ActionDelete | ActionUpdate;

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