import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import {
	convertDefaultCardModalDateFormatToISO,
	defaultCardModalDateFormat,
} from "../utils";
import { useDeathLogStore } from "../../../stores/useDeathLogStore";
import computeModalInputTextError from "../utils";
import { CONSTANTS } from "../../../../shared/constants";

type Props = {
	modalState: DistinctTreeNode;
	onEdit: (newModalState: DistinctTreeNode) => void;
};

export default function DLMEBNameDate({ modalState, onEdit }: Props) {
	const tree = useDeathLogStore((state) => state.tree);

	const inputTextError = computeModalInputTextError(modalState.name, {
		type: "nodeEdit",
		tree: tree,
		parentID: modalState.parentID,
	});

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
					maxLength={50}
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
					value={defaultCardModalDateFormat(modalState.dateStart)}
					onChange={(e) =>
						onEdit({
							...modalState,
							dateStart:
								e.currentTarget.value == ""
									? modalState.dateStart
									: convertDefaultCardModalDateFormatToISO(
											e.currentTarget.value,
										),
						})
					}
					max={
						modalState.completed && modalState.dateEnd
							? defaultCardModalDateFormat(modalState.dateEnd)
							: defaultCardModalDateFormat(
									new Date().toISOString(),
								)
					}
				/>

				{modalState.completed ? (
					<input
						type="date"
						className="input join-item"
						value={
							modalState.dateEnd
								? defaultCardModalDateFormat(modalState.dateEnd)
								: undefined
						}
						onChange={(e) =>
							onEdit({
								...modalState,
								dateEnd:
									e.currentTarget.value == ""
										? modalState.dateEnd
										: convertDefaultCardModalDateFormatToISO(
												e.currentTarget.value,
											),
							})
						}
						min={defaultCardModalDateFormat(modalState.dateStart)}
					/>
				) : null}
				<div className="divider my-2">↓ Reliability Flags ↓</div>
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
