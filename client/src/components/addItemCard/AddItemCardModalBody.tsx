import Toggle from "../Toggle";
import SelectDropdown from "../SelectDropDown";
import type { AICSubjectOverrides } from "./types";

type Props = {
	state: AICSubjectOverrides
	handleToggle: (setting: keyof AICSubjectOverrides) => void;
};

export default function AddItemCardModalBody({state, handleToggle}: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span className="mr-auto">Reoccurring</span>
				<Toggle
					enable={state.reoccurring}
					handleToggle={() => handleToggle("reoccurring")}
				/>
			</li>
			<li className="flex items-center gap-2">
				<span className="mr-auto">Composite</span>
				<Toggle
					enable={state.composite}
					handleToggle={() => handleToggle("composite")}
				/>
			</li>
		</ul>
	);
}
