import { NavLink } from "react-router";
import Subject, { type DeathType } from "../model/Subject";
import skull from "../assets/skull.svg";
import add from "../assets/add.svg";
import minus from "../assets/minus.svg";
import step_into from "../assets/step_into.svg";
import details from "../assets/details.svg";
import reset from "../assets/reset.svg";
import readonly from "../assets/readonly.svg";
import Game from "../model/Game";
import Profile from "../model/Profile";
import type { TreeStateType } from "../contexts/treeContext";
import { useRef, useState } from "react";
import type {
	ModalListItemToggleType,
	ModalListItemInputEditType,
} from "./modals/ModalListItemTypes";
import Modal from "./modals/Modal";
import ModalListItemInputEdit from "./modals/ModalListItemInputEdit";
import ModalListItemToggle from "./modals/ModalListItemToggle";
import { ModalUtilityButton } from "./modals/ModalUtilityButton";

export type HandleDeathCountOperation = "add" | "subtract";

type Props = {
	tree: TreeStateType;
	treeNode: Game | Profile | Subject;
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

	const enabledCSS =
		"bg-amber-200 border-2 rounded-2xl shadow-[5px_2px_0px_rgba(0,0,0,1)]";
	const [resetDeathTypeMode, setResetDeathTypeMode] = useState(false);

	let cardCol = "bg-zomp";
	if (treeNode instanceof Subject && !treeNode.notable) {
		cardCol = "bg-amber-500";
	}

	const cardCSS = treeNode.completed
		? "bg-raisinblack text-amber-200"
		: `${cardCol} text-black`;
	const readOnlyToggleCSS = treeNode.completed ? enabledCSS : "";
	const resetToggleCSS = resetDeathTypeMode ? enabledCSS : "";
	const settersBtnDisplay = treeNode.completed ? "hidden" : "";
	const detailsReadOnlyCSS = treeNode.completed
		? "bg-amber-200 rounded-l shadow-[5px_2px_0px_rgba(0,0,0,1)]"
		: "";
	const deathType = resetDeathTypeMode ? "reset" : "fullTry";

	const deathCount =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getDeaths(tree)
			: treeNode.getDeaths();
	const fullTries =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getFullTries(tree)
			: treeNode.fullTries;
	const resets =
		treeNode instanceof Game || treeNode instanceof Profile
			? treeNode.getResets(tree)
			: treeNode.resets;

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

				<div className="ml-auto flex flex-col gap-2">
					{!(treeNode instanceof Subject) ? (
						<NavLink to={`/${treeNode.path}`}>
							<img className="w-9" src={step_into} alt="" />
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
						className={`w-9 cursor-pointer ${detailsReadOnlyCSS}`}
						src={details}
						alt=""
						onClick={() => modalRef.current!.showModal()}
						// onClick={() => handleDelete()}
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
						handleClick={handleDelete}
						bgCol="bg-indianred"
					/>,
				]}
			/>
		</>
	);
}
