import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { toUTCDate, formatUTCDate, maxDate } from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { CONSTANTS } from "../../../../shared/constants";
import { assertIsNonNull } from "../../../utils";

type Props = {
	node: DistinctTreeNode;
};

export default function DLMEBNameDate({ node }: Props) {
	// const tree = useDeathLogStore((state) => state.tree);
	// const originalNodeName = tree.get(modalState.id)?.name;
	// assertIsNonNull(originalNodeName); // should be fine, useInitApp should be fulyl working

	return (
		<>
			<legend className="fieldset-legend">Title & Timestamps</legend>

			<label className="floating-label">
				<span>Name</span>
				<input type="search" className="input" />
			</label>
			{/* <div className={`text-error mt-2 ml-2 text-sm`}>
				{inputTextError}
			</div> */}

			<label className="floating-label mt-4">
				<span>Date Created</span>
				<input type="date" className="input join-item" />
			</label>

			{node.completed && node.dateEnd ? (
				<label className="floating-label mt-2">
					<span>Date Completed</span>
					<input type="date" className="input join-item" />
				</label>
			) : null}

			<div className="divider my-2">
				<div
					className="tooltip tooltip-info"
					data-tip={CONSTANTS.RELIABILITY}
				>
					↓ Reliability Flags ↓
				</div>
			</div>
			<div className="flex">
				<label
					htmlFor="creation-date-reliable-toggle"
					className="text-[1rem]"
				>
					Creation Date
				</label>
				<input
					id="creation-date-reliable-toggle"
					type="checkbox"
					className="toggle toggle-primary ml-auto"
				/>
			</div>
			{node.completed ? (
				<div className="flex">
					<label
						htmlFor="completion-date-reliable-toggle"
						className="text-[1rem]"
					>
						Completion Date
					</label>
					<input
						id="completion-date-reliable-toggle"
						type="checkbox"
						className="toggle toggle-primary ml-auto"
					/>
				</div>
			) : null}
		</>
	);
}
