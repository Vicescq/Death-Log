import type { DistinctTreeNode } from "./TreeNodeModel";

export type ActionType = "add" | "delete" | "update";

export type Action = ActionAdd | ActionDelete | ActionUpdate;

export type ActionAdd = {
    type: "add",
    targets: DistinctTreeNode
}

export type ActionDelete = {
    type: "delete",
    targets: string[]
}

export type ActionUpdate = {
    type: "update",
    targets: DistinctTreeNode
}