import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { assertIsNonNull } from "../../../utils";
import { defaultCardModalDateFormat } from "../../../components/card/utils";
import editSingle from "../../../assets/edit_single.svg";

export default function DeathLogModalEditBodyP1({
	node,
}: {
	node: DistinctTreeNode;
}) {
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Name</legend>
				<div className="join">
					<input
						type="search"
						className="input join-item"
						placeholder={node.name}
					/>
					<button className="btn join-item btn-neutral p-3">
						<img className="w-4" src={editSingle} alt="" />
					</button>
				</div>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{node.completed
						? "Creation & End Dates"
						: "Creation Date"}
				</legend>
				<div className="join">
					<input
						type="date"
						className="input join-item"
						value={defaultCardModalDateFormat(
							node.dateStart,
						)}
						onChange={(e) => e.currentTarget.value}
					/>
					<button className="btn join-item btn-neutral p-3">
						<img className="w-4" src={editSingle} alt="" />
					</button>
				</div>

				{node.completed ? (
					<div className="join">
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
						<button className="btn join-item btn-neutral p-3">
							<img className="w-4" src={editSingle} alt="" />
						</button>
					</div>
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
