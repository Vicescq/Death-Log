import type { Subject } from "../../model/TreeNodeModel";

export type HandleAddGame = (
    inputText: string,
) => void;

export type HandleAddProfile = (
    inputText: string,
) => void;

export type HandleAddSubject = (
    inputText: string,
    overrides: AICSubjectOverrides
) => void;

export type AICGame = {
    pageType: "game";
    // handleAdd: HandleAddGame;
    parentID: string;
}

export type AICProfile = {
    pageType: "profile";
    // handleAdd: HandleAddProfile;
    parentID: string;
}

export type AICSubject = {
    pageType: "subject";
    // handleAdd: HandleAddSubject;
    parentID: string;
}

export type AICSubjectOverrides = Pick<Subject, "reoccurring" | "context">