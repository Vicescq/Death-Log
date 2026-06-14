type Props = {
	visible: boolean;
	onHide: () => void;
};

export default function ChartHideButton({ visible, onHide }: Props) {
	if (!visible) return null;
	return (
		<li className="p-2">
			<button
				onClick={onHide}
				className="btn btn-sm btn-info text-[0.9rem]"
			>
				Hide
			</button>
		</li>
	);
}
