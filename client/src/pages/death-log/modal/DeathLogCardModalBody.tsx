import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DLMEBNameDate from "./DLMEBNameDate";
import DLMEBNotesDel from "./DLMEBNotesDel";
import DLMEBSubject from "./DLMEBSubject";

type Props = {
	page: number;
	onEdit: (newModalState: DistinctTreeNode) => void;
	modalState: DistinctTreeNode;
	inputTextError: string;
};

export default function DeathLogCardModalBody({
	page,
	onEdit,
	modalState,
	inputTextError,
}: Props) {
	return (
		<form>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				{page == 1 ? (
					<DLMEBNameDate
						modalState={modalState}
						onEdit={onEdit}
						inputTextError={inputTextError}
					/>
				) : page == 2 && modalState.type == "subject" ? (
					<DLMEBSubject modalState={modalState} onEdit={onEdit} />
				) : page == 2 || page == 3 ? (
					<DLMEBNotesDel modalState={modalState} onEdit={onEdit} />
				) : null}
			</fieldset>
		</form>
	);
}
