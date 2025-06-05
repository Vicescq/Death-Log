import type { TangibleTreeNode } from "./TreeNodeModel";

export type ActionType = "add" | "delete" | "update" | "toBeUpdated";

export type Action = {
    type: ActionType,
    targets: (TangibleTreeNode | string)[]
}