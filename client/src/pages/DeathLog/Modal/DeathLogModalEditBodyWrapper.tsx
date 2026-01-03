import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyP1 from "./DeathLogModalEditBodyP1";
import DeathLogModalEditBodyP2 from "./DeathLogModalEditBodyP2";

type Props = {
	node: DistinctTreeNode;
	page: number;
	handlePageState: (isRight: boolean) => void;
};

export default function DeathLogModalEditBodyWrapper({
	node,
	page,
	handlePageState,
}: Props) {
	return (
		<>
			{page == 1 ? (
				<DeathLogModalEditBodyP1 node={node} />
			) : (
				<DeathLogModalEditBodyP2 node={node} />
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
