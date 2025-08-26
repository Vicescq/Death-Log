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
    handleAdd: HandleAddGame;
}

export type AICProfile = {
    pageType: "profile";
    handleAdd: HandleAddProfile;
}

export type AICSubject = {
    pageType: "subject";
    handleAdd: HandleAddSubject;
}

export type AICSubjectOverrides = Pick<Subject, "reoccurring" | "context">