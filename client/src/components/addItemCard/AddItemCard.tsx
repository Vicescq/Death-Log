import { useEffect, useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../modal/Modal";
import type {
	AICGame,
	AICProfile,
	AICSubject,
	AICSubjectOverrides,
} from "./types";
import AddItemCardModalBody from "./AddItemCardModalBody";
import type { SelectDropdownSelected } from "../SelectDropDown";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { useTreeStore } from "../../stores/useTreeStore";
import AlertModalBody from "../modal/AlertModalBody";
import useAICModals from "./useAICModals";
import { contextOptions } from "../../utils";

type Props = AICGame | AICProfile | AICSubject;

export default function AddItemCard({ pageType, parentID }: Props) {
	const addNode = useTreeStore((state) => state.addNode);
	const [inputText, setInputText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const aicModals = useAICModals();

	function handleAdd() {
		try {
			if (pageType === "game") {
				addNode("game", inputText, parentID);
			} else if (pageType === "profile") {
				addNode("profile", inputText, parentID);
			} else if (pageType === "subject") {
				addNode(
					"subject",
					inputText,
					parentID,
					aicModals.aic.state,
				);
			}
			if (inputRef.current) {
				inputRef.current.value = "";
			}
			setInputText("");
		} catch (e) {
			if (e instanceof Error) {
				aicModals.alert.set(e.message);
				aicModals.alert.ref.current?.showModal();
			}
		}
	}

	function handleModalEdit(
		setting: keyof AICSubjectOverrides,
		selected?: SelectDropdownSelected,
	) {
		if (setting != "context") {
			aicModals.aic.set((prev) => ({
				...prev,
				[setting]: !prev[setting],
			}));
		} else if (setting == "context" && selected) {
			aicModals.aic.set((prev) => ({
				...prev,
				[setting]: selected,
			}));
		} else {
			throw new Error("DEV ERROR! Selected param should be defined!");
		}
	}

	return (
		<header className="mb-8 flex w-full flex-col gap-4 border-b-4 bg-amber-200 p-4 font-semibold text-black md:mt-10 md:w-2xl md:border-4 md:border-black md:shadow-[8px_5px_0px_rgba(0,0,0,1)]">
			<div className="flex gap-4">
				<input
					value={inputText}
					type="text"
					className="w-full rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
					onChange={(e) => setInputText(e.target.value)}
					ref={inputRef}
					onBlur={(e) => setInputText(() => e.target.value.trim())}
				/>

				{pageType == "game" || pageType == "profile" ? (
					<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
						<img src={filter} alt="" className="w-10" />
					</button>
				) : (
					<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
						<img
							src={gear}
							alt=""
							className="w-10"
							onClick={() => {
								aicModals.aic.ref.current?.showModal();
							}}
						/>
					</button>
				)}
			</div>
			<div className="flex gap-4">
				<button
					onClick={() => handleAdd()}
					className="bg-zomp w-full rounded-2xl border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]"
				>
					Add {pageType}
				</button>
				{pageType == "subject" ? (
					<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
						<img src={filter} alt="" className="w-10" />
					</button>
				) : null}
			</div>

			<Modal
				modalStyle="utility"
				modalRef={aicModals.aic.ref}
				body={
					<AddItemCardModalBody
						state={aicModals.aic.state}
						handleEdit={handleModalEdit}
						contextOptions={contextOptions}
					/>
				}
				closeFn={{
					fn: () => aicModals.aic.ref.current?.close(),
					label: "CLOSE",
				}}
			/>

			<Modal
				modalStyle="alert"
				modalRef={aicModals.alert.ref}
				body={<AlertModalBody msg={aicModals.alert.state} />}
				closeFn={{
					fn: () => aicModals.alert.ref.current?.close(),
					label: "CLOSE",
				}}
			/>
		</header>
	);
}
