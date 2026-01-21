import NavBar from "../../components/navBar/NavBar";
import type { Profile, ProfileGroup } from "../../model/TreeNodeModel";
import edit from "../../assets/edit.svg";
import { useState } from "react";
import useConsoleLogOnStateChange from "../../hooks/useConsoleLogOnStateChange";
import { formatString } from "../../stores/utils";
import { getFormStatus, type GetFormStatusReturn } from "./utils";
import { useDeathLogStore } from "../../stores/useDeathLogStore";
import { Link, useLocation, useNavigate } from "react-router";
import { CONSTANTS } from "../../../shared/constants";
import { assertIsNonNull, assertIsSubject } from "../../utils";

type Props = {
	profile: Profile;
};

type CurrentlyEditingProfileGroup = {
	profileGroup: ProfileGroup;
	index: number;
};

export default function DeathLogProfileGroup({ profile }: Props) {
	const tree = useDeathLogStore((state) => state.tree);
	const subjects = profile.childIDS.map((id) => {
		const subject = tree.get(id);
		assertIsNonNull(subject);
		assertIsSubject(subject);
		return subject;
	});
	const updateNode = useDeathLogStore((state) => state.updateNode);
	const [newProfileGroup, setNewProfileGroup] = useState<ProfileGroup>({
		title: "",
		description: "",
		members: [],
	});
	const [currentlyEditingProfileGroup, setCurrentlyEditingProfileGroup] =
		useState<CurrentlyEditingProfileGroup | null>(null);

	const { inputTextError, submitBtnCSS } = getFormStatus(
		newProfileGroup.title,
		{
			type: "profileGroupAdd",
			profile: profile,
		},
	);

	let inputTextErrorCurrentGroup = "";
	let submitBtnCSSCurrentGroup: GetFormStatusReturn["submitBtnCSS"] =
		"btn-disabled";
	if (currentlyEditingProfileGroup) {
		const currentlyEditingFormStatus = getFormStatus(
			currentlyEditingProfileGroup.profileGroup.title,
			{
				type: "profileGroupEdit",
				profile: profile,
				editableForm: {
					type: "profileGroup",
					profileGroup: currentlyEditingProfileGroup.profileGroup,
					originalProfileGroup:
						profile.groupings[currentlyEditingProfileGroup.index],
				},
			},
		);
		inputTextErrorCurrentGroup = currentlyEditingFormStatus.inputTextError;
		submitBtnCSSCurrentGroup = currentlyEditingFormStatus.submitBtnCSS;
	}

	function onAdd() {
		updateNode(profile, {
			...profile,
			groupings: [...profile.groupings, newProfileGroup],
		});
		setNewProfileGroup({
			title: "",
			description: "",
			members: [],
		});
	}

	function onEditFocus(i: number) {
		if (
			currentlyEditingProfileGroup?.profileGroup.title ==
			profile.groupings[i].title
		) {
			setCurrentlyEditingProfileGroup(null);
		} else {
			setCurrentlyEditingProfileGroup({
				index: i,
				profileGroup: profile.groupings[i],
			});
		}
	}

	function onEditSubmit() {
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.map((group, i) => {
				if (
					currentlyEditingProfileGroup &&
					currentlyEditingProfileGroup.index == i
				) {
					return currentlyEditingProfileGroup.profileGroup;
				}
				return group;
			}),
		});
	}

	function onDelete(i: number) {
		if (currentlyEditingProfileGroup?.index == i) {
			setCurrentlyEditingProfileGroup(null);
		} else if (
			currentlyEditingProfileGroup &&
			currentlyEditingProfileGroup.index > i
		) {
			setCurrentlyEditingProfileGroup({
				...currentlyEditingProfileGroup,
				index: currentlyEditingProfileGroup.index - 1,
			});
		}
		updateNode(profile, {
			...profile,
			groupings: profile.groupings.filter((_, index) => i != index),
		});
	}

	// useConsoleLogOnStateChange(currProfileGroup, currProfileGroup);
	return (
		<>
			<NavBar />

			<div className="m-auto mb-8 w-[90%] lg:max-w-[45rem]">
				<h1 className="text-center text-4xl font-bold underline">
					Profile Group Management
				</h1>

				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box mt-4 border p-4">
					<legend className="fieldset-legend">
						Add a new Profile Group
					</legend>

					<label className="label">Title</label>
					<div className="join">
						<input
							type="search"
							className="input join-item w-full"
							placeholder="New Profile Group"
							maxLength={CONSTANTS.INPUT_MAX}
							value={newProfileGroup.title}
							onChange={(e) => {
								setNewProfileGroup({
									...newProfileGroup,
									title: e.currentTarget.value,
								});
							}}
							onBlur={(e) => {
								setNewProfileGroup({
									...newProfileGroup,
									title: formatString(e.currentTarget.value),
								});
							}}
						/>
						<button
							className={`btn ${submitBtnCSS} join-item rounded-r-full`}
							onClick={() => onAdd()}
							disabled={submitBtnCSS == "btn-disabled"}
						>
							+
						</button>
					</div>
					<span className="text-error">{inputTextError}</span>
					<label className="label mt-4">Description</label>
					<textarea
						className="textarea w-full"
						value={newProfileGroup.description}
						onChange={(e) => {
							setNewProfileGroup({
								...newProfileGroup,
								description: e.currentTarget.value,
							});
						}}
						maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
						rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
					/>
				</fieldset>
				<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
					<legend className="fieldset-legend">Profile Groups</legend>
					{profile.groupings.length == 0 ? (
						<span className="text-center">
							This current profile has no groups!
						</span>
					) : (
						<ul className="flex max-h-72 flex-col gap-2 overflow-auto">
							{profile.groupings.map((prfoileGroup, i) => {
								return (
									<li
										key={i}
										className={`hover:bg-neutral ${currentlyEditingProfileGroup?.index == i ? "bg-neutral" : ""} flex rounded-2xl px-4`}
									>
										<label className="label">
											<button
												className={`btn btn-xs btn-ghost hover:bg-neutral hover:border-neutral ${currentlyEditingProfileGroup?.index == i ? "bg-neutral border-neutral" : ""} p-0`}
												onClick={() => onEditFocus(i)}
											>
												<img
													src={edit}
													alt=""
													className="w-4"
												/>
											</button>
											<span className="text-primary ml-2">
												{prfoileGroup.title}
											</span>
										</label>
										<button
											className="ml-auto cursor-pointer p-2"
											onClick={() => onDelete(i)}
										>
											✕
										</button>
									</li>
								);
							})}
						</ul>
					)}
				</fieldset>
				{currentlyEditingProfileGroup ? (
					<fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4">
						<legend className="fieldset-legend">
							Currently Editing:{" "}
							{
								profile.groupings[
									currentlyEditingProfileGroup.index
								].title
							}
						</legend>

						<label className="label">Title</label>
						<input
							type="search"
							className="input w-full"
							value={
								currentlyEditingProfileGroup.profileGroup.title
							}
							onChange={(e) => {
								setCurrentlyEditingProfileGroup({
									...currentlyEditingProfileGroup,
									profileGroup: {
										...currentlyEditingProfileGroup.profileGroup,
										title: e.currentTarget.value,
									},
								});
							}}
							onBlur={(e) => {
								setCurrentlyEditingProfileGroup({
									...currentlyEditingProfileGroup,
									profileGroup: {
										...currentlyEditingProfileGroup.profileGroup,
										title: formatString(
											e.currentTarget.value,
										),
									},
								});
							}}
						/>
						<span className="text-error">
							{inputTextErrorCurrentGroup}
						</span>

						<label className="label mt-4">Description</label>
						<textarea
							className="textarea w-full"
							value={
								currentlyEditingProfileGroup.profileGroup
									.description
							}
							onChange={(e) => {
								setCurrentlyEditingProfileGroup({
									...currentlyEditingProfileGroup,
									profileGroup: {
										...currentlyEditingProfileGroup.profileGroup,
										description: e.currentTarget.value,
									},
								});
							}}
							maxLength={CONSTANTS.TEXTAREA.TEXTAREA_MAX}
							rows={CONSTANTS.TEXTAREA.TEXTAREA_ROWS}
						/>
						<button
							className={`btn ${submitBtnCSSCurrentGroup} mt-2`}
							disabled={
								submitBtnCSSCurrentGroup == "btn-disabled"
							}
							onClick={onEditSubmit}
						>
							Confirm Edits
						</button>
					</fieldset>
				) : null}
			</div>
		</>
	);
}
