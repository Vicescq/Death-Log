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

type Props = AICGame | AICProfile | AICSubject;

export default function AddItemCard({ pageType, handleAdd }: Props) {
	const [inputText, setInputText] = useState("");
	const modalRef = useRef<HTMLDialogElement>(null);

	const [subjectModalState, setSubjectModalState] =
		useState<AICSubjectOverrides>({
			reoccurring: false,
			context: "boss",
		});

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

	let handleAddWrapper: () => void;
	if (pageType == "game") {
		handleAddWrapper = () => {
			handleAdd(inputText);
		};
	} else if (pageType == "profile") {
		handleAddWrapper = () => {
			handleAdd(inputText);
		};
	} else if (pageType == "subject") {
		handleAddWrapper = () => {
			handleAdd(inputText, subjectModalState);
		};
	}

	function handleModalEdit(
		setting: keyof AICSubjectOverrides,
		selected?: SelectDropdownSelected,
	) {
		if (setting != "context") {
			setSubjectModalState((prev) => ({
				...prev,
				[setting]: !prev[setting],
			}));
		} else if (setting == "context" && selected) {
			setSubjectModalState((prev) => ({
				...prev,
				[setting]: selected,
			}));
		} else {
			throw new Error("DEV ERROR! Selected param should be defined!");
		}
	}

	// useConsoleLogOnStateChange(subjectModalState, subjectModalState)

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
							onClick={() => modalRef.current?.showModal()}
						/>
					</button>
				)}
			</div>
			<div className="flex gap-4">
				<button
					onClick={() => handleAddWrapper()}
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
				modalRef={modalRef}
				modalBody={
					<AddItemCardModalBody
						state={subjectModalState}
						handleModalEdit={(setting, selected) =>
							handleModalEdit(setting, selected)
						}
						contextOptions={contextOptions}
					/>
				}
				type="generic"
			/>
		</header>
	);
}
