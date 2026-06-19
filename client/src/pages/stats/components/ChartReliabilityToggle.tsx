type Props = {
	value: boolean;
	onChange: (value: boolean) => void;
};

export default function ChartReliabilityToggle({ value, onChange }: Props) {
	return (
		<li className="flex items-center gap-3">
			<label className="flex cursor-pointer items-center gap-1.5 text-sm">
				<input
					type="checkbox"
					checked={value}
					onChange={(e) => onChange(e.target.checked)}
					className="checkbox checkbox-xs checkbox-info"
				/>
				Unreliable timestamps
			</label>
		</li>
	);
}
