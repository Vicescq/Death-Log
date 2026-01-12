import { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal";
import type {
	DistinctTreeNode,
	Profile,
	TreeNode,
} from "../../../model/TreeNodeModel";
import DeathLogCardOptions from "./DeathLogCardOptions";
import usePagination from "../../../hooks/usePagination";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import DeathLogModalEditBodyNameDate from "./DeathLogModalEditBodyNameDate";
import DeathLogModalEditBodyNotesDel from "./DeathLogModalEditBodyNotesDel";
import loop from "../../../assets/loop.svg";
import skullRed from "../../../assets/skull_red.svg";
import DeathLogModalEditBodySubject from "./DeathLogModalEditBodySubject";
import * as Utils from "../utils";
import {
	assertIsDistinctTreeNode,
	assertIsNonNull,
	assertIsProfile,
} from "../../../utils";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	nodeID: string;
	entryNum: number;
};

export default function DeathLogCard({ nodeID, entryNum }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const node = tree.get(nodeID);
	assertIsNonNull(node);
	assertIsDistinctTreeNode(node);
	const parentNode = tree.get(node.parentID);
	const deaths = Utils.calcDeaths(node, tree);

	const editModalRef = useRef<HTMLDialogElement>(null);
	const { page, handlePageState, handlePageTurn } = usePagination(
		node.type != "subject" ? 2 : 3,
	);

	const [modalState, setModalState] = useState<DistinctTreeNode>({ ...node });
	const [inputTextError, setInputTextError] = useState("");

	const completionNotifyModalRef = useRef<HTMLDialogElement>(null);
	const [checked, setChecked] = useState(node.completed);
	const completedCSSStrike = node.completed ? "line-through" : "";

	const [parentModalState, setParentModalState] = useState<Profile | null>(
		null,
	);
	useEffect(() => {
		if (node.type == "subject") {
			setParentModalState(getParentProfileNode(parentNode));
		}
	}, []);

	function getParentProfileNode(parentNode: TreeNode | undefined | null) {
		// for ts auto complete
		assertIsNonNull(parentNode);
		assertIsProfile(parentNode);
		return parentNode;
	}

	useConsoleLogOnStateChange(
		parentModalState,
		"Modal State:",
		parentModalState,
	);
	useConsoleLogOnStateChange(parentModalState, "OG:", parentNode);

	return (
		<>
			<li
				className={`list-row hover:bg-neutral rounded-none`}
				inert={false}
			>
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
								<DeathLogModalEditBodyNameDate
									node={modalState}
									handleOnEditChange={setModalState}
									inputTextError={inputTextError}
								/>
							) : page == 2 && modalState.type == "subject" ? (
								<DeathLogModalEditBodySubject
									node={modalState}
									handleOnEditChange={setModalState}
									handleOnEditChangeParent={(
										newModalState,
									) => {
										setParentModalState(newModalState);
									}}
									parentNode={getParentProfileNode(
										parentModalState,
									)}
								/>
							) : page == 2 || page == 3 ? (
								<DeathLogModalEditBodyNotesDel
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
							text: "Save edits",
							css: `${
								Utils.cardHasBeenEdited(
									node,
									modalState,
									parentNode?.type == "profile"
										? (() => {
												assertIsProfile(parentNode);
												return parentNode;
											})()
										: null,
									parentModalState,
								)
									? "btn-success"
									: "btn-disabled"
							} mt-10`,
							fn: () => {
								try {
									updateNode(node, modalState);
									editModalRef.current?.close();
								} catch (e) {
									if (e instanceof Error) {
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
						setInputTextError("");
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
