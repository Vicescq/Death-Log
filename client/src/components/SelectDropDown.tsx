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
		<select name={selectName} id="">
			{options.map((optionData) => {
				return (
					<option value={optionData.value}>{optionData.text}</option>
				);
			})}
		</select>
	);
}
