import type { ModalSchema } from "./Modal";
import ModalListItemInputEdit from "./ModalListItemInputEdit";
import type {
	ModalListItemInputEditState,
	ModalListItemToggleState,
} from "./ModalListItemStateTypes";
import ModalListItemToggle from "./ModalListItemToggle";
import { ModalUtilityButton } from "./ModalUtilityButton";

export function createModalListItems(
	modalState: (ModalListItemInputEditState | ModalListItemToggleState)[],
	handleToggle?: (index: number) => void,
	handleInputEditChange?: (inputText: string, index: number) => void
) {
	return modalState.map((state, index) => {
		if (state.type == "inputEdit") {
			return (
				<ModalListItemInputEdit
					key={index}
					state={state}
					placeholder="sdasdsa"
					handleInputEditChange={(inputText) => handleInputEditChange!(inputText, index)}
				/>
			);
		} else if (state.type == "toggle") {
			return (
				<ModalListItemToggle
					key={index}
					state={state}
					index={index}
					handleToggle={() => handleToggle!(index)}
				/>
			);
		}
	}) as React.JSX.Element[];
}

export function createModalUtilityButtons(modalSchema: ModalSchema, modalRef: React.RefObject<HTMLDialogElement | null>, handleDelete?: () => void, handleEdit?: () => void) {
	const utilityBtns: React.JSX.Element[] = [];
	switch (modalSchema) {
		case "Card-Home":
		case "Card-Profile":
		case "Card-Subject":
			utilityBtns.push(
				<ModalUtilityButton
					key={1}
					name="EDIT"
					handleClick={() => {
						handleEdit!();
						modalRef.current?.close();
					}}
					bgCol="bg-hunyadi"
				/>,
				<ModalUtilityButton
					key={2}
					name="DELETE"
					handleClick={() => {
						handleDelete ? handleDelete() : console.error("DEV ERROR HANDLE DELETE MUST BE PASSED!");
						modalRef.current?.close();
					}}
					bgCol="bg-red-500"
				/>,
			);
			break;
	}
	return utilityBtns;
}
