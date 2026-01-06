import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { assertIsNonNull } from "../../../utils";
import { convertDefaultCardModalDateFormatToISO } from "../utils";
import { defaultCardModalDateFormat } from "../utils";

type Props = {
	node: DistinctTreeNode;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
	inputTextError: string;
	inputTextErrorIsDisplayed: boolean;
};

export default function DeathLogModalEditBodyPage1({
	node,
	inputTextError,
	inputTextErrorIsDisplayed,
	handleOnEditChange,
}: Props) {
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Name</legend>

				<input
					type="search"
					className="input"
					value={node.name}
					onChange={(e) =>
						handleOnEditChange({
							...node,
							name: e.currentTarget.value,
						})
					}
					onBlur={(e) =>
						handleOnEditChange({
							...node,
							name: e.currentTarget.value.replace(/\s+/g, ' ').trim(),
						})
					}
				/>
				<div
					className={`text-error mt-2 ml-2 ${inputTextErrorIsDisplayed ? "" : "hidden"} text-sm`}
				>
					{inputTextError}
				</div>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{node.completed
						? "Creation (1st) & Completion (2nd) Dates"
						: "Creation Date"}
				</legend>

				<input
					type="date"
					className="input join-item"
					value={defaultCardModalDateFormat(node.dateStart)}
					onChange={(e) =>
						handleOnEditChange({
							...node,
							dateStart:
								e.currentTarget.value == ""
									? node.dateStart
									: convertDefaultCardModalDateFormatToISO(
											e.currentTarget.value,
										),
						})
					}
					max={defaultCardModalDateFormat(new Date().toISOString())}
				/>

				{node.completed ? (
					<input
						type="date"
						className="input join-item"
						value={(() => {
							const dateEnd = node.dateEnd;
							assertIsNonNull(dateEnd);
							return defaultCardModalDateFormat(dateEnd);
						})()}
						onChange={(e) =>
							handleOnEditChange({
								...node,
								dateEnd:
									e.currentTarget.value == ""
										? node.dateEnd
										: convertDefaultCardModalDateFormatToISO(
												e.currentTarget.value,
											),
							})
						}
						min={defaultCardModalDateFormat(node.dateStart)}
					/>
				) : null}
				<div className="divider my-2">↓ Reliability Flags ↓</div>
				<div className="flex">
					<span className="text-[1rem]">Creation Date</span>
					<input
						type="checkbox"
						checked={node.dateStartRel}
						className="toggle toggle-primary ml-auto"
						onChange={(e) =>
							handleOnEditChange({
								...node,
								dateStartRel: e.currentTarget.checked,
							})
						}
					/>
				</div>
				{node.completed ? (
					<div className="flex">
						<span className="text-[1rem]">Completion Date</span>
						<input
							type="checkbox"
							checked={node.dateEndRel}
							className="toggle toggle-primary ml-auto"
							onChange={(e) =>
								handleOnEditChange({
									...node,
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
