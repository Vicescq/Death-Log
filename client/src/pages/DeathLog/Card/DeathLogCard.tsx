import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import useInputTextError from "./useInputTextError";
import DeathLogModalEditBodyPage1 from "./DeathLogModalEditBodyPage1";
import DeathLogModalEditBodyPage2 from "./DeathLogModalEditBodyPage2";

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

	const {
		inputTextError,
		setInputTextError,
		inputTextErrorIsDisplayed,
		setInputTextErrorIsDisplayed,
	} = useInputTextError(modalState.name);

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
				<Modal
					closeBtnName="Close (Cancel changes)"
					content={
						<>
							{page == 1 ? (
								<DeathLogModalEditBodyPage1
									node={modalState}
									handleOnEditChange={setModalState}
									inputTextError={inputTextError}
									inputTextErrorIsDisplayed={
										inputTextErrorIsDisplayed
									}
								/>
							) : (
								<DeathLogModalEditBodyPage2
									node={modalState}
									handleOnEditChange={setModalState}
								/>
							)}

							<div className="join mt-4 flex">
								<button
									className="join-item btn"
									onClick={() => {
										handlePageTurn(false);
									}}
								>
									«
								</button>
								<button className="join-item btn flex-1">
									Page {page}
								</button>
								<button
									className="join-item btn"
									onClick={() => {
										handlePageTurn(true);
									}}
								>
									»
								</button>
							</div>
						</>
					}
					header="View & Edit Entry"
					ref={editModalRef}
					modalBtns={[
						{
							text: "Close (Save changes)",
							css: "btn-neutral",
							fn: () => {
								try {
									updateModalEditedNode(node, modalState);
									editModalRef.current?.close();
								} catch (e) {
									if (e instanceof Error) {
										setInputTextErrorIsDisplayed(true);
										setInputTextError(e.message);
									}
								}
							},
						},
					]}
					handleOnClose={async () => {
						await new Promise((resolve) =>
							setTimeout(resolve, 650),
						); // if not used, ui flicker from page turn happens
						handlePageState(1);
						setModalState(node);
						setInputTextErrorIsDisplayed(false);
					}}
				/>
			</li>
		</>
	);
}
