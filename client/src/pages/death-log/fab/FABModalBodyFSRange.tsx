type Props = {
	label: string;
};

export default function FABModalBodyFSRange({ label }: Props) {
	return (
		<div className="my-1">
			<div className="text-info mb-3">{label}</div>
			<div className="flex gap-4">
				<label className="floating-label w-full" htmlFor="">
					<span>From</span>
					<input type="date" className="input" />
				</label>
				<label className="floating-label w-full" htmlFor="">
					<span>To</span>
					<input type="date" className="input" />
				</label>
			</div>
		</div>
	);
}
