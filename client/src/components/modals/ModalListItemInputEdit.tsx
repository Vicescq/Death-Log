import type { ModalListItemInputEditState } from "./ModalListItemStateTypes";

export type InputEditTargetField =
	| "name"
	| "dateStart"
	| "dateEnd"
	| "notes"
	| "fullTries"
	| "resets";

type Props = {
	state: ModalListItemInputEditState;
	placeholder: string,
	handleInputEditChange: (inputText: string) => void;
};

export default function ModalListItemInputEdit({ state, placeholder, handleInputEditChange }: Props) {
	return (
		<li className="m-2 flex gap-4">
			<span className="m-auto">{state.settingLabel}</span>
			<input
				type="search"
				className="ml-auto w-42 rounded-xl border-2 p-1 shadow-[8px_5px_0px_rgba(0,0,0,1)] sm:w-lg"
				onChange={(e) => handleInputEditChange(e.target.value)}
				placeholder={`${placeholder}`}
			/>
		</li>
	);
}
