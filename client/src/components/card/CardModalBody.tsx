import { useEffect, useState } from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

type Props<T extends DistinctTreeNode> = {
	node: T;
	handleDelete: () => void;
	handleModalSave: (overrides: T) => void;
};

export default function CardModalBody<T extends DistinctTreeNode>({
	node,
	handleDelete,
	handleModalSave,
}: Props<T>) {
	const [modalState, setModalState] = useState<T>(node);

	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span>Title</span>
				<input
					value={modalState.name}
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) => {
						const val = e.currentTarget.value;
						setModalState((prev) => ({
							...prev,
							name: val,
						}));
					}}
				/>
			</li>

			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={() => {
					handleModalSave(modalState);
				}}
			>
				SAVE
			</button>
			<button
				className="rounded-2xl border-4 bg-orange-700 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={handleDelete}
			>
				DELETE
			</button>
		</ul>
	);
}
