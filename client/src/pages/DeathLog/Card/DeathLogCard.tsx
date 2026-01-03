import { useRef } from "react";
import Modal from "../../../components/Modal";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyWrapper from "../Modal/DeathLogModalEditBodyWrapper";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";

type Props = {
	node: DistinctTreeNode;
	entryNum: number;
};

export default function DeathLogCard({ node, entryNum }: Props) {
	const editModalRef = useRef<HTMLDialogElement>(null);
	const { page, handlePageState, handlePageTurn } = usePagination(2);

	const deaths =
		node.type == "game"
			? node.totalDeaths
			: node.type == "profile"
				? node.deathEntries.length
				: node.deaths;

	return (
		<>
			<li className="list-row sm:h-20">
				<div className="flex items-center justify-center">
					<span className="text-accent line-clamp-1 w-8 text-xs">
						{entryNum}
					</span>
					<div className="ml-2">
						<input
							type="checkbox"
							defaultChecked
							className="checkbox checkbox-sm checkbox-success"
						/>
					</div>
				</div>
				<div className="flex flex-col justify-center">
					<div className="line-clamp-4 sm:line-clamp-2">
						{node.name}
					</div>
					<div className="text-xs font-semibold uppercase opacity-60">
						{deaths}
					</div>
				</div>
				<DeathLogCardOptions
					node={node}
					handleEdit={() => editModalRef.current?.showModal()}
				/>
			</li>
			<Modal
				closeBtnName="Close"
				content={
					<DeathLogModalEditBodyWrapper
						node={node}
						page={page}
						handlePageState={(isRight) => handlePageTurn(isRight)}
					/>
				}
				header="View & Edit Entry"
				ref={editModalRef}
				modalBtns={[]}
				handleOnClose={() => handlePageState(1)}
			/>
		</>
	);
}
