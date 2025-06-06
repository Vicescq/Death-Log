import { NavLink } from "react-router";
import skull from "../assets/skull.svg";
import add from "../assets/add.svg";
import minus from "../assets/minus.svg";
import step_into from "../assets/step_into.svg";
import details from "../assets/details.svg";
import reset from "../assets/reset.svg";
import readonly from "../assets/readonly.svg";
import type { TreeStateType } from "../contexts/treeContext";
import { useEffect, useRef, useState } from "react";
import type {
	ModalListItemToggleType,
	ModalListItemInputEditType,
} from "./modals/ModalListItemTypes";
import Modal from "./modals/Modal";
import ModalListItemInputEdit from "./modals/ModalListItemInputEdit";
import ModalListItemToggle from "./modals/ModalListItemToggle";
import { ModalUtilityButton } from "./modals/ModalUtilityButton";
import { createCardCSS, generateCardDeathCounts } from "../utils/ui";
import type { DeathType, DistinctTreeNode } from "../model/TreeNodeModel";

export type HandleDeathCountOperation = "add" | "subtract";

type Props = {
	tree: TreeStateType;
	treeNode: DistinctTreeNode;
	handleDeathCount?: (
		deathType: DeathType,
		operation: HandleDeathCountOperation,
	) => void;
	handleCompletedStatus?: (newStatus: boolean) => void;
	handleDelete: () => void;
	modalListItemArray: (
		| ModalListItemToggleType
		| ModalListItemInputEditType
	)[];
	handleDetailsSettingSubmit?: (inputText: string) => void;
};

export default function Card({
	tree,
	treeNode,
	handleDeathCount,
	handleCompletedStatus,
	handleDelete,
	modalListItemArray,
	handleDetailsSettingSubmit,
}: Props) {
	const modalRef = useRef<HTMLDialogElement | null>(null);
	const [inputText, setInputText] = useState("");
	const [resetDeathTypeMode, setResetDeathTypeMode] = useState(false);
	const deathType: DeathType = resetDeathTypeMode ? "resets" : "fullTries";
	const {
		cardCSS,
		readOnlyToggleCSS,
		resetToggleCSS,
		settersBtnDisplay,
		readOnlyEnabledCSS,
	} = createCardCSS(treeNode, resetDeathTypeMode);

	const { deathCount, fullTries, resets } = generateCardDeathCounts(
		treeNode,
		tree,
	);

	// fixed "bug" where state persists to next card in line if some card got deleted
	useEffect(() => {
		setResetDeathTypeMode(false);
		setInputText("");
	}, [treeNode.id]);

	return (
		<>
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
						<p className="line-clamp-4 break-words">
							{treeNode.name}
						</p>
					</div>
				</div>

				<div className="ml-auto flex flex-col gap-2 ">
					{!(treeNode.type == "subject") ? (
						<NavLink to={`/${treeNode.path}`}>
							<img className={`w-9 ${readOnlyEnabledCSS}`} src={step_into} alt="" />
						</NavLink>
					) : (
						<>
							<img
								className={`w-9 cursor-pointer ${settersBtnDisplay}`}
								src={add}
								alt=""
								onClick={() =>
									handleDeathCount!(deathType, "add")
								}
							/>
							<img
								className={`w-9 cursor-pointer ${settersBtnDisplay}`}
								src={minus}
								alt=""
								onClick={() =>
									handleDeathCount!(deathType, "subtract")
								}
							/>
							<img
								className={`w-9 cursor-pointer ${settersBtnDisplay} ${resetToggleCSS}`}
								src={reset}
								alt=""
								onClick={() => {
									setResetDeathTypeMode((prev) => !prev);
								}}
							/>
						</>
					)}
					<img
						className={`w-9 cursor-pointer ${readOnlyEnabledCSS}`}
						src={details}
						alt=""
						onClick={() => modalRef.current!.showModal()}
					/>
					<img
						className={`w-9 cursor-pointer ${readOnlyToggleCSS}`}
						src={readonly}
						alt=""
						onClick={() => {
							handleCompletedStatus!(!treeNode.completed);
						}}
					/>
				</div>
			</div>

			<Modal
				modalRef={modalRef}
				listItems={modalListItemArray.map((li, index) => {
					if (li.type == "inputEdit") {
						return (
							<ModalListItemInputEdit
								key={index}
								modalListItem={li}
								index={index}
								handleChange={(inputText) =>
									setInputText(inputText)
								}
							/>
						);
					} else {
						return (
							<ModalListItemToggle
								key={index}
								modalListItem={li}
								handleToggleSetting={() => true}
								index={index}
							/>
						);
					}
				})}
				utilityBtns={[
					<ModalUtilityButton
						key={0}
						name={"EDIT"}
						handleClick={() => {
							handleDetailsSettingSubmit!(inputText);
							modalRef.current?.close();
						}}
						bgCol="bg-hunyadi"
					/>,
					<ModalUtilityButton
						key={1}
						name={"DELETE"}
						handleClick={() => {
							handleDelete();
							modalRef.current?.close();
						}}
						bgCol="bg-indianred"
					/>,
				]}
			/>
		</>
	);
}
