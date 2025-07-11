import type { TreeStateType } from "../../contexts/treeContext";
import { sanitizeTreeNodeEntry } from "../../features/treeUtils";
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

		// setting to undefined and letting createSubject set default vals 
		let notable,
			dateStartR,
			dateEndR,
			boss,
			location,
			other,
			composite,
			reoccurring = undefined

		modalState.forEach((state) => {
			if (state.type == "toggle") {
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
				if (state.toggleSetting == "composite" && state.enable) {
					composite = true;
				}
				if (state.toggleSetting == "reoccurring" && state.enable) {
					reoccurring = true;
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
					dateStartR,
					dateEndR,
					boss,
					location,
					other,
					composite,
					reoccurring
				);
		}
	}

	function handleToggle(index: number) {
		const newModalState = [...modalState];

		let newModalToggleState = newModalState[
			index
		] as ModalListItemToggleState; // assume its a toggle state to remove ts errors


		newModalToggleState = {
			...newModalToggleState,
			enable: !newModalToggleState.enable,
		} as ModalListItemToggleState;
		newModalState[index] = newModalToggleState;

		setModalState(newModalState);

	}
	return { handleAddWrapper, handleToggle };
}