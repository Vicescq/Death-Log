import { useState } from "react";
import { Link } from "react-router";
import Toggle, { type ToggleSetting } from "../Toggle";
import type {
	ModalListItemInputEdit,
	ModalListItemToggle,
} from "./ModalListItemTypes";

type Props = {
	modalListItem: ModalListItemToggle | ModalListItemInputEdit;
	handleToggleSetting?: (
		setting: ToggleSetting,
		status: boolean,
		index: number,
	) => void;
	index: number;
};

export default function ModalListItem({
	modalListItem,
	handleToggleSetting,
	index,
}: Props) {
	const [inputText, setInputText] = useState("");
	let content: React.JSX.Element | null = null;
	if (modalListItem.type == "toggle") {
		content = (
			<>
				<Link to="#">
					{modalListItem.settingLabel}
				</Link>
				<div className="ml-auto">
					<Toggle
						enable={modalListItem.enable}
						setting={modalListItem.toggleSetting}
						handleToggleSetting={handleToggleSetting!}
						index={index}
					/>
				</div>
			</>
		);
	}

	else if (modalListItem.type == "inputEdit") {
		content = (
			<input
				type="search"
				className="w-full rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)]"
				onChange={(e) => setInputText(e.target.value)}
			/>
		);
	}

	return <li className="m-2 flex gap-4">{content}</li>;
}
