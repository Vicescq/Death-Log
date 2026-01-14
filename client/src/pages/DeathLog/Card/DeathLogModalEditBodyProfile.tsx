import { useState } from "react";
import type { Profile } from "../../../model/TreeNodeModel";
import * as Utils from "../utils";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	node: Profile;
	handleOnEditChange: (newModalState: Profile) => void;
};

export default function DeathLogModalEditBodyProfile({
	node,
	handleOnEditChange,
}: Props) {
	const [profileGroupText, setProfileGroupText] = useState("");
	const [inputTextError, setInputTextError] = useState("");

	useConsoleLogOnStateChange(node, "MODAL STATE: ", node)
	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
				<legend className="fieldset-legend">Profile Groups</legend>

				<div className="join">
					<input
						className="input join-item"
						placeholder="New Profile Group"
						value={profileGroupText}
						onChange={(e) =>
							setProfileGroupText(e.currentTarget.value)
						}
					/>
					<button
						className="btn btn-accent join-item rounded-r-full"
						onClick={() => {
							try {
								const tempGroupings = [
									...node.groupings,
									{
										title: profileGroupText,
										description: "",
										members: [],
									},
								];
								Utils.validateProfileGroup(tempGroupings);
								handleOnEditChange({
									...node,
									groupings: tempGroupings,
								});
								setProfileGroupText("");
								setInputTextError("");
							} catch (e) {
								if (e instanceof Error) {
									setInputTextError(e.message);
								}
							}
						}}
					>
						+
					</button>
				</div>
				<span className="text-error text-sm">{inputTextError}</span>
				{node.groupings.length > 0 ? (
					<div className="divider m-0.5"></div>
				) : null}

				<ul className="flex max-h-36 flex-col gap-2 overflow-auto">
					{node.groupings.map((prfoileGroup, i) => {
						return (
							<li key={i} className="flex">
								<label className="label">
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-secondary"
									/>
									<span className="ml-2">
										{prfoileGroup.title}
									</span>
								</label>
								<button
									className="ml-auto cursor-pointer p-2"
									onClick={() => {
										handleOnEditChange({
											...node,
											groupings: [
												...node.groupings,
											].filter((_, index) => index != i),
										});
									}}
								>
									✕
								</button>
							</li>
						);
					})}
				</ul>
			</fieldset>
		</>
	);
}
