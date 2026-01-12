import type { DistinctTreeNode, TreeNode } from "../../../model/TreeNodeModel";
import { assertIsNonNull, assertIsProfile } from "../../../utils";
import DeathLogModalEditBodyNameDate from "./DeathLogModalEditBodyNameDate";
import DeathLogModalEditBodyNotesDel from "./DeathLogModalEditBodyNotesDel";
import DeathLogModalEditBodyProfile from "./DeathLogModalEditBodyProfile";
import DeathLogModalEditBodySubject from "./DeathLogModalEditBodySubject";

type Props = {
	page: number;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
	inputTextError: string;
	modalState: DistinctTreeNode;
};

export default function DeathLogCardModalBody({
	page,
	handleOnEditChange,
	inputTextError,
	modalState,
}: Props) {
	function getParentProfileNode(parentNode: TreeNode | undefined | null) {
		// for ts auto complete
		assertIsNonNull(parentNode);
		assertIsProfile(parentNode);
		return parentNode;
	}

	if (page == 1) {
		return (
			<DeathLogModalEditBodyNameDate
				node={modalState}
				handleOnEditChange={handleOnEditChange}
				inputTextError={inputTextError}
			/>
		);
	} else if (page == 2 && modalState.type == "subject") {
		return (
			<DeathLogModalEditBodySubject
				node={modalState}
				handleOnEditChange={handleOnEditChange}
			/>
		);
	} else if (page == 2 && modalState.type == "profile") {
		return (
			<DeathLogModalEditBodyProfile
				handleOnEditChange={handleOnEditChange}
				node={getParentProfileNode(modalState)}
			/>
		);
	} else if (page == 2 || page == 3) {
		return (
			<DeathLogModalEditBodyNotesDel
				node={modalState}
				handleOnEditChange={handleOnEditChange}
			/>
		);
	}
}
