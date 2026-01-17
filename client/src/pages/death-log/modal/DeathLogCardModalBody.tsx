import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DLMEBNameDate from "./DLMEBNameDate";
import DLMEBNotesDel from "./DLMEBNotesDel";
import DLMEBProfile from "./DLMEBProfile";
import DLMEBSubject from "./DLMEBSubject";

type Props = {
	page: number;
	onEdit: (newModalState: DistinctTreeNode) => void;
	modalState: DistinctTreeNode;
};

export default function DeathLogCardModalBody({
	page,
	onEdit,
	modalState,
}: Props) {
	if (page == 0) {
		return <></>;
	} else if (page == 1) {
		return <DLMEBNameDate modalState={modalState} onEdit={onEdit} />;
	} else if (page == 2 && modalState.type == "subject") {
		return <DLMEBSubject modalState={modalState} onEdit={onEdit} />;
	} else if (page == 2 && modalState.type == "profile") {
		return <DLMEBProfile modalState={modalState} onEdit={onEdit} />;
	} else if (page == 2 || page == 3) {
		return <DLMEBNotesDel modalState={modalState} onEdit={onEdit} />;
	}
}
