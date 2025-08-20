export type HandleAddGame = (
    inputText: string,
) => void;
export type HandleAddProfile = (
    inputText: string,
) => void;
export type HandleAddSubject = (
    inputText: string,
    overrides: AddItemCardModalStateSubject
) => void;

export type AddItemCardModalStateSubject = {
    reoccuring: boolean;
    composite: boolean;
};
