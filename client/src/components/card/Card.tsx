import { useNavigate } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import readonly from "../../assets/readonly.svg";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import {
	createCardCSS,
	createCardMainPageTransitionState,
	getCardDeathCount,
	isCardModalStateEqual,
} from "./utils";
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import useModal from "../../hooks/useModal";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import Modal, { type ModalPropsState } from "../modal/Modal";
import CardModalBody from "./CardModalBody";
import { useEffect, useState, type SetStateAction } from "react";
import AlertModalBody from "../modal/AlertModalBody";

export default function Card({ id }: { id: string }) {
	let navigate = useNavigate();

	const node = useTreeStore((state) =>
		state.tree.get(id),
	) as DistinctTreeNode;
	const updateNode = useTreeStore((state) => state.updateNode);
	const deleteNodes = useTreeStore((state) => state.deleteNodes);

	const {
		modalRef,
		modalState,
		setModalState,
		modalPropsState,
		setModalPropsState,
	} = useModal(node, {
		modalFn: {
			fn: () => 1,
			label: "CLOSE",
		},
		modalStyle: "utility",
		modalFn2: {
			fn: () => {
				setRCModalState("Are you sure you want to edit this card?");
				setRCModalPropsState((prev) => ({
					...prev,
					modalFn: {
						fn: () => 1,
						label: "CLOSE",
					},
					modalFn2: {
						fn: () => 1,
						label: "CONFIRM",
						btnCol: "bg-hunyadi",
					},
				}));
			},
			label: "SAVE",
			btnCol: "bg-hunyadi",
		},
		modalFn3: {
			fn: () => 1,
			label: "DELETE",
			btnCol: "bg-orange-700",
		},
	});

	const {
		modalRef: alertModalRef,
		modalState: alertModalState,
		setModalState: setAlertModalState,
		modalPropsState: alertModalPropsState,
		setModalPropsState: setAlertModalPropsState,
	} = useModal("", {
		modalStyle: "alert",
		modalFn: {
			fn: () => 1,
			label: "CLOSE",
		},
	});

	const {
		modalRef: rcModalRef,
		modalState: rcModalState,
		setModalState: setRCModalState,
		modalPropsState: rcModalPropsState,
		setModalPropsState: setRCModalPropsState,
	} = useModal("", {
		modalStyle: "alert",
		modalFn: {
			fn: () => 1,
			label: "CLOSE",
		},
	});

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);
	const deathCount = getCardDeathCount(node);

	useEffect(() => {
		setModalState(node);
	}, [JSON.stringify(node)]);

	// useConsoleLogOnStateChange(modalPropsState, "MODAL PROPS", modalPropsState);

	return (
		<div
			className={`flex border-4 border-black font-semibold ${cardCSS} h-54 w-60 rounded-xl p-2 shadow-[10px_8px_0px_rgba(0,0,0,1)] duration-200 ease-in-out hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}
		>
			<div className="flex w-38 flex-col">
				<div className="bg-indianred flex gap-1 rounded-2xl border-2 border-black p-1 px-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
					<img className="w-6" src={skull} alt="" />
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
								updateNode(node, {
									...node,
									deaths: node.deaths + 1,
								});
							}}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							onClick={() => {
								if (node.deaths != 0) {
									updateNode(node, {
										...node,
										deaths: node.deaths - 1,
									});
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
						const nodeCopy: DistinctTreeNode = {
							...node,
							completed: !node.completed,
						};
						updateNode(node, nodeCopy);
					}}
				/>
			</div>
			<Modal
				modalStyle={modalPropsState.modalStyle}
				body={
					<CardModalBody
						modalState={modalState as DistinctTreeNode}
						setModalState={
							setModalState as React.Dispatch<
								SetStateAction<DistinctTreeNode>
							>
						}
					/>
				}
				modalRef={modalRef}
				modalFn={modalPropsState.modalFn}
				modalFn2={modalPropsState.modalFn2}
				modalFn3={modalPropsState.modalFn3}
			/>

			<Modal
				modalStyle={rcModalPropsState.modalStyle}
				body={<AlertModalBody msg={rcModalState as string} />}
				modalRef={rcModalRef}
				modalFn={rcModalPropsState.modalFn}
				modalFn2={rcModalPropsState.modalFn2}
				modalFn3={rcModalPropsState.modalFn3}
			/>

			<Modal
				modalStyle={alertModalPropsState.modalStyle}
				body={<AlertModalBody msg={alertModalState as string} />}
				modalRef={alertModalRef}
				modalFn={alertModalPropsState.modalFn}
				modalFn2={alertModalPropsState.modalFn2}
				modalFn3={alertModalPropsState.modalFn3}
			/>
		</div>
	);
}
