import { add } from "dexie";
import { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router";
import type { DeathType } from "../../model/TreeNodeModel";
import Modal from "../Modal";
import { type CardModalStateGame } from "./CardTypes";
import { type CardModalStateProfile, type CardModalStateSubject } from "./CardTypes";
import CardModalBody from "./CardModalBody";
import { createCardModalState, createCardCSS, generateCardDeathCounts } from "./cardUtils";

export default function CardGame(){
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

}