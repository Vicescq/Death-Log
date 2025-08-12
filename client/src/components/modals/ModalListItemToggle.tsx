import type { ModalListItemToggleState } from "./ModalListItemStateTypes";
import Toggle from "../Toggle";

export type ToggleSetting =
	| "dateStartR"
	| "dateEndR"
	| "composite"
	| "reoccurring";

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
					handleToggle={handleToggle}
				/>
			</div>
		</li>
	);
}
