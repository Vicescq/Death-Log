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
		let notable: boolean | undefined = undefined,
			dateStartR: boolean | undefined = undefined,
			dateEndR: boolean | undefined = undefined,
			boss: boolean | undefined = undefined,
			location: boolean | undefined = undefined,
			other: boolean | undefined = undefined;
		modalListItemArray.forEach((li) => {
			if (li.type == "toggle") {
				switch (li.toggleSetting) {
					case "notable":
						if (!li.enable) {
							notable = false;
						}
						break;
					case "dateStartR":
						if (!li.enable) {
							dateStartR = false;
						}
						break;
					case "dateEndR":
						if (!li.enable) {
							dateEndR = false;
						}
						break;
					case "boss":
						if (!li.enable) {
							boss = false;
						}
						break;
					case "location":
						if (li.enable) {
							location = true;
						}
						break;
					case "other":
						if (li.enable) {
							other = true;
						}
						break;
				}
			}
		});

		switch (itemType) {
			case "game":
				handleAdd(inputText, dateStartR, dateEndR);
				break;
			case "profile":
				handleAdd(inputText, dateStartR, dateEndR);
				break;
			default:
				handleAdd(inputText, notable, dateStartR, dateEndR, boss, location, other);
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
