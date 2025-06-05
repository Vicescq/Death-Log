import type { DistinctTreeNode } from "./TreeNodeModel";

export type ActionType = "add" | "delete" | "update" | "toBeUpdated" | "init";

export type Action = {
    type: ActionType,
    targets: (DistinctTreeNode | string)[]
}