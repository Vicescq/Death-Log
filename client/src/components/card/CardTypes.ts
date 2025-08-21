export type CardModalStateGame = {
    name: string;
};

export type CardModalStateProfile = {
    name: string;
};

export type CardModalStateSubject = {
    name: string;
    reoccurring: boolean;
    composite: boolean;
};

export type CardModalMap = {
    game: CardModalStateGame
    profile: CardModalStateProfile
    subject: CardModalStateSubject
}

export type CardModalState<T extends keyof CardModalMap> = CardModalMap[T]

export type CardMainPageTransitionState = {
    type: "GameToProfiles" | "ProfileToSubjects"
    parentID: string; 
}