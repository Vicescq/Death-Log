import { Link } from "react-router";
import Toggle, { type ToggleSetting } from "../Toggle";
import type { ModalListItemToggleType } from "./ModalListItemTypes";

type Props = {
	modalListItem: ModalListItemToggleType;
	handleToggleSetting: (
		status: boolean,
		index: number,
		setting?: ToggleSetting
	) => void;
	index: number;
};

export default function ModalListItemToggle({
	modalListItem,
	handleToggleSetting,
	index,
}: Props) {
	return (
		<li className="m-2 flex gap-4 p-1">
			<Link to="#">{modalListItem.settingLabel}</Link>
			<div className="ml-auto">
				<Toggle
					enable={modalListItem.enable}
					setting={modalListItem.toggleSetting}
					handleToggleSetting={handleToggleSetting!}
					index={index}
				/>
			</div>
		</li>
	);
}
