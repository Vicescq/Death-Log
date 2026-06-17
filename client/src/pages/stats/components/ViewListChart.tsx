import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import GripIcon from "../../../components/icons/GripIcon";
import { useSortable } from "@dnd-kit/react/sortable";

type Props = {
	slot: ChartSlot;
	index: number;
};

export default function ViewListChart({ slot, index }: Props) {
	const { ref, handleRef } = useSortable({ id: slot.id, index: index });
	return (
		<div ref={ref} className="flex items-center gap-3 px-4 py-6">
			<span ref={handleRef}><GripIcon /></span>
			<span className="text-base-content/40 w-5 text-center text-xs tabular-nums">
				{index + 1}
			</span>
			<span className="flex-1 text-sm">{slot.preset.title}</span>
			<span className="badge badge-accent badge-sm font-mono">
				{slot.preset.case}
			</span>
			<input
				type="checkbox"
				className="checkbox checkbox-sm checkbox-accent"
				defaultChecked
			/>
		</div>
	);
}
