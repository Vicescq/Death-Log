import type { Game, Profile, Subject } from "../../model/TreeNodeModel";

export type HandleAddGame = (
    inputText: string,
    overrides: Partial<Game>
) => void;
export type HandleAddProfile = (
    inputText: string,
    overrides: Partial<Profile>
) => void;
export type HandleAddSubject = (
    inputText: string,
    overrides: Partial<Subject>
) => void;

type x = Partial<Subject>

export type AddItemCardModalStateGame = {
    dateStartR: boolean,
    dateEndR: boolean
}

export type AddItemCardModalStateProfile = {
    dateStartR: boolean,
    dateEndR: boolean
}

export type AddItemCardModalStateSubject = {
    dateStartR: boolean,
    dateEndR: boolean,
    reoccuring: boolean,
    composite: boolean
}