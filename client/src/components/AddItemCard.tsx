import {  useState } from "react";
import type { TreeNodeSerializableType } from "../model/TreeNode";
import gear from "../assets/gear.svg";
import filter from "../assets/filter.svg";

type Props = {
	children: React.JSX.Element
	handleAdd: (
		inputText: string,
		autoDate?: boolean,
		notable?: boolean,
	) => void;
	itemType: TreeNodeSerializableType;
	modalRef: React.RefObject<HTMLDialogElement | null>
};

export default function AddItemCard({
	children,
	handleAdd,
	itemType,
	modalRef,
}: Props) {
	const [inputText, setInputText] = useState("");

	function handleAddWrapper() {
		let autoDate = true, notable = true;
		// modalListItemArray.forEach((li) => {
		// 	if (li.type == "toggle" && li.toggleSetting == "autoDate" && !li.enable){
		// 		autoDate = false
		// 	}
		// })
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
						onClick={() => modalRef.current?.showModal()}
					/>
				</button>
			</div>
			<div className="flex gap-4">
				<button
					className="bg-zomp w-full rounded-2xl border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]"
					onClick={() => handleAddWrapper()}
				>
					Add {itemType[0].toUpperCase() + itemType.slice(1)}
				</button>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img src={filter} alt="" className="w-10" />
				</button>
			</div>
			{children}
		</header>
	);
}
