import { useNavigate } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import reset from "../../assets/reset.svg";
import readonly from "../../assets/readonly.svg";
import type { TreeStateType } from "../../contexts/treeContext";
import { useEffect, useRef, useState } from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
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

type Props<T extends DistinctTreeNode> = {
	node: T;
	tree: TreeStateType;
	handleDelete: () => void;
	handleCompletedStatus: () => void;
	handleModalSave: (
		overrides: T,
		cardModalRef: React.RefObject<HTMLDialogElement | null>,
	) => void;
	handleDeathCount?: (operation: "add" | "subtract") => void;
};

export default function Card<T extends DistinctTreeNode>({
	node,
	tree,
	handleDelete,
	handleCompletedStatus,
	handleModalSave,
	handleDeathCount,
}: Props<T>) {
	let navigate = useNavigate();

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
	const deathCount = getDeaths(node, tree);

	function handleModalEdit(inputText: string) {
		setModalState((prev) => ({ ...prev, name: inputText }));
	}

	function handleReconfirm(type: "cancel" | "goBack" | "delete") {
		switch (type) {
			case "goBack":
				warningModalRef.current?.close();
				modalRef.current?.showModal();
				break;
			case "delete":
				handleDelete();
				break;
			case "cancel":
				setModalState(node);
		}
	}

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
				{!(node.type == "subject") ? (
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
							onClick={() => handleDeathCount!("add")}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							onClick={() => handleDeathCount!("subtract")}
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
					onClick={handleCompletedStatus}
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
							handleModalSave(modalState, modalRef)
						}
						modalState={modalState}
						handleModalEdit={(inputText) =>
							handleModalEdit(inputText)
						}
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
