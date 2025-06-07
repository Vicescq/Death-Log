import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { ModalListItemInputEditType } from "./ModalListItemTypes";

export type InputEditTargetField = "name" | "dateStart" | 'dateEnd' | "notes" | "fullTries" | "resets"

type Props = {
	modalListItem: ModalListItemInputEditType;
	treeNode: DistinctTreeNode
	handleCardModalInputEditChange: (change: string, index: number) => void,
	index: number;
};

export default function ModalListItemInputEdit({
	modalListItem,
	treeNode,
	handleCardModalInputEditChange,
	index
}: Props) {
	return (
		<li className="m-2 flex gap-4">
			<span  className="m-auto">
				{modalListItem.settingLabel}
			</span>
			<input
				type="search"
				className="ml-auto w-42 sm:w-lg rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
				onChange={(e) => handleCardModalInputEditChange(e.target.value, index)}
				placeholder={`${treeNode.name}`}
			/>
		</li>
	);
}
