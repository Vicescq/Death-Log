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
	| "composite"
	| "reoccurring";

export const ToggleSettingSubjectContexts = [
	"boss",
	"location",
	"other",
] as const;

type Props = {
	state: ModalListItemToggleState;
	index: number;
	handleToggle: () => void;
};

export default function ModalListItemToggle({ state, handleToggle }: Props) {
	return (
		<li className="m-2 flex items-center gap-4">
			<span className="mr-auto">{state.settingLabel}</span>
			<div className="ml-auto">
				<Toggle
					enable={state.enable}
					setting={state.toggleSetting}
					handleToggle={handleToggle}
				/>
			</div>
		</li>
	);
}
