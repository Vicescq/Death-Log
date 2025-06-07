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
    notable: boolean | undefined,
    dateStartR: boolean | undefined,
    dateEndR: boolean | undefined,
    boss: boolean | undefined,
    location: boolean | undefined ,
    other: boolean |  undefined
) => void;

interface AddItemCardPropsBase {
    pageType: "Game" | "Profile" | "Subject";
    modalSchema: ModalSchema;
}

interface AddItemCardGameProps extends AddItemCardPropsBase {
    pageType: "Game";
    handleAdd: HandleAddGame;
}

interface AddItemCardProfileProps extends AddItemCardPropsBase {
    pageType: "Profile";
    handleAdd: HandleAddProfile;
}

interface AddItemCardSubjectProps extends AddItemCardPropsBase {
    pageType: "Subject";
    handleAdd: HandleAddSubject;
}

export type AddItemCardProps =
    | AddItemCardGameProps
    | AddItemCardProfileProps
    | AddItemCardSubjectProps;
