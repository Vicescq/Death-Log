import { useEffect, useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../Modal";
import type {
	HandleAddGame,
	HandleAddProfile,
	HandleAddSubject,
} from "./AddItemCardTypes";
import type {
    AddItemCardModalStateGame,
    AddItemCardModalStateProfile,
    AddItemCardModalStateSubject
} from "../Modal";
import AddItemCardModalBody from "./AddItemCardModalBody";

type GameProps = {
	pageType: "Game";
	handleAdd: HandleAddGame;
};

type ProfileProps = {
	pageType: "Profile";
	handleAdd: HandleAddProfile;
};

type SubjectProps = {
	pageType: "Subject";
	handleAdd: HandleAddSubject;
};

type Props = GameProps | ProfileProps | SubjectProps;

export default function AddItemCard({ pageType, handleAdd }: Props) {
	const [inputText, setInputText] = useState("");

	const [addItemCardGameModalState, setAddItemCardGameModalState] =
		useState<AddItemCardModalStateGame>({
			dateStartR: true,
			dateEndR: true,
		});

	const [addItemCardProfileModalState, setAddItemCardProfileModalState] =
		useState<AddItemCardModalStateProfile>({
			dateStartR: true,
			dateEndR: true,
		});

	const [addItemCardSubjectModalState, setAddItemCardSubjectModalState] =
		useState<AddItemCardModalStateSubject>({
			dateStartR: true,
			dateEndR: true,
			reoccuring: false,
			composite: false,
		});

	const modalRef = useRef<HTMLDialogElement>(null);

	function handleAddWrapper() {
		switch (pageType) {
			case "Game":
				handleAdd(inputText, addItemCardGameModalState);
				break;
			case "Profile":
				handleAdd(inputText, addItemCardProfileModalState);
				break;
			case "Subject":
				handleAdd(inputText, addItemCardSubjectModalState);
				break;
		}
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
					onClick={() => handleAddWrapper()}
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
					pageType == "Game" ? (
						<AddItemCardModalBody
							pageType={pageType}
							state={addItemCardGameModalState}
							handleModalToggle={(key) =>
								setAddItemCardGameModalState((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					) : pageType == "Profile" ? (
						<AddItemCardModalBody
							pageType={pageType}
							state={addItemCardProfileModalState}
							handleModalToggle={(key) =>
								setAddItemCardProfileModalState((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					) : (
						<AddItemCardModalBody
							pageType={pageType}
							state={addItemCardSubjectModalState}
							handleModalToggle={(key) =>
								setAddItemCardSubjectModalState((prev) => ({
									...prev,
									[key]: !prev[key],
								}))
							}
						/>
					)
				}
			/>
		</header>
	);
}
