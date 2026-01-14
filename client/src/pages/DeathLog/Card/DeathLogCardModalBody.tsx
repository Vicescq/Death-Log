import type { DistinctTreeNode, TreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyNameDate from "./DeathLogModalEditBodyNameDate";
import DeathLogModalEditBodyNotesDel from "./DeathLogModalEditBodyNotesDel";
import DeathLogModalEditBodyProfile from "./DeathLogModalEditBodyProfile";
import DeathLogModalEditBodySubject from "./DeathLogModalEditBodySubject";

type Props = {
	page: number;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
	inputTextNameError: string;
	modalState: DistinctTreeNode;
};

export default function DeathLogCardModalBody({
	page,
	handleOnEditChange,
	inputTextNameError,
	modalState,
}: Props) {
	if (page == 1) {
		return (
			<DeathLogModalEditBodyNameDate
				node={modalState}
				handleOnEditChange={handleOnEditChange}
				inputTextError={inputTextNameError}
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
				node={modalState}
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
