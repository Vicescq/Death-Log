import type { ChartSlot } from "../../../model/stats-query-model/chart-slot";
import GripIcon from "../../../components/icons/GripIcon";
import LockIcon from "../../../components/icons/LockIcon";
import EditIcon from "../../../components/icons/EditIcon";
import { useSortable } from "@dnd-kit/react/sortable";
import { Link } from "react-router";

type Props = {
	slot: ChartSlot;
	index: number;
	isDefault: boolean;
	isDirty: boolean;
	onDisplayChange: (newDisplayedVal: boolean) => void;
};

export default function ViewListChart({
	slot,
	index,
	isDefault,
	isDirty,
	onDisplayChange,
}: Props) {
	const { ref, handleRef } = useSortable({
		id: slot.id,
		index: index,
		disabled: isDefault,
	});
	return (
		<div ref={ref} className="flex items-center gap-2 px-4 py-6">
			{!isDefault ? (
				<span ref={handleRef}>
					<GripIcon />
				</span>
			) : (
				<span className="text-base-content/30">
					<LockIcon />
				</span>
			)}

			<span className="text-base-content/40 w-5 text-center text-xs tabular-nums">
				{index + 1}
			</span>
			<span className={`${isDirty ? "text-primary" : ""} flex-1 text-sm`}>
				{slot.spec.title}
			</span>

			<div className="flex gap-2">
				<span className="badge badge-accent badge-sm font-mono">
					{slot.spec.type}
				</span>

				<input
					type="checkbox"
					className="checkbox checkbox-sm checkbox-accent"
					checked={slot.displayed}
					onChange={(e) => onDisplayChange(e.currentTarget.checked)}
				/>
			</div>
			{!isDefault ? (
				<Link to="/stats/build" className="btn btn-ghost btn-xs ml-auto">
					<EditIcon className="text-white" />
				</Link>
			) : null}
		</div>
	);
}
