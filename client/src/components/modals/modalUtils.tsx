import type { ModalSchema } from "./Modal";
import ModalListItemInputEdit, {
	type InputEditTargetField,
} from "./ModalListItemInputEdit";
import type {
	ModalListItemDistinctState,
	ModalListItemDropDownState,
	ModalListItemInputEditState,
	ModalListItemToggleState,
} from "./ModalListItemStateTypes";
import ModalListItemToggle, { type ToggleSetting } from "./ModalListItemToggle";
import { ModalUtilityButton } from "./ModalUtilityButton";

export function createModalState(modalSchema: ModalSchema) {
	const state: ModalListItemDistinctState[] = [];
	switch (modalSchema) {
		case "AddItemCard-Home":
		case "AddItemCard-Profile":
			state.push(
				createModalListItemToggleState(
					"Reliable Date (Start)",
					"dateStartR",
					true,
				),
				createModalListItemToggleState(
					"Reliable Date (End)",
					"dateEndR",
					true,
				),
			);
			break;
		case "AddItemCard-Subject":
			state.push(
				createModalListItemToggleState(
					"Reliable Date (Start)",
					"dateStartR",
					true,
				),
				createModalListItemToggleState(
					"Reliable Date (End)",
					"dateEndR",
					true,
				),
				createModalListItemToggleState("Composite", "composite", false),
				createModalListItemToggleState(
					"Reoccurring",
					"reoccurring",
					false,
				),
			);
			break;
		case "Card-Home":
		case "Card-Profile":
		case "Card-Subject":
			state.push(
				createModalListItemInputEditState("Name:", "name"),
				createModalListItemInputEditState("Date (Start):", "dateStart"),
				createModalListItemInputEditState("Date (End):", "dateEnd"),
				createModalListItemToggleState(
					"Reliable Date (Start)",
					"dateStartR",
					true,
				),
				createModalListItemToggleState(
					"Reliable Date (End)",
					"dateEndR",
					true,
				),
			);
	}
	return state;
}

export function createModalListItems(
	modalState: ModalListItemDistinctState[],
	handleToggle?: (index: number) => void,
	handleInputEditChange?: (inputText: string, index: number) => void,
) {
	return modalState.map((state, index) => {
		if (state.type == "inputEdit") {
			return (
				<ModalListItemInputEdit
					key={index}
					state={state}
					placeholder="sdasdsa"
					handleInputEditChange={(inputText) =>
						handleInputEditChange!(inputText, index)
					}
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

export function createModalUtilityButtons(
	modalSchema: ModalSchema,
	modalRef: React.RefObject<HTMLDialogElement | null>,
	handleDelete?: () => void,
	handleEdit?: () => void,
) {
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
						handleDelete
							? handleDelete()
							: console.error(
									"DEV ERROR HANDLE DELETE MUST BE PASSED!",
								);
						modalRef.current?.close();
					}}
					bgCol="bg-red-500"
				/>,
			);
			break;
	}
	return utilityBtns;
}

export function createModalListItemInputEditState(
	settingLabel: string,
	targetField: InputEditTargetField,
): ModalListItemInputEditState {
	return {
		type: "inputEdit",
		settingLabel: settingLabel,
		targetField: targetField,
		change: "",
	};
}

export function createModalListItemToggleState(
	settingLabel: string,
	toggleSetting: ToggleSetting,
	enable: boolean,
): ModalListItemToggleState {
	return {
		type: "toggle",
		settingLabel: settingLabel,
		toggleSetting: toggleSetting,
		enable: enable,
	};
}
