import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import type { CardModalState, CardModalStateGame } from "./CardTypes";
import type { CardModalStateProfile, CardModalStateSubject } from "./CardTypes";

type Props<T extends DistinctTreeNode> = {
	pageType: T["type"];
	state: CardModalState<T["type"]>;
	handleDelete: () => void;
	handleModalEdit: (state: CardModalState<T["type"]>) => void;
	handleModalSave: (overrides: CardModalState<T["type"]>) => void;
};

export default function CardModalBody<T extends DistinctTreeNode>({
	pageType,
	state,
	handleDelete,
	handleModalEdit,
	handleModalSave,
}: Props<T>) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span>Title</span>
				<input
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) =>
						handleModalEdit({
							name: e.currentTarget.value,
						} as CardModalStateGame &
							CardModalStateProfile &
							CardModalStateSubject)
					}
				/>
			</li>

			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={() => {
					handleModalSave(state);
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
