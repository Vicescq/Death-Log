import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import useInputTextError from "./useInputTextError";
import DeathLogModalEditBodyPage1 from "./DeathLogModalEditBodyPage1";
import DeathLogModalEditBodyPage2 from "./DeathLogModalEditBodyPage2";
import loop from "../../../assets/loop.svg";
import skullRed from "../../../assets/skull_red.svg";
import { useNavigate } from "react-router";
import DeathLogModalEditBodyPage3 from "./DeathLogModalEditBodyPage3";
import * as Utils from "../utils";

type Props = {
	node: DistinctTreeNode;
	entryNum: number;
};

export default function DeathLogCard({ node, entryNum }: Props) {
	const editModalRef = useRef<HTMLDialogElement>(null);
	const { page, handlePageState, handlePageTurn } = usePagination(
		node.type != "subject" ? 2 : 3,
	);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [modalState, setModalState] = useState<DistinctTreeNode>({ ...node });

	const {
		inputTextError,
		setInputTextError,
		inputTextErrorIsDisplayed,
		setInputTextErrorIsDisplayed,
	} = useInputTextError(modalState.name);

	const tree = useDeathLogStore((state) => state.tree);
	const deaths = Utils.calcDeaths(node, tree);

	const completionNotifyModalRef = useRef<HTMLDialogElement>(null);
	const [checked, setChecked] = useState(node.completed);
	const completedCSSStrike = node.completed ? "line-through" : "";

	const navigate = useNavigate();
	return (
		<>
			<li className={`list-row rounded-none`} inert={false}>
				<div className="flex items-center justify-center">
					<span className="text-accent line-clamp-1 w-8 text-xs">
						{entryNum}
					</span>
					<div>
						{node.type == "subject" && node.reoccurring ? (
							<img src={loop} alt="" className="w-6" />
						) : (
							<input
								type="checkbox"
								checked={checked}
								className="checkbox checkbox-sm checkbox-success"
								onChange={() =>
									completionNotifyModalRef.current?.showModal()
								}
							/>
						)}
					</div>
				</div>
				<div
					className={`flex flex-col justify-center ${completedCSSStrike}`}
				>
					<div className="line-clamp-4 sm:line-clamp-2">
						{node.name}
					</div>
					<div className="flex gap-2 font-semibold uppercase opacity-60">
						<img src={skullRed} alt="" className="w-4" />
						{deaths}
					</div>
				</div>
				<DeathLogCardOptions
					node={node}
					handleEdit={() => editModalRef.current?.showModal()}
				/>
				<Modal
					closeBtnName="Cancel"
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
							) : page == 2 ? (
								<DeathLogModalEditBodyPage2
									node={modalState}
									handleOnEditChange={setModalState}
								/>
							) : modalState.type == "subject" ? (
								<DeathLogModalEditBodyPage3
									node={modalState}
									handleOnEditChange={setModalState}
								/>
							) : null}

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
							text: "Check FAQ",
							css: "btn-neutral",
							fn: () => navigate("/FAQ"),
						},
						{
							text: "Save edits",
							css: "btn-neutral",
							fn: () => {
								try {
									updateNode(node, modalState);
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
				<Modal
					closeBtnName="Cancel"
					content={<></>}
					ref={completionNotifyModalRef}
					header={`Do you want to mark this as ${!checked ? "complete?" : "incomplete?"}`}
					modalBtns={[
						{
							text: "Confirm",
							css: "btn-success",
							fn: async () => {
								completionNotifyModalRef.current?.close();
								await new Promise((resolve) =>
									setTimeout(resolve, 210),
								);
								const newChecked = !checked;
								if (newChecked) {
									updateNode(node, {
										...node,
										completed: newChecked,
										dateEnd: new Date().toISOString(),
									});
								} else {
									updateNode(node, {
										...node,
										completed: newChecked,
										dateEnd: null,
									});
								}
								setChecked(newChecked);
							},
						},
					]}
				/>
			</li>
		</>
	);
}
