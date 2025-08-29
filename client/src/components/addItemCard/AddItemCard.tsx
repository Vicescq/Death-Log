import { useRef, useState } from "react";
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

	const {
		modalRef: aicModalRef,
		modalState: aicModalState,
		setModalState: setAICModalState,
	} = useModal({
		reoccurring: false,
		context: "boss",
	});
	const {
		modalRef: alertModalRef,
		modalState: alertModalState,
		setModalState: setAlertModalState,
	} = useModal("");

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
					aicModalState as AICSubjectOverrides,
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
				setAICModalState as React.Dispatch<
					React.SetStateAction<AICSubjectOverrides>
				>
			)((prev) => ({
				...prev,
				[setting]: !prev[setting],
			}));
		} else if (setting == "context" && selected) {
			(
				setAICModalState as React.Dispatch<
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
								aicModalRef.current?.showModal();
							}}
						/>
					</button>
				)}
			</div>
			<div className="flex gap-4">
				<button
					onClick={handleAdd}
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
				modalRef={aicModalRef}
				body={
					<AddItemCardModalBody
						state={aicModalState as AICSubjectOverrides}
						handleEdit={handleModalEdit}
						contextOptions={contextOptions}
					/>
				}
				negativeFn={() => aicModalRef.current?.close()}
				negativeFnBtnLabel="CLOSE"
			/>
			<Modal
				modalStyle="alert"
				modalRef={alertModalRef}
				body={<AlertModalBody msg={alertModalState as string} />}
				negativeFn={() => alertModalRef.current?.close()}
				negativeFnBtnLabel="CLOSE"
			/>
		</header>
	);
}
