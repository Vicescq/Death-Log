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
	function assertProfileNode(node: TreeNode | undefined | null) {
		// for ts auto complete
		assertIsNonNull(node);
		assertIsProfile(node);
		return node;
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
				node={assertProfileNode(modalState)}
				handleOnEditChange={handleOnEditChange}
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
