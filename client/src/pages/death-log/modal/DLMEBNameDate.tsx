import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import { parseUTCDate, formatUTCDate, maxDate } from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import { CONSTANTS } from "../../../../shared/constants";
import { assertIsNonNull } from "../../../utils";
import TooltipButton from "../../../components/TooltipButton";

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
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Name</legend>

				<input
					aria-label={CONSTANTS.DEATH_LOG_MODAL.EDIT_NAME}
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
				<div className={`text-error mt-2 ml-2 text-sm`}>
					{inputTextError}
				</div>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{modalState.completed
						? "Creation (1st) & Completion (2nd) Dates"
						: "Creation Date"}
				</legend>

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
									: parseUTCDate(e.currentTarget.value),
						})
					}
					max={
						modalState.completed && modalState.dateEnd
							? formatUTCDate(modalState.dateEnd)
							: formatUTCDate(new Date().toISOString())
					}
				/>

				{modalState.completed && modalState.dateEnd ? (
					<input
						type="date"
						className="input join-item"
						value={formatUTCDate(modalState.dateEnd)}
						onChange={(e) =>
							onEdit({
								...modalState,
								dateEnd: parseUTCDate(e.currentTarget.value),
							})
						}
						min={formatUTCDate(modalState.dateStart)}
						max={maxDate(modalState.dateEnd)}
					/>
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
					<span className="text-[1rem]">Creation Date</span>
					<input
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
						<span className="text-[1rem]">Completion Date</span>
						<input
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
			</fieldset>
		</>
	);
}
