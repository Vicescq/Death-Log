import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyPage1 from "./DeathLogModalEditBodyPage1";
import DeathLogModalEditBodyPage2 from "./DeathLogModalEditBodyPage2";

type Props = {
	node: DistinctTreeNode;
	page: number;
	handlePageState: (isRight: boolean) => void;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodyWrapper({
	node,
	page,
	handlePageState,
	handleOnEditChange,
}: Props) {
	return (
		<>
			{page == 1 ? (
				<DeathLogModalEditBodyPage1
					node={node}
					handleOnEditChange={handleOnEditChange}
				/>
			) : (
				<DeathLogModalEditBodyPage2 node={node} />
			)}

			<div className="join mt-4 flex">
				<button
					className="join-item btn"
					onClick={() => {
						handlePageState(false);
					}}
				>
					«
				</button>
				<button className="join-item btn flex-1">Page {page}</button>
				<button
					className="join-item btn"
					onClick={() => {
						handlePageState(true);
					}}
				>
					»
				</button>
			</div>
		</>
	);
}
