import { useEffect, useState } from "react";
import type {
	DistinctTreeNode,
	Game,
	Profile,
	Subject,
} from "../../model/TreeNodeModel";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import {
	convertDefaultCardModalDateFormatToISO,
	defaultCardModalDateFormat,
	isCardModalDateAtLimit,
} from "./utils";
import SelectDropdown, {
	type SelectDropdownOption,
	type SelectDropdownSelected,
} from "../SelectDropDown";
import Toggle from "../Toggle";
import { contextOptions } from "../../utils";

type Props<T extends DistinctTreeNode> = {
	modalState: T;
	setModalState: React.Dispatch<React.SetStateAction<T>>;
};

export default function CardModalBody<T extends DistinctTreeNode>({
	modalState,
	setModalState,
}: Props<T>) {
	return (
		<ul className="flex flex-col gap-2">
			<li className="flex items-center gap-2">
				<span className="mr-auto">Title</span>
				<input
					value={modalState.name}
					type="text"
					className="w-44 border-b-2 outline-0"
					onChange={(e) =>
						setModalState((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					onBlur={(e) =>
						setModalState((prev) => ({
							...prev,
							name: e.target.value.trim(),
						}))
					}
				/>
			</li>
			<li className="flex items-center gap-2">
				<span className="mr-auto">Created</span>
				<input
					value={defaultCardModalDateFormat(modalState.dateStart)}
					type="date"
					className="w-44 border-b-2 outline-0"
					readOnly
				/>
			</li>

			{modalState.completed ? (
				<li className="flex items-center gap-2">
					<span className="mr-auto">Finished</span>
					<input
						value={defaultCardModalDateFormat(modalState.dateEnd!)}
						type="date"
						className="w-44 border-b-2 outline-0"
						readOnly
					/>
				</li>
			) : null}

			{modalState.type == "subject" ? (
				<>
					<li className="flex items-center gap-2">
						<span className="mr-auto">Context</span>
						<SelectDropdown
							selected={modalState.context}
							options={contextOptions}
							handleSelect={(selected) =>
								(
									setModalState as React.Dispatch<
										React.SetStateAction<Subject>
									>
								)((prev) => ({
									...prev,
									context: selected,
								}))
							}
						/>
					</li>
					{!modalState.completed ? (
						<li className="flex items-center gap-2">
							<span className="mr-auto">Reoccurring</span>
							<Toggle
								enable={modalState.reoccurring}
								handleToggle={() =>
									(
										setModalState as React.Dispatch<
											React.SetStateAction<Subject>
										>
									)((prev) => ({
										...prev,
										reoccurring: !prev.reoccurring,
									}))
								}
							/>
						</li>
					) : null}
				</>
			) : null}

			<li className="mt-5 flex items-center gap-2">
				<span className="mr-auto">Notes</span>
				<textarea
					value={modalState.notes}
					maxLength={1000}
					rows={5}
					cols={20}
					className="rounded-2xl border-3 p-2 shadow-[6px_4px_0px_rgba(0,0,0,1)]"
					onChange={(e) => {
						setModalState((prev) => ({
							...prev,
							notes: e.target.value,
						}));
					}}
					onBlur={(e) => {
						setModalState((prev) => ({
							...prev,
							notes: e.target.value.trim(),
						}));
					}}
				/>
			</li>
		</ul>
	);
}
