import { useRef, useState } from "react";
import type { TreeNodeSerializableType } from "../classes/TreeNode";
import Toggle from "./Toggle";
import gear from "../assets/gear.svg";
import filter from "../assets/filter.svg";

type Props = {
	handleAdd: (
		inputText: string,
		autoDate?: boolean,
		notable?: boolean,
	) => void;
	itemType: TreeNodeSerializableType;
};

export default function AddItemCard({ handleAdd, itemType }: Props) {
	const [inputText, setInputText] = useState("");
	const addItemCardModalRef = useRef<HTMLDialogElement>(null);
	const firstLetterCapitalized =
		itemType[0].toUpperCase() + itemType.slice(1);

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
					onClick={() => handleAdd(inputText)}
				>
					Add {firstLetterCapitalized}
				</button>
				<button className="bg-zomp ml-auto border-4 text-2xl font-bold shadow-[4px_2px_0px_rgba(0,0,0,1)]">
					<img src={filter} alt="" className="w-10" />
				</button>
			</div>

			<dialog
				ref={addItemCardModalRef}
				className="bg-zomp m-auto border-4 border-black p-10 text-xl shadow-[8px_5px_0px_rgba(0,0,0,1)] backdrop:backdrop-brightness-40"
			>
				<div className="flex flex-col gap-8">
					<Toggle />
					<button
						className="border- rounded-2xl border-4 bg-amber-200 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] outline-0"
						onClick={() => addItemCardModalRef.current?.close()}
					>
						CLOSE
					</button>
				</div>
			</dialog>
		</header>
	);
}
