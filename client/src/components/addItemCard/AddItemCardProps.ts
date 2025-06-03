import type { TreeNodeSerializableType } from "../../model/TreeNode";
import type { ModalListItemToggleType, ModalListItemInputEditType } from "../modals/ModalListItemTypes";

export type HandleAddGame = (inputText: string, date: null | undefined) => void;
export type HandleAddProfile = (
    inputText: string,
    date: null | undefined,
) => void;
export type HandleAddSubject = (
    inputText: string,
    date: null | undefined,
    notable: boolean,
) => void;

interface AddItemCardPropsBase {
    children: React.JSX.Element;
    itemType: TreeNodeSerializableType;
    modalRef: React.RefObject<HTMLDialogElement | null>;
    modalListItemArray: (
        | ModalListItemToggleType
        | ModalListItemInputEditType
    )[];
}

interface AddItemCardGameProps extends AddItemCardPropsBase {
    itemType: "game";
    handleAdd: HandleAddGame;
};

interface AddItemCardProfileProps extends AddItemCardPropsBase {
    itemType: "profile";
    handleAdd: HandleAddProfile;
};

interface AddItemCardSubjectProps extends AddItemCardPropsBase {
    itemType: "subject";
    handleAdd: HandleAddSubject;
};

export type AddItemCardProps = AddItemCardGameProps | AddItemCardProfileProps | AddItemCardSubjectProps;