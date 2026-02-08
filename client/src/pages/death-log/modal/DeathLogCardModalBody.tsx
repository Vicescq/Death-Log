import PaginationNav from "../../../components/PaginationNav";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DLMEBNameDate from "./DLMEBNameDate";
import DLMEBNotesDel from "./DLMEBNotesDel";
import DLMEBSubject from "./DLMEBSubject";

type Props = {
	type: "edit" | "completion";
	node: DistinctTreeNode | null;
	page: number;
	onPageTurn: (isRight: boolean) => void;
	onNodeCompletion: (updatedNode: DistinctTreeNode) => void;
};

export default function DeathLogCardModalBody({
	type,
	node,
	page,
	onPageTurn,
	onNodeCompletion,
}: Props) {
	if (!node) return null;

	if (type == "edit") {
		return (
			<form>
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
					{page == 1 ? (
						<DLMEBNameDate node={node} />
					) : page == 2 && node.type == "subject" ? (
						<DLMEBSubject node={node} />
					) : page == 2 || page == 3 ? (
						<DLMEBNotesDel node={node} />
					) : null}
				</fieldset>
				<PaginationNav page={page} onPageTurn={onPageTurn} css="my-4" />
				<button type="submit" className="btn btn-success w-full">
					Save Changes
				</button>
			</form>
		);
	} else {
		return (
			<div className="mt-4 mb-2">
				Do you want to mark this as{" "}
				{node.completed ? "incomplete?" : "complete?"}
				<button
					className="btn btn-secondary mt-2 w-full"
					onClick={() => onNodeCompletion(node)}
				>
					Confirm
				</button>
			</div>
		);
	}
}
