import { useEffect, useState } from "react";
import type { DistinctTreeNode } from "../../model/TreeNodeModel";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { defaultCardModalDateFormat } from "./utils";

type Props = {
	modalState: DistinctTreeNode;
	handleDelete: () => void;
	handleModalSave: () => void;
	handleModalEdit: (inputText: string) => void;
};

export default function CardModalBody({
	modalState,
	handleDelete,
	handleModalSave,
	handleModalEdit,
}: Props) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span className="mr-auto">Title</span>
				<input
					value={modalState.name}
					type="text"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) => handleModalEdit(e.currentTarget.value)}
				/>
			</li>
			<li className="flex items-center gap-2">
				<span className="mr-auto">Date Created</span>
				<input
					value={defaultCardModalDateFormat(modalState.dateStart)}
					type="date"
					className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) => 1}
				/>
			</li>

			{modalState.completed ? (
				<li className="flex items-center gap-2">
					<span className="mr-auto">Date Completed</span>
					<input
					value={defaultCardModalDateFormat(modalState.dateEnd!)}
						type="date"
						className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
						onChange={(e) => 1}
					/>
				</li>
			) : null}

			{modalState.type == "subject" ? (
				<li className="flex items-center gap-2">
					<span className="mr-auto">Deaths</span>
					<input
						value={modalState.deaths}
						type="number"
						className="rounded-2xl border-4 p-1 shadow-[4px_4px_0px_rgba(0,0,0,1)]"
						onChange={(e) => 1}
					/>
				</li>
			) : null}

			<li className="flex items-center gap-2">
				<span className="mr-auto">Notes</span>
				<textarea
					rows={5}
					cols={20}
					className="rounded-2xl border-3 p-2 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
				>
					{modalState.notes}
				</textarea>
			</li>

			<button
				className="bg-hunyadi rounded-2xl border-4 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={handleModalSave}
			>
				SAVE
			</button>
			<button
				className="rounded-2xl border-4 bg-orange-700 p-2 font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)]"
				onClick={handleDelete}
			>
				DELETE
			</button>
		</ul>
	);
}
