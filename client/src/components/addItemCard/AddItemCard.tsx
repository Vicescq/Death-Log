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
import type {
	SelectDropdownOption,
	SelectDropdownSelected,
} from "../SelectDropdown";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { useTreeStore } from "../../hooks/StateManagers/useTreeStore";
import useModal from "../../hooks/useModal";
import AlertModalBody from "../modal/AlertModalBody";

type Props = AICGame | AICProfile | AICSubject;

export default function AddItemCard({ pageType, parentID }: Props) {
	const addNode = useTreeStore((state) => state.addNode);
	const [inputText, setInputText] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	// {
	// 	reoccurring: false,
	// 	context: "boss",
	// }

	const {
		modalRef,
		modalState,
		setModalState,
		modalPropsState,
		setModalPropsState,
	} = useModal(
		{ reoccurring: false, context: "boss" },
		{
			modalStyle: "utility",
			modalFn: {
				fn: () => modalRef.current?.close(),
				label: "CLOSE",
			},
		},
	);
	const {
		modalRef: alertModalRef,
		modalState: alertModalState,
		setModalState: setAlertModalState,
		modalPropsState: alertModalPropsState,
		setModalPropsState: setAlertModalPropsState,
	} = useModal("", {
		modalStyle: "alert",
		modalFn: {
			fn: () => alertModalRef.current?.close(),
			label: "CLOSE",
		},
	});

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
					modalState as AICSubjectOverrides,
				);
			}
		} catch (e) {
			if (e instanceof Error) {
				setAlertModalState(e.message);
				alertModalRef.current?.showModal();
			}
		}
	}

	const contextOptions: SelectDropdownOption[] = [
		{
			value: "boss",
			text: "Boss",
		},
		{
			value: "location",
			text: "Location",
		},
		{
			value: "other",
			text: "Other",
		},
	];

	function handleModalEdit(
		setting: keyof AICSubjectOverrides,
		selected?: SelectDropdownSelected,
	) {
		if (setting != "context") {
			(
				setModalState as React.Dispatch<
					React.SetStateAction<AICSubjectOverrides>
				>
			)((prev) => ({
				...prev,
				[setting]: !prev[setting],
			}));
		} else if (setting == "context" && selected) {
			(
				setModalState as React.Dispatch<
					React.SetStateAction<AICSubjectOverrides>
				>
			)((prev) => ({
				...prev,
				[setting]: selected,
			}));
		} else {
			throw new Error("DEV ERROR! Selected param should be defined!");
		}
	}

	return (
		<header className="mb-8 flex w-full flex-col gap-4 border-b-4 bg-amber-200 p-4 font-semibold text-black md:w-xl md:border-4 md:border-black md:shadow-[8px_5px_0px_rgba(0,0,0,1)]">
			<div className="flex gap-4">
				<input
					type="text"
					className="w-full rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
					onChange={(e) => setInputText(e.target.value)}
					ref={inputRef}
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
								if (modalPropsState.modalStyle == "utility") {
									modalRef.current?.showModal();
								}
							}}
						/>
					</button>
				)}
			</div>
			<div className="flex gap-4">
				<button
					onClick={() => {
						handleAdd();
						if (inputRef.current) {
							inputRef.current.value = "";
						}
					}}
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
				modalStyle={modalPropsState.modalStyle}
				body={
					<AddItemCardModalBody
						state={modalState as AICSubjectOverrides}
						handleEdit={(setting, selected) =>
							handleModalEdit(setting, selected)
						}
						contextOptions={contextOptions}
					/>
				}
				modalRef={modalRef}
				modalFn={modalPropsState.modalFn}
				modalFn2={modalPropsState.modalFn2}
				modalFn3={modalPropsState.modalFn3}
			/>
			<Modal
				modalStyle={alertModalPropsState.modalStyle}
				body={<AlertModalBody msg={alertModalState as string} />}
				modalRef={alertModalRef}
				modalFn={alertModalPropsState.modalFn}
				modalFn2={alertModalPropsState.modalFn2}
				modalFn3={alertModalPropsState.modalFn3}
			/>
		</header>
	);
}
