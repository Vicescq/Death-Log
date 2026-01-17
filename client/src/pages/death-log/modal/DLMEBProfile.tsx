import { useState } from "react";
import type { Profile, ProfileGroup } from "../../../model/TreeNodeModel";
import { formatString } from "../../../stores/utils";
import computeModalInputTextError from "../utils";
import edit from "../../../assets/edit.svg";
import useConsoleLogOnStateChange from "../../../hooks/useConsoleLogOnStateChange";

type Props = {
	modalState: Profile;
	onEdit: (newModalState: Profile) => void;
};

export default function DLMEBProfile({ modalState, onEdit }: Props) {
	const [profileGroupText, setProfileGroupText] = useState("");
	const inputTextError = computeModalInputTextError(profileGroupText, {
		type: "profileGroupAdd",
		profile: modalState,
	});

	const [currEditProfileGroupIndex, setCurrEditProfileGroupIndex] = useState<
		number | null
	>(null);
	useConsoleLogOnStateChange(
		currEditProfileGroupIndex,
		currEditProfileGroupIndex,
	);

	return (
		<>
			<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
				<legend className="fieldset-legend">Profile Groups</legend>

				<div className="join">
					<input
						className="input join-item"
						placeholder="New Profile Group"
						value={profileGroupText}
						onChange={(e) => {
							setProfileGroupText(e.currentTarget.value);
						}}
						onBlur={(e) =>
							setProfileGroupText(
								formatString(e.currentTarget.value),
							)
						}
						maxLength={50}
					/>
					<button
						className={`btn ${inputTextError == "" && formatString(profileGroupText) != "" ? "btn-success" : "btn-disabled"} join-item rounded-r-full`}
						onClick={() => {
							const tempGroupings = [
								...modalState.groupings,
								{
									title: formatString(profileGroupText),
									description: "",
									members: [],
								},
							];
							onEdit({
								...modalState,
								groupings: tempGroupings,
							});
							setProfileGroupText("");
						}}
					>
						+
					</button>
				</div>
				<span className="text-error text-sm">{inputTextError}</span>
				{modalState.groupings.length > 0 ? (
					<div className="divider m-0.5"></div>
				) : null}

				<ul className="flex max-h-36 flex-col gap-2 overflow-auto">
					{modalState.groupings.map((prfoileGroup, i) => {
						return (
							<li key={i} className={`flex rounded-2xl px-4`}>
								<label className="label">
									<button
										className="btn btn-xs btn-ghost p-0"
										onClick={() => {
											setCurrEditProfileGroupIndex(i);
										}}
									>
										<img
											src={edit}
											alt=""
											className="w-4"
										/>
									</button>
									<span className="ml-2">
										{prfoileGroup.title}
									</span>
								</label>
								<button
									className="ml-auto cursor-pointer p-2"
									onClick={() => {
										onEdit({
											...modalState,
											groupings: [
												...modalState.groupings,
											].filter((_, index) => index != i),
										});
										setCurrEditProfileGroupIndex(null);
									}}
								>
									✕
								</button>
							</li>
						);
					})}
				</ul>
			</fieldset>
			{currEditProfileGroupIndex != null ? (
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
					<legend className="fieldset-legend">
						Editing:
						{modalState.groupings[currEditProfileGroupIndex].title}
					</legend>
					<div>
						<span>Title: </span>
						{modalState.groupings[currEditProfileGroupIndex].title}
					</div>
					<div>
						<span>Description</span>
						<textarea
							className="textarea"
							placeholder="Type here"
							value={
								modalState.groupings[currEditProfileGroupIndex]
									.description
							}
							onChange={(e) =>
								onEdit({
									...modalState,
									groupings: modalState.groupings.map(
										(group, index) => {
											if (
												index ==
												currEditProfileGroupIndex
											) {
												return {
													...modalState.groupings[
														currEditProfileGroupIndex
													],
													description:
														e.currentTarget.value,
												};
											} else {
												return group;
											}
										},
									),
								})
							}
							maxLength={1000}
						>
							{
								modalState.groupings[currEditProfileGroupIndex]
									.description
							}
						</textarea>
					</div>
				</fieldset>
			) : null}
		</>
	);
}
