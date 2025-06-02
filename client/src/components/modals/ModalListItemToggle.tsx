import { Link } from "react-router";
import Toggle from "../Toggle";
import type { ModalListItemToggleType } from "./ModalListItemTypes";

type Props = {
	modalListItem: ModalListItemToggleType;
	handleToggleSetting: (
		status: boolean,
		index: number,
	) => void;
	index: number;
};

export default function ModalListItemToggle({
	modalListItem,
	handleToggleSetting,
	index,
}: Props) {
	return (
		<li className="m-2 flex gap-4">
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
