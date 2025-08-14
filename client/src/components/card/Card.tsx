import { NavLink } from "react-router";
import skull from "../../assets/skull.svg";
import add from "../../assets/add.svg";
import minus from "../../assets/minus.svg";
import step_into from "../../assets/step_into.svg";
import details from "../../assets/details.svg";
import reset from "../../assets/reset.svg";
import readonly from "../../assets/readonly.svg";
import type { TreeStateType } from "../../contexts/treeContext";
import { useEffect, useRef, useState } from "react";
import type { DeathType, DistinctTreeNode } from "../../model/TreeNodeModel";
import { createCardCSS, generateCardDeathCounts } from "./cardUtils";
import CardModalBody from "./CardModalBody";
import Modal, {
	type CardModalStateGame,
	type CardModalStateProfile,
	type CardModalStateSubject,
} from "../Modal";

type Props = {
	pageType: "Game" | "Profile" | "Subject";
	treeNode: DistinctTreeNode;
	tree: TreeStateType;
};

export default function Card({ pageType, treeNode, tree }: Props) {
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const [resetDeathTypeMode, setResetDeathTypeMode] = useState(false);

	const [cardModalStateGame, setCardModalStateGame] =
		useState<CardModalStateGame>({
			dateStartR: true,
			dateEndR: true,
		});

	const [cardModalStateProfile, setCardModalStateProfile] =
		useState<CardModalStateProfile>({
			dateStartR: true,
			dateEndR: true,
		});

	const [cardModalStateSubject, setCardModalStateSubject] =
		useState<CardModalStateSubject>({
			dateStartR: true,
			dateEndR: true,
			reoccuring: false,
			composite: false,
		});

	const deathType: DeathType = resetDeathTypeMode ? "resets" : "fullTries";

	const {
		cardCSS,
		settersCSS,
		highlightingCSS,
		resetToggleHighlightingCSS,
		reoccurringCSS,
	} = createCardCSS(treeNode, resetDeathTypeMode);

	const { deathCount, fullTries, resets } = generateCardDeathCounts(
		treeNode,
		tree,
	);

	function handleInputEditChange(inputText: string, index: number) {
		// const modalStateCopy = [...modalState];
		// modalStateCopy[index] = { ...modalStateCopy[index] };
		// const inputEditState = modalStateCopy[
		//     index
		// ] as ModalListItemInputEditState;
		// inputEditState.change = inputText;
		// modalStateCopy[index] = inputEditState;
		// setModalState(modalStateCopy);
	}

	// fixed "bug" where state persists to next card in line if some card got deleted
	useEffect(() => {
		setResetDeathTypeMode(false);
	}, [treeNode.id]);

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
					<p className="line-clamp-4 break-words">{treeNode.name}</p>
				</div>
			</div>

			<div className="ml-auto flex flex-col gap-2">
				{!(treeNode.type == "subject") ? (
					<NavLink to={`/death-log/${treeNode.path}`}>
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
					onClick={() => modalRef.current!.showModal()}
				/>
				<img
					className={`w-9 cursor-pointer ${highlightingCSS} ${reoccurringCSS}`}
					src={readonly}
					alt=""
					// onClick={() => {
					// 	handleCompletedStatus!(!treeNode.completed);
					// }}
				/>
			</div>
			<Modal
				modalRef={modalRef}
				modalBody={
					pageType == "Game" ? (
						<CardModalBody
							pageType={pageType}
							state={cardModalStateGame}
							handleModalToggle={(key) =>
								setCardModalStateGame((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					) : pageType == "Profile" ? (
						<CardModalBody
							pageType={pageType}
							state={cardModalStateProfile}
							handleModalToggle={(key) =>
								setCardModalStateProfile((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					) : (
						<CardModalBody
							pageType={pageType}
							state={cardModalStateSubject}
							handleModalToggle={(key) =>
								setCardModalStateSubject((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					)
				}
			/>
		</div>
	);
}
