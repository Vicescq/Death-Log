import type { SubjectContext } from "../model/TreeNodeModel";

type Props = {
	selectName: string;
	options: OptionData[];
};

export type OptionData = {
	value: SubjectContext;
	text: string;
};

export default function SelectDropdown({ options }: Props) {
	return (
		<select
			className="rounded-2xl border-3 p-1 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
		>
			{options.map((option) => (
				<option value={option.value}>{option.text}</option>
			))}
		</select>
	);
}
