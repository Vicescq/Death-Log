import { useEffect, useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../modals/Modal";
import type {
	AddItemCardPageType,
	HandleAddGame,
	HandleAddProfile,
	HandleAddSubject,
	HandleAddTypes,
} from "./AddItemCardTypes";
import AddItemCardModalBody, {
	type AddItemCardModalBodyState,
} from "./AddItemCardModalBody";

type Props = {
	pageType: AddItemCardPageType;
	handleAdd: HandleAddTypes;
};

export default function AddItemCard({ pageType, handleAdd }: Props) {
	const [settingState, setSettingState] = useState<AddItemCardModalBodyState>(
		{
			"Reliable Date (Start)": true,
			"Reliable Date (End)": true,
		},
	);
	const modalRef = useRef<HTMLDialogElement>(null);

	function handleAddWrapper() {
		switch (pageType) {
			case "Game":
				const handleAddGame = handleAdd as HandleAddGame;
				handleAddGame(params)
				break;
			case "Profile":
				const handleAddProfile = handleAdd as HandleAddProfile;
				break;
			case "Subject":
				const handleAddSubject = handleAdd as HandleAddSubject;
				break;
		}
	}

	function handleModalToggle(
		addItemCardModalBodyStateKey: keyof AddItemCardModalBodyState,
	) {
		const settingStateShallow = { ...settingState };
		settingStateShallow[addItemCardModalBodyStateKey] =
			!settingStateShallow[addItemCardModalBodyStateKey];
		setSettingState(settingStateShallow);
	}

	return (
		<header className="mb-8 flex w-full flex-col gap-4 border-b-4 bg-amber-200 p-4 text-black md:w-xl md:border-4 md:border-black md:shadow-[8px_5px_0px_rgba(0,0,0,1)]">
			<div className="flex gap-4">
				<input
					type="search"
					className="w-full rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
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
					onClick={() => true}
					className="bg-zomp w-full rounded-2xl border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]"
				>
					Add {pageType}
				</button>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img src={filter} alt="" className="w-10" />
				</button>
			</div>
			<Modal
				modalRef={modalRef}
				modalBody={
					<AddItemCardModalBody
						settingState={settingState}
						handleModalToggle={handleModalToggle}
						pageType={pageType}
					/>
				}
			/>
		</header>
	);
}
