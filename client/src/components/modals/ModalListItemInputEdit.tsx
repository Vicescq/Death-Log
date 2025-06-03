import { Link } from "react-router";
import type { ModalListItemInputEditType } from "./ModalListItemTypes";

type Props = {
	modalListItem: ModalListItemInputEditType;
	index: number;
};

export default function ModalListItemInputEdit({
	modalListItem,
	index,
}: Props) {
	return (
		<li className="m-2 flex gap-4">
			<Link to="#">{modalListItem.settingLabel}</Link>
			<div className="ml-auto">
                dasdfdsgfregre
			</div>
		</li>
	);
}
