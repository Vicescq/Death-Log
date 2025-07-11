import type { TreeStateType } from "../../contexts/treeContext";
import type { ModalSchema } from "../modals/Modal";

export type HandleAddGame = (
    inputText: string,
    dateStartR: boolean | undefined,
    dateEndR: boolean | undefined,
) => void;
export type HandleAddProfile = (
    inputText: string,
    dateStartR: boolean | undefined,
    dateEndR: boolean | undefined,
) => void;
export type HandleAddSubject = (
    inputText: string,
    dateStartR: boolean | undefined,
    dateEndR: boolean | undefined,
    boss: boolean | undefined,
    location: boolean | undefined,
    other: boolean | undefined,
    composite: boolean | undefined,
    reoccurring: boolean | undefined,
) => void;

export interface AddItemCardProps {
    pageType: AddItemCardPageType;
    modalSchema: ModalSchema;
    handleAdd: HandleAddTypes
    tree: TreeStateType
    parentID: string
}

export type HandleAddTypes = HandleAddGame | HandleAddProfile | HandleAddSubject;
export type AddItemCardPageType = "Game" | "Profile" | "Subject";