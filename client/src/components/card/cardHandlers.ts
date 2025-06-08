import type { ModalListItemDistinctState, ModalListItemInputEditState } from "../modals/ModalListItemStateTypes";

export default function cardHandlers(modalState: ModalListItemDistinctState[], setModalState: React.Dispatch<React.SetStateAction<ModalListItemDistinctState[]>>) {
    function handleInputEditChange(inputText: string, index: number) {
        const modalStateCopy = [...modalState];
        modalStateCopy[index] = { ...modalStateCopy[index] };
        const inputEditState = modalStateCopy[
            index
        ] as ModalListItemInputEditState;
        inputEditState.change = inputText;
        modalStateCopy[index] = inputEditState;
        setModalState(modalStateCopy);
    }

    return {handleInputEditChange}
}