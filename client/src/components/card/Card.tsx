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
import useModal from "../modal/useModal";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import Modal from "../modal/Modal";
import CardModalBody from "./CardModalBody";
import { useEffect, useState, type SetStateAction } from "react";
import AlertModalBody from "../modal/AlertModalBody";
import useCardModals from "./useCardModals";

export default function Card({ id }: { id: string }) {
	let navigate = useNavigate();

	const node = useTreeStore((state) =>
		state.tree.get(id),
	) as DistinctTreeNode;
	const updateNode = useTreeStore((state) => state.updateNode);
	const deleteNodes = useTreeStore((state) => state.deleteNodes);

	const cardModals = useCardModals(node);

	const mainPageTransitionState = createCardMainPageTransitionState(node);
	const { cardCSS, settersCSS, highlightingCSS, reoccurringCSS } =
		createCardCSS(node);
	const deathCount = getCardDeathCount(node);

	function showSaveReconfirm() {
		if (
			isCardModalStateEqual(
				cardModals.card.state as DistinctTreeNode,
				node,
			)
		) {
			cardModals.confirm.set(
				"No changes have been saved since you edited nothing!",
			);
			cardModals.confirm.props.set([
				{
					fn: () => {
						cardModals.confirm.ref.current?.close();
						cardModals.card.ref.current?.showModal();
					},
					label: "CLOSE",
				},
			]);
		} else {
			cardModals.confirm.set("Are you sure you want to edit this card?");
			cardModals.confirm.props.set([
				{
					fn: () => {
						cardModals.confirm.ref.current?.close();
						cardModals.card.ref.current?.showModal();
					},
					label: "CANCEL",
				},
				{
					fn: () => {},
					label: "CONFIRM",
					btnCol: "bg-hunyadi",
				},
			]);
		}
		cardModals.card.ref.current?.close();
		cardModals.confirm.ref.current?.showModal();
	}

	function showDeleteReconfirm() {}

	useEffect(() => {
		cardModals.card.set(node);
	}, [JSON.stringify(node)]);

	// useConsoleLogOnStateChange(cardModalState, "MODAL STATE", cardModalState);

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
					onClick={() => cardModals.card.ref.current?.showModal()}
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
				modalStyle="utility"
				body={
					<CardModalBody
						modalState={cardModals.card.state as DistinctTreeNode}
						setModalState={
							cardModals.card.set as React.Dispatch<
								SetStateAction<DistinctTreeNode>
							>
						}
					/>
				}
				modalRef={cardModals.card.ref}
				closeFn={{
					fn: () => cardModals.card.ref.current?.close(),
					label: "CLOSE",
				}}
				fn={{
					fn: () => showSaveReconfirm(),
					label: "SAVE",
					btnCol: "bg-hunyadi",
				}}
			/>

			<Modal
				modalStyle="alert"
				body={
					<AlertModalBody msg={cardModals.confirm.state as string} />
				}
				modalRef={cardModals.confirm.ref}
				closeFn={cardModals.confirm.props.state[0]}
				fn={cardModals.confirm.props.state[1]}
				fn2={cardModals.confirm.props.state[2]}
			/>
		</div>
	);
}
