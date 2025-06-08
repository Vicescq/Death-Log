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
		] as ModalListItemToggleState;
		newModalToggleState = {
			...newModalToggleState,
			enable: !newModalToggleState.enable,
		} as ModalListItemToggleState;
		newModalState[index] = newModalToggleState;
		setModalState(newModalState);
	}

	return { handleAddWrapper, handleToggle };
}
