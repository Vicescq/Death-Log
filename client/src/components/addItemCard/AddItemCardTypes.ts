import type { Game, Profile, Subject } from "../../model/TreeNodeModel";

export type HandleAddGame = (
    inputText: string,
    dateStartR?: boolean,
    dateEndR?: boolean,
) => void;
export type HandleAddProfile = (
    inputText: string,
    dateStartR?: boolean,
    dateEndR?: boolean,
) => void;
export type HandleAddSubject = (
    inputText: string,
    dateStartR?: boolean,
    dateEndR?: boolean,
    boss?: boolean,
    location?: boolean,
    other?: boolean,
    composite?: boolean,
    reoccurring?: boolean,
) => void;

export type HandleAddTypes = HandleAddGame | HandleAddProfile | HandleAddSubject;
export type AddItemCardPageType = "Game" | "Profile" | "Subject"; 
export type HandleAddTrioParams = Partial<Game> | Partial<Profile> | Partial<Subject>