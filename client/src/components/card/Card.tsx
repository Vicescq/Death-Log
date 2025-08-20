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
import type {
	DeathType,
	DistinctTreeNode,
	Game,
	Profile,
	Subject,
} from "../../model/TreeNodeModel";
import {
	createCardCSS,
	createCardModalState,
	generateCardDeathCounts,
} from "./cardUtils";
import CardModalBody from "./CardModalBody";
import type { CardModalStateGame } from "./CardTypes";
import type { CardModalStateProfile, CardModalStateSubject } from "./CardTypes";
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
	const [editedModalState, setEditedModalState] = useState(false);
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
					pageType="game"
					state={modalStateGame}
					handleDelete={() => handleDelete(node)}
					handleEditedCardModal={() => setEditedModalState(true)}
					handleEdit={() =>
						handleEdit({
							name: modalStateGame.name,
							composite: true,
						})
					}
				/>
			);
			break;
		case "profile":
			const modalStateProfile = modalState as CardModalStateProfile;
			cardModalBody = (
				<CardModalBody
					pageType="profile"
					state={modalStateProfile}
					handleDelete={() => handleDelete(node)}
					handleEditedCardModal={() => setEditedModalState(true)}
					handleEdit={() =>
						handleEdit({
							name: modalStateProfile.name,
						})
					}
				/>
			);
			break;

		default:
			const modalStateSubject = modalState as CardModalStateSubject;
			cardModalBody = (
				<CardModalBody
					pageType="subject"
					state={modalStateSubject}
					handleDelete={() => handleDelete(node)}
					handleEditedCardModal={() => setEditedModalState(true)}
					handleEdit={() =>
						handleEdit({
							name: modalStateSubject.name,
							reoccurring: modalStateSubject.reoccurring,
							composite: modalStateSubject.composite,
						})
					}
					handleModalToggle={() => true}
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
			<Modal modalRef={modalRef} modalBody={cardModalBody} />
		</div>
	);
}
