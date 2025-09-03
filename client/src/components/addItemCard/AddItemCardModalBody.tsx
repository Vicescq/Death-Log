
import SelectDropdown, { type SelectDropdownSelected, type SelectDropdownOption } from "../SelectDropDown";
import Toggle from "../Toggle";
import type { AICSubjectOverrides } from "./types";

type Props = {
	state: AICSubjectOverrides;
	handleEdit: (
		setting: keyof AICSubjectOverrides,
		selected?: SelectDropdownSelected,
	) => void;
	contextOptions: SelectDropdownOption[];
};

export default function AddItemCardModalBody({
	state,
	handleEdit,
	contextOptions,
}: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span className="mr-auto">Context</span>
				<SelectDropdown
					selected={state.context}
					options={contextOptions}
					handleSelect={(selected) => handleEdit("context", selected)}
				/>
			</li>
			<li className="flex items-center gap-2">
				<span className="mr-auto">Reoccurring</span>
				<Toggle
					enable={state.reoccurring}
					handleToggle={() => handleEdit("reoccurring")}
				/>
			</li>
		</ul>
	);
}
