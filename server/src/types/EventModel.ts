import { DistinctTreeNode, Game, Profile, Subject } from "./TreeNodeModel.js"


export type Event = AddEvent | DeleteEvent | UpdateEvent

export type AddEvent = {
    type: "add",
    data: DistinctTreeNode,
    sideEffects?: {
        updatedParent: Game | Profile
    }
}

export type DeleteEvent = DeleteGameEvent | DeleteProfileEvent | DeleteSubjectEvent

export type DeleteGameEvent = {
    type: "delete",
    subtype: "game",
    data: string
    sideEffects: {
        deletedLineage: string[]
    }
}

export type DeleteProfileEvent = {
    type: "delete",
    subtype: "profile",
    data: string
    sideEffects: {
        deletedLineage: string
        updatedParent: Game
    }
}

export type DeleteSubjectEvent = {
    type: "delete",
    subtype: "subject",
    data: string
    sideEffects: {
        updatedLineage: (Game | Profile)[] // 0=Game, 1=Profile in the array
    }
}

export type UpdateEvent = UpdateIsoEvent | UpdateSortEvent | UpdateLineageEvent

export type UpdateIsoEvent = {
    type: "update",
    subtype: "iso",
    data: DistinctTreeNode
}

export type UpdateSortEvent = {
    type: "update",
    subtype: "sort",
    data: Profile | Subject
    sideEffects: {
        updatedParent: Game | Profile // 0=Game, 1=Profile in the array
    }
}

export type UpdateLineageEvent = {
    type: "update",
    subtype: "lineage",
    data: Subject,
    sideEffects: {
        updatedLineage: (Game | Profile)[] // 0=Game, 1=Profile in the array
    }
}
