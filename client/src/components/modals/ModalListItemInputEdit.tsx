import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { ModalListItemInputEditType } from "./ModalListItemTypes";

type Props = {
	modalListItem: ModalListItemInputEditType;
	index: number;
	handleChange: (inputText: string) => void,
	treeNode: DistinctTreeNode
};

export default function ModalListItemInputEdit({
	modalListItem,
	index,
	handleChange,
	treeNode
}: Props) {
	return (
		<li className="m-2 flex gap-4">
			<span  className="m-auto">
				{modalListItem.settingLabel}
			</span>
			<input
				type="search"
				className="ml-auto w-42 sm:w-lg rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
				onChange={(e) => handleChange(e.target.value)}
				placeholder={`${treeNode.name}`}
			/>
		</li>
	);
}
