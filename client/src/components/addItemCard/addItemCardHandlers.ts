import type { TreeStateType } from "../../contexts/treeContext";
import { sanitizeTreeNodeEntry } from "../../features/treeUtils";
import { isSubjectContext } from "../../utils/general";
import type {
	ModalListItemDistinctState,
	ModalListItemToggleState,
} from "../modals/ModalListItemStateTypes";
import type {
	AddItemCardPageType,
	HandleAddGame,
	HandleAddProfile,
	HandleAddTypes,
} from "./AddItemCardProps";

export default function addItemCardHandlers(
	modalState: ModalListItemDistinctState[],
	handleAdd: HandleAddTypes,
	pageType: AddItemCardPageType,
	inputText: string,
	setModalState: React.Dispatch<
		React.SetStateAction<ModalListItemDistinctState[]>
	>,
	tree: TreeStateType,
	parentID: string
) {
	function handleAddWrapper() {
		let notable,
			dateStartR,
			dateEndR,
			boss,
			location,
			other = undefined;

		modalState.forEach((state) => {
			if (state.type == "toggle") {
				if (state.toggleSetting == "notable" && !state.enable) {
					notable = false;
				}
				if (state.toggleSetting == "dateStartR" && !state.enable) {
					dateStartR = false;
				}
				if (state.toggleSetting == "dateEndR" && !state.enable) {
					dateEndR = false;
				}
				if (state.toggleSetting == "boss" && !state.enable) {
					boss = false;
				}
				if (state.toggleSetting == "location" && state.enable) {
					location = true;
				}
				if (state.toggleSetting == "other" && state.enable) {
					other = true;
				}
			}
		});


		inputText = sanitizeTreeNodeEntry(inputText, tree, parentID);
		switch (pageType) {
			case "Game":
				const handleAddGame = handleAdd as HandleAddGame;
				handleAddGame(inputText, dateStartR, dateEndR);
				break;
			case "Profile":
				const handleAddProfile = handleAdd as HandleAddProfile;
				handleAddProfile(inputText, dateStartR, dateEndR);
				break;
			case "Subject":
				handleAdd(
					inputText,
					notable,
					dateStartR,
					dateEndR,
					boss,
					location,
					other,
				);
		}
	}

	function handleToggle(index: number) {
		const newModalState = [...modalState];

		let newModalToggleState = newModalState[
			index
		] as ModalListItemToggleState; // assume its a toggle state to remove ts errors

		if (!isSubjectContext(newModalToggleState.toggleSetting)) {
			newModalToggleState = {
				...newModalToggleState,
				enable: !newModalToggleState.enable,
			} as ModalListItemToggleState;
			newModalState[index] = newModalToggleState;
		}

		else {
			// hardcoded positions! last index == other, 2nd last == location, 3rd last == boss
			for (let i = newModalState.length - 1; i > newModalState.length - 4; i--) {
				let toggleState = newModalState[i] as ModalListItemToggleState;
				if (index == i && !toggleState.enable) {
					toggleState = { ...toggleState, enable: true };
				}
				else if (index != i && toggleState.enable) {
					toggleState = { ...toggleState, enable: false };
				}
				newModalState[i] = toggleState;
			}
		}
		setModalState(newModalState);

	}
	return { handleAddWrapper, handleToggle };
}