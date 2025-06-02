import { useRef, useState } from "react";
import type { TreeNodeSerializableType } from "../classes/TreeNode";
import gear from "../assets/gear.svg";
import filter from "../assets/filter.svg";
import Modal, { type ModalListItemState } from "./Modal";
import type { ToggleSetting } from "./Toggle";

type Props = {
	handleAdd: (
		inputText: string,
		autoDate?: boolean,
		notable?: boolean,
	) => void;
	itemType: TreeNodeSerializableType;
	modalListItemStateArray: ModalListItemState[];
	handleToggleSetting: (setting: ToggleSetting, status: boolean, index: number) => void
};

export default function AddItemCard({
	handleAdd,
	itemType,
	modalListItemStateArray,
	handleToggleSetting
}: Props) {
	const [inputText, setInputText] = useState("");
	const addItemCardModalRef = useRef<HTMLDialogElement>(null);
	const firstLetterCapitalized =
		itemType[0].toUpperCase() + itemType.slice(1);

	function handleAddWrapper() {
		let autoDate = true, notable = true;
		modalListItemStateArray.forEach((state) => {
			if (state.toggleSetting?.setting == "autoDate" && !state.toggleSetting?.enable ){
				autoDate = false
			}

			if (state.toggleSetting?.setting == "notable" && !state.toggleSetting.enable){
				notable = false
			}
		})
		handleAdd(inputText, autoDate, notable);
	}

	return (
		<header className="mb-8 flex w-72 flex-col gap-4 border-4 border-black bg-amber-200 p-4 text-black shadow-[8px_5px_0px_rgba(0,0,0,1)] md:w-lg">
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
						onClick={() => addItemCardModalRef.current?.showModal()}
					/>
				</button>
			</div>
			<div className="flex gap-4">
				<button
					className="bg-zomp w-full rounded-2xl border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]"
					onClick={() => handleAddWrapper()}
				>
					Add {firstLetterCapitalized}
				</button>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img src={filter} alt="" className="w-10" />
				</button>
			</div>
			<Modal
				modalListItemStateArray={modalListItemStateArray}
				modalRef={addItemCardModalRef}
				handleToggleSetting={handleToggleSetting}
			/>{" "}
		</header>
	);
}
