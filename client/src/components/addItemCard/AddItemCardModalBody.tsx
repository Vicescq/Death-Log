import Toggle from "../Toggle";
import type { AddItemCardPageType } from "./AddItemCardTypes";

export type AddItemCardModalBodyState = {
	"Reliable Date (Start)": boolean,
	"Reliable Date (End)": boolean,
}

type Props = {
	settingState: AddItemCardModalBodyState,
	handleModalToggle: (addItemCardModalBodyStateKey: keyof AddItemCardModalBodyState) => void,
	pageType: AddItemCardPageType
};

export default function AddItemCardModalBody({settingState, handleModalToggle, pageType}: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex gap-2">
				<span className="mr-auto">Reliable Date (Start)</span>
				<Toggle 
					enable={settingState["Reliable Date (Start)"]}
					handleToggle={() => handleModalToggle("Reliable Date (Start)")}
				/>
			</li>
            <li className="flex gap-2">
				<span className="mr-auto">Reliable Date (End)</span>
				<Toggle
					enable={settingState["Reliable Date (End)"]}
					handleToggle={() => handleModalToggle("Reliable Date (End)")}
				/>
			</li>
		</ul>
	);
}
 