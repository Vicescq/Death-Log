import type { SubjectContext } from "../model/TreeNodeModel";

export type SelectDropdownOption = {
	value: SelectDropdownSelected;
	text: string;
}

export type SelectDropdownSelected = SubjectContext;

type Props = {
	options: SelectDropdownOption[];
	handleSelect: (selected: SelectDropdownSelected) => void;
};

export default function SelectDropdown({ options, handleSelect }: Props) {
	return (
		<select
			value={options[0].value}
			onChange={(e) =>
				handleSelect(e.target.value as SelectDropdownSelected)
			}
			className="rounded-2xl border-3 p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
		>
			{options.map((option) => (
				<option value={option.value}>{option.text}</option>
			))}
		</select>
	);
}
