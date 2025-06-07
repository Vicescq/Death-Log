import type { TreeNodeType } from "../../model/TreeNodeModel";
import type {
    ModalListItemToggleType,
    ModalListItemInputEditType,
} from "../modals/ModalListItemTypes";

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
    children: React.JSX.Element;
    itemType: TreeNodeType;
    modalRef: React.RefObject<HTMLDialogElement | null>;
    modalListItemArray: (
        | ModalListItemToggleType
        | ModalListItemInputEditType
    )[];
}

interface AddItemCardGameProps extends AddItemCardPropsBase {
    itemType: "game";
    handleAdd: HandleAddGame;
}

interface AddItemCardProfileProps extends AddItemCardPropsBase {
    itemType: "profile";
    handleAdd: HandleAddProfile;
}

interface AddItemCardSubjectProps extends AddItemCardPropsBase {
    itemType: "subject";
    handleAdd: HandleAddSubject;
}

export type AddItemCardProps =
    | AddItemCardGameProps
    | AddItemCardProfileProps
    | AddItemCardSubjectProps;
