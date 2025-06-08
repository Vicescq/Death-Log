import { useEffect, useRef, useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import Modal from "../modals/Modal";
import {
	createModalListItems,
	createModalState,
	createModalUtilityButtons,
} from "../modals/modalUtils";
import type { AddItemCardProps } from "./AddItemCardProps";
import addItemCardHandlers from "./addItemCardHandlers";
import AlertModal, { type Alert } from "../modals/AlertModal";

export default function AddItemCard({
	pageType,
	modalSchema,
	handleAdd,
	tree,
	parentID
}: AddItemCardProps) {
	const [modalState, setModalState] = useState(createModalState(modalSchema));
	const [inputText, setInputText] = useState("");
	const [alert, setAlert] = useState<Alert>({msg: "No alerts.", isAlert: false});
	const modalRef = useRef<HTMLDialogElement>(null);
	const alertModalRef = useRef<HTMLDialogElement>(null);

	const { handleAddWrapper, handleToggle } = addItemCardHandlers(
		modalState,
		handleAdd,
		pageType,
		inputText,
		setModalState,
		tree,
		parentID
	);

	useEffect(() => {
		if (alert.isAlert){
			alertModalRef.current?.showModal();
			console.log(alert)
		}
	}, [alert]);

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
					onClick={() => {
						try{
							handleAddWrapper();
						}
						catch(e: any){
							setAlert({msg: e.message, isAlert: true})
						}
					}}
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
				modalUtilityBtns={createModalUtilityButtons(
					modalSchema,
					modalRef,
				)}
			/>
			<AlertModal modalRef={alertModalRef} msg={alert.msg}/>
		</header>
	);
}
