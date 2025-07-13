type Props = {
	selectName: string;
	options: OptionData[];
};

export type OptionData = {
	value: OptionDataValue;
	text: string;
};

export type OptionDataValue = "boss" | "location" | "other";

export default function SelectDropDown({ selectName, options }: Props) {
	return (
		<select name={selectName} id="" className="font-bold border-3 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
			{options.map((optionData) => {
				return (
					<option value={optionData.value}>{optionData.text}</option>
				);
			})}
		</select>
	);
}
