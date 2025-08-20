import { useEffect, useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../Modal";
import type {
	HandleAddGame,
	HandleAddProfile,
	HandleAddSubject,
} from "./AddItemCardTypes";
import type { AddItemCardModalStateSubject } from "./AddItemCardTypes";
import AddItemCardModalBody from "./AddItemCardModalBody";

type GameProps = {
	pageType: "game";
	handleAdd: HandleAddGame;
};

type ProfileProps = {
	pageType: "profile";
	handleAdd: HandleAddProfile;
};

type SubjectProps = {
	pageType: "subject";
	handleAdd: HandleAddSubject;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function AddItemCard({ pageType, handleAdd }: Props) {
	const [inputText, setInputText] = useState("");
	const modalRef = useRef<HTMLDialogElement>(null);

	// only for the subject case
	const [addItemCardSubjectModalState, setAddItemCardSubjectModalState] =
		useState<AddItemCardModalStateSubject>({
			reoccuring: false,
			composite: false,
		});

	let addItemCardModalBody: React.JSX.Element;
	let handleAddWrapper: () => void;
	if (pageType == "game" || pageType == "profile") {
		addItemCardModalBody = (
			<AddItemCardModalBody pageType="gameORprofile" />
		);
		handleAddWrapper = () => {
			handleAdd(inputText);
		};
	} else {
		addItemCardModalBody = (
			<AddItemCardModalBody
				pageType="subject"
				state={addItemCardSubjectModalState}
				handleModalToggle={(key) =>
					setAddItemCardSubjectModalState((prev) => ({
						...prev,
						[key]: !prev[key],
					}))
				}
			/>
		);
		handleAddWrapper = () => {
			handleAdd(inputText, addItemCardSubjectModalState);
		};
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
			<Modal modalRef={modalRef} modalBody={addItemCardModalBody} />
		</header>
	);
}
