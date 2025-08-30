import type { DistinctTreeNode, Game, Profile } from "./TreeNodeModel"

export type Action = {
    type: "add"
    data: DistinctTreeNode
    sideEffects: {
        updatedParent: DistinctTreeNode
    }
} | {
    type: "delete"
    data: string
    sideEffects: {
        deletedChildren: string[]
        updatedParent: DistinctTreeNode
    }
} | {
    type: "update"
    data: DistinctTreeNode
    sideEffects: null | {
        updatedParent: Game
    } | {
        updatedParent: Profile
        updatedGrandParent: Game
    }
}


