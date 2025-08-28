import { useNavigate } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import readonly from "../../assets/readonly.svg";
import { useRef, useState } from "react";
import type {
	DistinctTreeNode,
	Subject,
	TreeNode,
} from "../../model/TreeNodeModel";
import {
	createCardCSS,
	createCardMainPageTransitionState,
	isCardModalStateEqual,
} from "./utils";
import CardModalBody from "./CardModalBody";
import Modal from "../modal/Modal";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import WarningModalBody from "../modal/WarningModalBody";
import useWarningStates from "../../hooks/useWarningStates";
import { getDeaths } from "../../contexts/managers/treeUtils";
import { useTreeStore } from "../../hooks/StateManager/useTreeStore";

type Props<T extends DistinctTreeNode> = {
	parentID: string;
	id: string;
};

export default function Card<T extends DistinctTreeNode>({
	parentID,
	id,
}: Props<T>) {
	let navigate = useNavigate();

	const treeNode = useTreeStore((state) => state.tree.get(id));
	if (treeNode == undefined || treeNode.type == "ROOT_NODE") {
		throw new Error(
			"DEV ERROR! INCORRECTLY PASSED IN ROOT NODE OR UNDEFINED NODE TO A CARD",
		);
	}

	const node = treeNode as DistinctTreeNode;
	const deleteNodes = useTreeStore((state) => state.deleteNodes);
	const updateNode = useTreeStore((state) => state.updateNode);

	const [modalState, setModalState] = useState(node);
	const modalRef = useRef<HTMLDialogElement | null>(null);

	const {
		warningModalRef: warningDelModalRef,
		warning: warningDel,
		setWarning: setWarningDel,
	} = useWarningStates();
	const { warningModalRef, warning, setWarning } = useWarningStates();

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);
	const deathCount = getDeaths(node);

	function handleReconfirm(type: "cancel" | "goBack" | "delete") {
		switch (type) {
			case "goBack":
				warningModalRef.current?.close();
				modalRef.current?.showModal();
				break;
			case "delete":
				// handleDelete();
				deleteNodes(node, parentID);
				break;
			case "cancel":
				setModalState(node);
		}
	}

	useConsoleLogOnStateChange(modalState, "MODAL STATE", modalState);

	return (
		<div
			className={`flex border-4 border-black font-semibold ${cardCSS} h-60 w-60 rounded-xl p-2 shadow-[10px_8px_0px_rgba(0,0,0,1)] duration-200 ease-in-out hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}
		>
			<div className="flex w-40 flex-col">
				<div className="bg-indianred flex gap-1 rounded-2xl border-2 border-black p-1 px-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
					<img className="w-9" src={skull} alt="" />
					<p className="mt-auto mb-auto truncate text-xl">
						{deathCount}
					</p>
				</div>

				<div className="mt-auto rounded-xl text-2xl">
					<p className="line-clamp-4 break-words">{node.name}</p>
				</div>
			</div>

			<div className="ml-auto flex flex-col gap-2">
				{node.type != "subject" ? (
					<img
						className={`w-9 ${highlightingCSS} cursor-pointer`}
						src={step_into}
						alt=""
						onClick={() =>
							navigate("/death-log", {
								state: mainPageTransitionState,
							})
						}
					/>
				) : (
					<>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={add}
							alt=""
							onClick={() => {
								updateNode(
									node,
									{
										...node,
										deaths: node.deaths + 1,
									},
									parentID,
								);
							}}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							onClick={() => {
								if (node.deaths != 0) {
									updateNode(
										node,
										{
											...node,
											deaths: node.deaths - 1,
										},
										parentID,
									);
								}
							}}
						/>
					</>
				)}
				<img
					className={`w-9 cursor-pointer ${highlightingCSS}`}
					src={details}
					alt=""
					onClick={() => modalRef.current?.showModal()}
				/>
				<img
					className={`w-9 cursor-pointer ${highlightingCSS} ${reoccurringCSS}`}
					src={readonly}
					alt=""
					onClick={() => {
						const nodeCopy: DistinctTreeNode = {...node, completed: !node.completed};
						updateNode(node, nodeCopy, parentID);
					}}
				/>
			</div>

			<Modal
				modalRef={modalRef}
				type="generic"
				handleModalClose={() => {
					if (!isCardModalStateEqual(modalState, node)) {
						warningModalRef.current?.showModal();
						setWarning(
							"You have unsaved changes! Click cancel to discard those changes",
						);
					}
				}}
				modalBody={
					<CardModalBody
						handleDelete={() => {
							modalRef.current?.close();
							warningDelModalRef.current?.showModal();
							setWarningDel("You are about to delete something!");
						}}
						handleModalSave={() =>
							updateNode(node, modalState, parentID)
						}
						modalState={modalState}
						setModalState={setModalState}
					/>
				}
			/>

			<Modal
				modalRef={warningModalRef}
				type="warningReconfirm"
				modalBody={
					<WarningModalBody
						msg={warning}
						type="editReconfirm"
						handleReconfirm={handleReconfirm}
					/>
				}
				handleModalClose={() => {
					handleReconfirm("cancel");
				}}
			/>

			<Modal
				modalRef={warningDelModalRef}
				type="warningReconfirm"
				modalBody={
					<WarningModalBody
						msg={warningDel}
						type="deleteReconfirm"
						handleReconfirm={handleReconfirm}
					/>
				}
			/>
		</div>
	);
}
