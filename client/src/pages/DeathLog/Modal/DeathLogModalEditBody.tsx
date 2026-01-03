import type { DistinctTreeNode } from "../../../model/TreeNodeModel";
import { assertIsNonNull } from "../../../utils";
import { defaultCardModalDateFormat } from "../../../components/card/utils";
import editSingle from "../../../assets/edit_single.svg";
import trash from "../../../assets/trash.svg";

export default function DeathLogModalEditBody({
	currModalNode,
}: {
	currModalNode: DistinctTreeNode;
}) {
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Name</legend>
				<div className="join">
					<input
						type="search"
						className="input join-item"
						placeholder={currModalNode.name}
					/>
					<button className="btn join-item btn-neutral p-3">
						<img className="w-4" src={editSingle} alt="" />
					</button>
				</div>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">
					{currModalNode.completed
						? "Creation & End Dates"
						: "Creation Date"}
				</legend>
				<div className="join">
					<input
						type="date"
						className="input join-item"
						value={defaultCardModalDateFormat(
							currModalNode.dateStart,
						)}
						onChange={(e) => e.currentTarget.value}
					/>
					<button className="btn join-item btn-neutral p-3">
						<img className="w-4" src={editSingle} alt="" />
					</button>
				</div>

				{currModalNode.completed ? (
					<div className="join">
						<input
							type="date"
							className="input join-item"
							value={(() => {
								const dateEnd = currModalNode.dateEnd;
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
				{currModalNode.completed ? (
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
			{/* <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Notes</legend>
				<textarea
					className="textarea"
					placeholder="Type here"
					value={currModalNode.notes}
					onChange={(e) => e.currentTarget.value}
				></textarea>
			</fieldset>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Delete</legend>
				<div className="join">
					<input
						type="text"
						className="input join-item"
						placeholder="Type `DEL` to delete"
					/>
					<button className="btn join-item btn-error p-3">
						<img className="w-4" src={trash} alt="" />
					</button>
				</div>
			</fieldset> */}
			<div className="join flex mt-8">
				<button className="join-item  btn">«</button>
				<button className="join-item btn flex-1">Page 1</button>
				<button className="join-item btn">»</button>
			</div>
		</>
	);
}
