import { useState } from "react";
import gear from "../../assets/gear.svg";
import filter from "../../assets/filter.svg";
import type { AddItemCardProps } from "./AddItemCardProps";

export default function AddItemCard({
	children,
	handleAdd,
	itemType,
	modalRef,
	modalListItemArray,
}: AddItemCardProps) {
	const [inputText, setInputText] = useState("");

	function handleAddWrapper() {
		let date: null | undefined = undefined,
			challenge: boolean | undefined = undefined,
			notable: boolean | undefined = undefined;
		modalListItemArray.forEach((li) => {
			if (
				li.type == "toggle" &&
				li.toggleSetting == "autoDate" &&
				!li.enable
			) {
				date = null;
			}

			if (
				li.type == "toggle" &&
				li.toggleSetting == "challenge" &&
				li.enable
			) {
				challenge = true;
			}

			if (
				li.type == "toggle" &&
				li.toggleSetting == "notable" &&
				!li.enable
			) {
				notable = false;
			}
		});

		switch (itemType) {
			case "game":
				handleAdd(inputText, date);
				break;
			case "profile":
				handleAdd(inputText, date, challenge);
				break;
			default:
				handleAdd(inputText, date, notable);
		}
	}

	return (
		<header className="mb-8 flex w-full flex-col gap-4 bg-amber-200 p-4 border-b-4 text-black md:w-xl md:border-4 md:border-black md:shadow-[8px_5px_0px_rgba(0,0,0,1)]">
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
