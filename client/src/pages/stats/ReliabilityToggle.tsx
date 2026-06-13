export type ReliabilityFlag = {
	label: string;
	value: boolean;
	onToggle: () => void;
};

type Props = {
	flags: ReliabilityFlag[];
};

export default function ReliabilityToggle({ flags }: Props) {
	return (
		<div className="flex items-center gap-3">
			{flags.map((flag) => (
				<label
					key={flag.label}
					className="flex cursor-pointer items-center gap-1.5 text-sm"
				>
					<input
						type="checkbox"
						checked={flag.value}
						onChange={flag.onToggle}
						className="checkbox checkbox-xs checkbox-info"
					/>
					{flag.label}
				</label>
			))}
		</div>
	);
}
