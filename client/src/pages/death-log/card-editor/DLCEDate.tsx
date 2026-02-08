import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	node: DistinctTreeNode;
};

export default function DLCEDate({ node }: Props) {
	return (
		<>
			<label className="floating-label">
				<span>Date Created</span>
				<input type="date" className="input join-item w-full" />
			</label>

			{node.completed && node.dateEnd ? (
				<label className="floating-label">
					<span>Date Completed</span>
					<input type="date" className="input join-item w-full" />
				</label>
			) : null}

			<div className="divider my-0">
				<div
					className="tooltip tooltip-info"
					data-tip={CONSTANTS.RELIABILITY}
				>
					↓ Reliability Flags ↓
				</div>
			</div>

			<div className="mb-8 flex flex-col gap-2">
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
			</div>
		</>
	);
}
