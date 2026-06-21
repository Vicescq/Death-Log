import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import GripIcon from "../../../components/icons/GripIcon";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
	slot: ChartSlot;
	index: number;
	group: string;
	displayed: boolean;
	onDisplayChange: (displayed: boolean) => void;
};

export default function ViewListChart({
	slot,
	index,
	group,
	displayed,
	onDisplayChange,
}: Props) {
	const { ref, handleRef } = useSortable({ id: slot.id, index, group });

	return (
		<div ref={ref} className="flex items-center gap-2 px-4 py-6">
			<span ref={handleRef} className="cursor-grab">
				<GripIcon />
			</span>

			<span className="text-base-content/40 w-5 text-center text-xs tabular-nums">
				{index + 1}
			</span>
			<span className="flex-1 text-sm">{slot.spec.title}</span>

			<div className="flex items-center gap-2">
				<span className="badge badge-accent badge-sm font-mono">
					{slot.spec.type}
				</span>
				<input
					type="checkbox"
					className="checkbox checkbox-sm checkbox-accent"
					checked={displayed}
					onChange={(e) => onDisplayChange(e.currentTarget.checked)}
				/>
			</div>
		</div>
	);
}
