import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogModalEditBodyWrapper from "./DeathLogModalEditBodyWrapper";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	node: DistinctTreeNode;
	entryNum: number;
};

export type DeathLogModalTarget =
	| "name"
	| "dateStart"
	| "dateEnd"
	| "notes"
	| "dateStartReliable"
	| "dateEndReliable";

export default function DeathLogCard({ node, entryNum }: Props) {
	const editModalRef = useRef<HTMLDialogElement>(null);
	const { page, handlePageState, handlePageTurn } = usePagination(2);
	const updateModalEditedNode = useDeathLogStore(
		(state) => state.updateModalEditedNode,
	);

	const [modalState, setModalState] = useState<DistinctTreeNode>({ ...node });

	const deaths =
		node.type == "game"
			? node.totalDeaths
			: node.type == "profile"
				? node.deathEntries.length
				: node.deaths;
	return (
		<>
			<li className="list-row" inert={false}>
				<div className="flex items-center justify-center">
					<span className="text-accent line-clamp-1 w-8 text-xs">
						{entryNum}
					</span>
					<div className="ml-2">
						<input
							type="checkbox"
							defaultChecked={node.completed}
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
				closeBtnName="Close (Cancel changes)"
				content={
					<DeathLogModalEditBodyWrapper
						node={modalState}
						page={page}
						handlePageState={(isRight) => handlePageTurn(isRight)}
						handleOnEditChange={(newModalState) =>
							setModalState(newModalState)
						}
					/>
				}
				header="View & Edit Entry"
				ref={editModalRef}
				modalBtns={[
					{
						text: "Close (Save changes)",
						css: "btn-neutral",
						fn: () => {
							updateModalEditedNode(node, modalState);
							editModalRef.current?.close();
						},
					},
				]}
				handleOnClose={async () => {
					await new Promise((resolve) => setTimeout(resolve, 650)); // if not used, ui flicker from page turn happens
					handlePageState(1);
					setModalState(node);
				}}
			/>
		</>
	);
}
