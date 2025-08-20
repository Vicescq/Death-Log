import { NavLink } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import reset from "../../assets/reset.svg";
import readonly from "../../assets/readonly.svg";
import type { TreeStateType } from "../../contexts/treeContext";
import React, { useEffect, useRef, useState } from "react";
import type { DeathType, DistinctTreeNode } from "../../model/TreeNodeModel";
import {
	createCardCSS,
	createCardModalState,
	generateCardDeathCounts,
} from "./cardUtils";
import CardModalBody from "./CardModalBody";
import type {
	CardModalStateGame,
	CardModalStateProfile,
	CardModalStateSubject,
} from "./CardTypes";
import Modal from "../Modal";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";

type Props = {
	node: DistinctTreeNode;
	tree: TreeStateType;
	handleDelete: (node: DistinctTreeNode) => void;
	handleCompletedStatus: () => void;
	handleEdit: (
		overrides:
			| CardModalStateGame
			| CardModalStateProfile
			| CardModalStateSubject,
	) => void;
};

export default function Card({
	node,
	tree,
	handleDelete,
	handleCompletedStatus,
	handleEdit,
}: Props) {
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const [isModalEdited, setIsModalEdited] = useState(false);
	const [resetDeathTypeMode, setResetDeathTypeMode] = useState(false);

	const [modalState, setModalState] = useState(createCardModalState(node));

	const deathType: DeathType = resetDeathTypeMode ? "resets" : "fullTries";

	const {
		cardCSS,
		settersCSS,
		highlightingCSS,
		resetToggleHighlightingCSS,
		reoccurringCSS,
	} = createCardCSS(node, resetDeathTypeMode);

	const { deathCount, fullTries, resets } = generateCardDeathCounts(
		node,
		tree,
	);

	let cardModalBody: React.JSX.Element;
	switch (node.type) {
		case "game":
			const modalStateGame = modalState as CardModalStateGame;
			cardModalBody = (
				<CardModalBody
					state={modalStateGame}
					pageType={node.type}
					handleDelete={() => handleDelete(node)}
					handleIsModalEdited={() => {
						setIsModalEdited(true);
						const x = 1;
					}}
					handleEdit={handleEdit}
				/>
			);
			break;
		case "profile":
			const modalStateProfile = modalState as CardModalStateProfile;
			cardModalBody = (
				<CardModalBody
					state={modalStateProfile}
					pageType={node.type}
					handleDelete={() => handleDelete(node)}
					handleIsModalEdited={() => setIsModalEdited(true)}
					handleEdit={handleEdit}
				/>
			);
			break;

		case "subject":
			const modalStateSubject = modalState as CardModalStateSubject;
			cardModalBody = (
				<CardModalBody
					state={modalStateSubject}
					pageType={node.type}
					handleDelete={() => handleDelete(node)}
					handleIsModalEdited={() => setIsModalEdited(true)}
					handleEdit={handleEdit}
					handleModalToggle={(key) =>
						setModalState((prev: CardModalStateSubject) => ({
							...prev,
							[key]: !prev[key],
						}))
					}
				/>
			);
			break;
	}

	// fixed "bug" where state persists to next card in line if some card got deleted
	useEffect(() => {
		setResetDeathTypeMode(false);
	}, [node.id]);

	return (
		<div
			className={`flex border-4 border-black font-semibold ${cardCSS} h-60 w-60 rounded-xl p-2 shadow-[10px_8px_0px_rgba(0,0,0,1)] hover:shadow-[20px_10px_0px_rgba(0,0,0,1)]`}
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
					<NavLink to={`/death-log/${node.path}`}>
						<img
							className={`w-9 ${highlightingCSS}`}
							src={step_into}
							alt=""
						/>
					</NavLink>
				) : (
					<>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={add}
							alt=""
							// onClick={() => handleDeathCount!(deathType, "add")}
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS}`}
							src={minus}
							alt=""
							// onClick={() =>
							// 	handleDeathCount!(deathType, "subtract")
							// }
						/>
						<img
							className={`w-9 cursor-pointer ${settersCSS} ${resetToggleHighlightingCSS}`}
							src={reset}
							alt=""
							// onClick={() => {
							// 	setResetDeathTypeMode((prev) => !prev);
							// }}
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
				modalBody={cardModalBody}
				handleIsModalEdited={() => setIsModalEdited(true)}
			/>
		</div>
	);
}
