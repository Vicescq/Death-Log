import type { DistinctTreeNode, TreeNode } from "../../../model/TreeNodeModel";
import DLMEBNameDate from "./DLMEBNameDate";
import DLMEBNotesDel from "./DLMEBNotesDel";
import DLMEBProfile from "./DLMEBProfile";
import DLMEBSubject from "./DLMEBSubject";

type Props = {
	page: number;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
	modalState: DistinctTreeNode;
	inputTextError: string;
	displayError: boolean;
};

export default function DeathLogCardModalBody({
	page,
	handleOnEditChange,
	modalState,
	inputTextError,
	displayError,
}: Props) {
	if (page == 0) {
		return <></>;
	} else if (page == 1) {
		return (
			<DLMEBNameDate
				node={modalState}
				handleOnEditChange={handleOnEditChange}
				inputTextError={inputTextError}
				displayError={displayError}
			/>
		);
	} else if (page == 2 && modalState.type == "subject") {
		return (
			<DLMEBSubject
				node={modalState}
				handleOnEditChange={handleOnEditChange}
			/>
		);
	} else if (page == 2 && modalState.type == "profile") {
		return (
			<DLMEBProfile
				node={modalState}
				handleOnEditChange={handleOnEditChange}
			/>
		);
	} else if (page == 2 || page == 3) {
		return (
			<DLMEBNotesDel
				node={modalState}
				handleOnEditChange={handleOnEditChange}
			/>
		);
	}
}
