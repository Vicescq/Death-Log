import { useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../modals/Modal";
import {
	createModalListItems,
	createModalState,
	createModalUtilityButtons,
} from "../modals/modalUtils";
import type { ModalListItemToggleState } from "../modals/ModalListItemStateTypes";
import type { AddItemCardProps } from "./AddItemCardProps";

export default function AddItemCard({
	pageType,
	modalSchema,
	handleAdd,
}: AddItemCardProps) {
	const [modalState, setModalState] = useState(createModalState(modalSchema));
	const [inputText, setInputText] = useState("");
	const modalRef = useRef<HTMLDialogElement>(null);

	function handleAddWrapper() {
		let notable,
			dateStartR,
			dateEndR,
			boss,
			location,
			other = undefined;

		modalState.forEach((state) => {
			if (state.type == "toggle") {
				if (state.toggleSetting == "notable" && !state.enable) {
					notable = false;
				}
				if (state.toggleSetting == "dateStartR" && !state.enable) {
					dateStartR = false;
				}
				if (state.toggleSetting == "dateEndR" && !state.enable) {
					dateEndR = false;
				}
				if (state.toggleSetting == "boss" && !state.enable) {
					boss = false;
				}
				if (state.toggleSetting == "location" && state.enable) {
					location = true;
				}
				if (state.toggleSetting == "other" && state.enable) {
					other = true;
				}
			}
		});

		switch (pageType) {
			case "Game":
				handleAdd(inputText, dateStartR, dateEndR);
				break;
			case "Profile":
				handleAdd(inputText, dateStartR, dateEndR);
				break;
			case "Subject":
				handleAdd(
					inputText,
					notable,
					dateStartR,
					dateEndR,
					boss,
					location,
					other,
				);
		}
	}

	function handleToggle(index: number) {
		const newModalState = [...modalState];
		let newModalToggleState = newModalState[
			index
		] as ModalListItemToggleState;
		newModalToggleState = {
			...newModalToggleState,
			enable: !newModalToggleState.enable,
		} as ModalListItemToggleState;
		newModalState[index] = newModalToggleState;
		setModalState(newModalState);
	}

	return (
		<header className="mb-8 flex w-full flex-col gap-4 border-b-4 bg-amber-200 p-4 text-black md:w-xl md:border-4 md:border-black md:shadow-[8px_5px_0px_rgba(0,0,0,1)]">
			<div className="flex gap-4">
				<input
					type="search"
					className="w-full rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
					onChange={(e) => setInputText(e.target.value)}
				/>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img
						src={gear}
						alt=""
						className="w-10"
						onClick={() => modalRef.current?.showModal()}
					/>
				</button>
			</div>
			<div className="flex gap-4">
				<button
					className="bg-zomp w-full rounded-2xl border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]"
					onClick={() => handleAddWrapper()}
				>
					Add {pageType}
				</button>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img src={filter} alt="" className="w-10" />
				</button>
			</div>
			<Modal
				modalRef={modalRef}
				modalListItems={createModalListItems(modalState, handleToggle)}
				modalUtilityBtns={createModalUtilityButtons(modalSchema, modalRef)}
			/>
		</header>
	);
}
