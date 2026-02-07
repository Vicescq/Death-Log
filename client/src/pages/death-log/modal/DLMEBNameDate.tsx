import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { toUTCDate, formatUTCDate, maxDate } from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { CONSTANTS } from "../../../../shared/constants";
import { assertIsNonNull } from "../../../utils";

type Props = {
	modalState: DistinctTreeNode;
	onEdit: (newModalState: DistinctTreeNode) => void;
	inputTextError: string;
};

export default function DLMEBNameDate({
	modalState,
	onEdit,
	inputTextError,
}: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const originalNodeName = tree.get(modalState.id)?.name;
	assertIsNonNull(originalNodeName); // should be fine, useInitApp should be fulyl working

	return (
		<>
			<legend className="fieldset-legend">Title & Timestamps</legend>

			<label className="floating-label">
				<span>Name</span>
				<input
					type="search"
					className="input"
					value={modalState.name}
					onChange={(e) => {
						onEdit({
							...modalState,
							name: e.currentTarget.value,
						});
					}}
					onBlur={(e) =>
						onEdit({
							...modalState,
							name: formatString(e.currentTarget.value),
						})
					}
					maxLength={CONSTANTS.INPUT_MAX}
				/>
			</label>
			<div className={`text-error mt-2 ml-2 text-sm`}>
				{inputTextError}
			</div>

			<label className="floating-label">
				<span>Date Created</span>
				<input
					type="date"
					className="input join-item"
					value={formatUTCDate(modalState.dateStart)}
					onChange={(e) =>
						onEdit({
							...modalState,
							dateStart:
								e.currentTarget.value == ""
									? modalState.dateStart
									: toUTCDate(
											e.currentTarget.value,
											"00:00:00",
										),
						})
					}
					max={
						modalState.completed && modalState.dateEnd
							? formatUTCDate(modalState.dateEnd)
							: formatUTCDate(new Date().toISOString())
					}
				/>
			</label>

			{modalState.completed && modalState.dateEnd ? (
				<label className="floating-label mt-2">
					<span>Date Completed</span>
					<input
						type="date"
						className="input join-item"
						value={formatUTCDate(modalState.dateEnd)}
						onChange={(e) =>
							onEdit({
								...modalState,
								dateEnd: toUTCDate(
									e.currentTarget.value,
									"00:00:00",
								),
							})
						}
						min={formatUTCDate(modalState.dateStart)}
						max={maxDate(modalState.dateEnd)}
					/>
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
					checked={modalState.dateStartRel}
					className="toggle toggle-primary ml-auto"
					onChange={(e) =>
						onEdit({
							...modalState,
							dateStartRel: e.currentTarget.checked,
						})
					}
				/>
			</div>
			{modalState.completed ? (
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
						checked={modalState.dateEndRel}
						className="toggle toggle-primary ml-auto"
						onChange={(e) =>
							onEdit({
								...modalState,
								dateEndRel: e.currentTarget.checked,
							})
						}
					/>
				</div>
			) : null}
		</>
	);
}
