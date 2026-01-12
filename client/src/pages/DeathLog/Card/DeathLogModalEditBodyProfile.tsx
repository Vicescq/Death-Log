import { useState } from "react";
import type { DistinctTreeNode, Profile } from "../../../model/TreeNodeModel";

type Props = {
	node: Profile;
	handleOnEditChange: (newModalState: Profile) => void;
};

export default function DeathLogModalEditBodyProfile({
	node,
	handleOnEditChange,
}: Props) {
	const [profileGroupText, setProfileGroupText] = useState("");
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
							handleOnEditChange({
								...node,
								groupings: [
									...node.groupings,
									{
										title: profileGroupText,
										description: "",
										members: [],
									},
								],
							});
							setProfileGroupText("")
						}}
					>
						+
					</button>
				</div>
				{node.groupings.length > 0 ? (
					<div className="divider m-1"></div>
				) : null}

				<ul className="flex max-h-24 flex-col gap-2 overflow-auto">
					{node.groupings.map((prfoileGroup, i) => {
						return (
							<li key={i}>
								<label className="label">
									<input
										type="checkbox"
										className="checkbox checkbox-sm checkbox-secondary"
									/>
									<span className="ml-2">
										{prfoileGroup.title}
									</span>
								</label>
							</li>
						);
					})}
				</ul>
			</fieldset>
		</>
	);
}
