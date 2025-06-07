import { Link } from "react-router";
import type { ModalListItemToggleState } from "./ModalListItemStateTypes";
import Toggle from "../Toggle";

export type ToggleSetting =
	| "notable"
	| "boss"
	| "location"
	| "other"
	| "dateStartR"
	| "dateEndR"

type Props = {
	state: ModalListItemToggleState
};

export default function ModalListItemToggle({
	state
}: Props) {
	return (
		<li className="m-2 flex gap-4 p-1">
			<Link to="#">{state.settingLabel}</Link>
			<div className="ml-auto">
				<Toggle
					enable={state.enable}
					setting={state.toggleSetting}
				/>
			</div>
		</li>
	);
}
