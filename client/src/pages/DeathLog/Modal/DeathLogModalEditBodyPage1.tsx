import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { assertIsNonNull } from "../../../utils";
import { defaultCardModalDateFormat } from "../../../components/card/utils";
import editSingle from "../../../assets/edit_single.svg";
import type { DeathLogModalTarget } from "../Card/DeathLogCard";

type Props = {
	node: DistinctTreeNode;
	handleOnEditChange: (newModalState: DistinctTreeNode) => void;
};

export default function DeathLogModalEditBodyPage1({
	node,
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
				/>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{node.completed ? "Creation & End Dates" : "Creation Date"}
				</legend>

				<input
					type="date"
					className="input join-item"
					value={defaultCardModalDateFormat(node.dateStart)}
					onChange={(e) =>
						handleOnEditChange({
							...node,
							dateStart: e.currentTarget.value,
						})
					}
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
						onChange={(e) => e.currentTarget.value}
					/>
				) : null}
				<div className="divider my-2">↓ Reliability ↓</div>
				<div className="flex">
					<span className="text-[1rem]">Created Date</span>
					<input
						type="checkbox"
						defaultChecked
						className="toggle toggle-primary ml-auto"
					/>
				</div>
				{node.completed ? (
					<div className="flex">
						<span className="text-[1rem]">Completed Date</span>
						<input
							type="checkbox"
							defaultChecked
							className="toggle toggle-primary ml-auto"
						/>
					</div>
				) : null}
			</fieldset>
		</>
	);
}
