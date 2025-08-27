import type { SubjectContext } from "../model/TreeNodeModel";

export type SelectDropdownOption = {
	value: SelectDropdownSelected;
	text: string;
};

export type SelectDropdownSelected = SubjectContext; // can add more types later

type Props = {
	options: SelectDropdownOption[];
	handleSelect: (selected: SelectDropdownSelected) => void;
	selected: SelectDropdownSelected;
};

export default function SelectDropdown({ options, handleSelect, selected }: Props) {
	return (
		<select
			value={selected}
			onChange={(e) => {
				handleSelect(e.target.value as SelectDropdownSelected);
			}}
			className="w-44 border-b-2 outline-0"
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.text}
				</option>
			))}
		</select>
	);
}
