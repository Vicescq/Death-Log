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
) {
	return modalState.map((state, index) => {
		if (state.type == "inputEdit") {
			return (
				<ModalListItemInputEdit
					key={index}
					state={state}
					placeholder=""
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

export function createModalUtilityButtons(modalSchema: ModalSchema) {
	const utilityBtns: React.JSX.Element[] = [];
	switch (modalSchema) {
		case "Card-Home":
		case "Card-Profile":
		case "Card-Subject":
			utilityBtns.push(
				<ModalUtilityButton
					key={1}
					name="EDIT"
					handleClick={() => true}
					bgCol="bg-hunyadi"
				/>,
				<ModalUtilityButton
					key={2}
					name="DELETE"
					handleClick={() => true}
					bgCol="bg-red-500"
				/>,
			);
			break;
	}
	return utilityBtns;
}
