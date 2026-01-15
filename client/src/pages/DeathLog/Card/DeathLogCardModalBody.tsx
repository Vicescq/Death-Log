import type { DistinctTreeNode, TreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyNameDate from "./DeathLogModalEditBodyNameDate";
import DeathLogModalEditBodyNotesDel from "./DeathLogModalEditBodyNotesDel";
import DeathLogModalEditBodyProfile from "./DeathLogModalEditBodyProfile";
import DeathLogModalEditBodySubject from "./DeathLogModalEditBodySubject";

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
			<DeathLogModalEditBodyNameDate
				node={modalState}
				handleOnEditChange={handleOnEditChange}
				inputTextError={inputTextError}
				displayError={displayError}
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
