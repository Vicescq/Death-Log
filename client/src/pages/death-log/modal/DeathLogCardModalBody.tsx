import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DLMEBNameDate from "./DLMEBNameDate";
import DLMEBNotesDel from "./DLMEBNotesDel";
import DLMEBSubject from "./DLMEBSubject";

type Props = {
	type: "edit" | "completion";
	page: number;
	node: DistinctTreeNode | null;
};

export default function DeathLogCardModalBody({ type, page, node }: Props) {
	if (!node) return null;

	if (type == "edit"){
		return <form>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				{page == 1 ? (
					<DLMEBNameDate node={node} />
				) : page == 2 && node.type == "subject" ? (
					<DLMEBSubject node={node} />
				) : page == 2 || page == 3 ? (
					<DLMEBNotesDel node={node} />
				) : null}
			</fieldset>
		</form>
	}

	else{
		return <div>asdsad</div>
	}
}
