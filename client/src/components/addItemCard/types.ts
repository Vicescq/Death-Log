export type HandleAddGame = (
    inputText: string,
) => void;
export type HandleAddProfile = (
    inputText: string,
) => void;
export type HandleAddSubject = (
    inputText: string,
    overrides: AICModalStateSubject
) => void;

export type AICModalStateSubject = {
    reoccurring: boolean;
    composite: boolean;
};

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

export type AICModalBodyGameProps = {
    pageType: "game"
}

export type AICModalBodyProfileProps = {
    pageType: "profile"
}

export type AICModalBodySubjectProps = {
    pageType: "subject"
	state: AICModalStateSubject;
    handleToggle: (setting: keyof AICModalStateSubject) => void;
}